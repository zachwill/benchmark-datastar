// Simple benchmark using event timestamps
export function benchmark(lib, startTime, endTime) {
  const ms = +(endTime - startTime).toFixed(2);
  const result = { lib, ms, timestamp: Date.now() };

  // Store in global for Playwright to access directly
  if (!window.benchmarkResults) window.benchmarkResults = [];
  window.benchmarkResults.push(result);

  // Also console.log for debugging
  console.log(`${lib}: ${ms}ms`);
  return result;
}