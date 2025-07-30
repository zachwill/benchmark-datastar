// Simple benchmark using event timestamps
export function benchmark(lib, startTime, endTime) {
  const ms = +(endTime - startTime).toFixed(2);
  const result = { lib, ms };
  console.log(`${lib}: ${ms}ms`);
  return result;
}