import { logTrace } from '../../telemetry';

type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface RateLimiterConfig {
  bucketSize: number;
  tokensPerInterval: number;
  intervalMs: number;
  maxRetries: number;
  baseBackoffMs: number;
  circuitBreakerThreshold: number;
  circuitBreakerResetTimeoutMs: number;
}

export class RateLimiter {
  private config: RateLimiterConfig;
  private tokens: number;
  private lastRefill: number;
  
  // Circuit Breaker State
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount: number = 0;
  private nextAttempt: number = 0;

  constructor(config?: Partial<RateLimiterConfig>) {
    this.config = {
      bucketSize: 100,
      tokensPerInterval: 100,
      intervalMs: 10000,
      maxRetries: 3,
      baseBackoffMs: 1000,
      circuitBreakerThreshold: 5,
      circuitBreakerResetTimeoutMs: 30000,
      ...config,
    };
    this.tokens = this.config.bucketSize;
    this.lastRefill = Date.now();
  }

  private refillTokens() {
    const now = Date.now();
    const elapsedTime = now - this.lastRefill;
    const intervalsPassed = Math.floor(elapsedTime / this.config.intervalMs);
    
    if (intervalsPassed > 0) {
      this.tokens = Math.min(
        this.config.bucketSize,
        this.tokens + intervalsPassed * this.config.tokensPerInterval
      );
      this.lastRefill = now;
    }
  }

  private async waitForToken(): Promise<void> {
    return new Promise((resolve) => {
      const tryConsume = () => {
        this.refillTokens();
        if (this.tokens > 0) {
          this.tokens--;
          resolve();
        } else {
          setTimeout(tryConsume, 50); // Check every 50ms
        }
      };
      tryConsume();
    });
  }

  private setState(newState: CircuitBreakerState) {
    if (this.state !== newState) {
      logTrace(`Circuit Breaker transitioned from ${this.state} to ${newState}`);
      this.state = newState;
    }
  }

  private recordSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.setState('CLOSED');
    }
  }

  private recordFailure() {
    this.failureCount++;
    if (this.state === 'CLOSED' && this.failureCount >= this.config.circuitBreakerThreshold) {
      this.setState('OPEN');
      this.nextAttempt = Date.now() + this.config.circuitBreakerResetTimeoutMs;
    } else if (this.state === 'HALF_OPEN') {
      this.setState('OPEN');
      this.nextAttempt = Date.now() + this.config.circuitBreakerResetTimeoutMs;
    }
  }

  public async fetchWithResilience(url: string, options: RequestInit = {}): Promise<Response> {
    let retries = 0;

    while (true) {
      // Check circuit breaker
      if (this.state === 'OPEN') {
        if (Date.now() >= this.nextAttempt) {
          this.setState('HALF_OPEN');
        } else {
          logTrace(`Circuit Breaker is OPEN. Request to ${url} failed fast.`);
          throw new Error('Circuit Breaker is OPEN');
        }
      }

      await this.waitForToken();

      try {
        const startTime = Date.now();
        const response = await fetch(url, options);
        logTrace(`Fetch ${url} took ${Date.now() - startTime}ms. Status: ${response.status}`);

        if (response.ok) {
          this.recordSuccess();
          return response;
        }

        if (response.status === 429 || response.status >= 500) {
          this.recordFailure();
          if (retries >= this.config.maxRetries) {
            throw new Error(`Request failed with status ${response.status} after ${retries} retries.`);
          }
          const backoff = this.config.baseBackoffMs * Math.pow(2, retries);
          const jitter = Math.random() * 0.3 * backoff; // 30% jitter
          const finalBackoff = backoff + jitter;
          logTrace(`Retrying ${url} in ${Math.round(finalBackoff)}ms (Retry ${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, finalBackoff));
          retries++;
          continue; // Retry
        }

        // For 4xx errors other than 429, don't retry and record as success for the circuit breaker
        // since it's likely a client error (e.g. 404, 400).
        this.recordSuccess();
        return response;

      } catch (error) {
        // Network error (e.g., failed to fetch)
        this.recordFailure();
        if (retries >= this.config.maxRetries) {
          throw error;
        }
        const backoff = this.config.baseBackoffMs * Math.pow(2, retries);
        const jitter = Math.random() * 0.3 * backoff; // 30% jitter
        const finalBackoff = backoff + jitter;
        logTrace(`Network error fetching ${url}. Retrying in ${Math.round(finalBackoff)}ms (Retry ${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, finalBackoff));
        retries++;
      }
    }
  }
}

export const globalRateLimiter = new RateLimiter();
