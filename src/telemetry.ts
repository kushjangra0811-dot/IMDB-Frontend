export const logTrace = (message: string, data?: any) => {
  // In a real application, this might send to Datadog, Sentry, New Relic, etc.
  const timestamp = new Date().toISOString();
  console.log(`[TRACE ${timestamp}] ${message}`, data || '');
};

export const reportWebVitalsToTelemetry = (metric: any) => {
  const { name, value, id } = metric;
  logTrace(`Web Vital: ${name}`, { value, id });
  // Could also send to a telemetry endpoint:
  // navigator.sendBeacon('/analytics', JSON.stringify({ name, value, id }));
};
