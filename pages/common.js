export const now = () => performance.now();
export const heap = () => performance.memory?.usedJSHeapSize || 0;

export function run(name, doRequest) {
  return new Promise((res) => {
    const mem0 = heap(), t0 = now();
    doRequest(() => {                     // callback fired after DOM swap
      const result = {
        lib: name,
        ms: +(now() - t0).toFixed(2),
        heapKB: +((heap() - mem0) / 1024).toFixed(1)
      };
      console.table([result]);
      res(result);                        // allow Playwright to collect
    });
  });
}