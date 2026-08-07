import { RateLimiter } from '../lib/api/rateLimiter';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Mock the telemetry logger
jest.mock('../telemetry', () => ({
  logTrace: jest.fn(),
  reportWebVitalsToTelemetry: jest.fn(),
}));

describe('RateLimiter Resilience Patterns', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('Exponential backoff on 429 Too Many Requests', async () => {
    const rateLimiter = new RateLimiter({
      baseBackoffMs: 10, // Small for tests
      maxRetries: 2,
    });

    let attemptCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      attemptCount++;
      if (attemptCount <= 2) {
        return Promise.resolve(new Response(null, { status: 429 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
    });

    const startTime = Date.now();
    const response = await rateLimiter.fetchWithResilience('https://api.example.com/test');
    const endTime = Date.now();

    expect(attemptCount).toBe(3); // 2 failures + 1 success
    expect(response.ok).toBe(true);
    // Backoffs: 10ms (retry 1), 20ms (retry 2)
    expect(endTime - startTime).toBeGreaterThanOrEqual(30);
  });

  test('Circuit breaker trips after repeated 5xx failures and recovers', async () => {
    const rateLimiter = new RateLimiter({
      baseBackoffMs: 10,
      maxRetries: 1, // Minimize retries to trip breaker faster
      circuitBreakerThreshold: 2,
      circuitBreakerResetTimeoutMs: 50, // Short reset for tests
    });

    // 1st call will fail (500) and retry (500) -> 2 failures -> Breaker OPEN
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve(new Response(null, { status: 500 }));
    });

    // We expect this to throw because retries are exhausted (max 1 retry = 2 attempts)
    await expect(rateLimiter.fetchWithResilience('https://api.example.com/test')).rejects.toThrow();

    // Now breaker should be OPEN. Next call should fail fast.
    await expect(rateLimiter.fetchWithResilience('https://api.example.com/test')).rejects.toThrow('Circuit Breaker is OPEN');
    
    // We shouldn't have called fetch again since breaker is open
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Wait for reset timeout
    await new Promise(resolve => setTimeout(resolve, 60));

    // After timeout, breaker is HALF_OPEN. It will attempt fetch again.
    // Let's make it succeed this time.
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
    });

    const response = await rateLimiter.fetchWithResilience('https://api.example.com/test');
    expect(response.ok).toBe(true);
    
    // It should now be CLOSED.
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorBoundary Fallback UI', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  test('Displays fallback UI on error', () => {
    // Suppress console.error for expected error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
