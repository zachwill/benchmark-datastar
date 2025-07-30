// @ts-nocheck
import { chromium } from "playwright";   // bun add -d playwright
const N = 20;                           // iterations per lib
const SIZES = ["small", "big"];
const LIBS = ["jquery", "htmx", "datastar"] as const;

const browser = await chromium.launch();
const page = await browser.newPage();

interface Sample { lib: string; size: string; ms: number; }

async function collect(lib: string, size: string): Promise<Sample[]> {
  const out: Sample[] = [];
  await page.goto(`http://localhost:3000/${lib}`);
  await page.waitForLoadState('domcontentloaded');

  for (let i = 0; i < N; i++) {
    // Listen for console logs to capture benchmark results
    const consolePromise = new Promise<Sample>((resolve) => {
      const handler = (msg: any) => {
        const text = msg.text();
        // Parse benchmark console log: "htmx: 123.45ms"
        const match = text.match(/^(\w+): ([\d.]+)ms$/);
        if (match) {
          const [, benchLib, ms] = match;
          if (benchLib === lib) {
            page.off('console', handler);
            resolve({ lib: benchLib, size, ms: parseFloat(ms) });
          }
        }
      };
      page.on('console', handler);
    });

    // Actually click the button!
    await page.click(`#${size}`);

    // Wait for the benchmark result
    const result = await consolePromise;
    out.push(result);

    // Small delay between iterations
    await page.waitForTimeout(100);
  }
  return out;
}

// ---------- run ----------
const all: Sample[] = [];
for (const size of SIZES)
  for (const lib of LIBS)
    all.push(...await collect(lib, size));

await browser.close();

// ---------- stats ----------
function median(v: number[]) {
  const s = [...v].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

for (const size of SIZES) {
  console.log(`\n=== ${size}.html ===`);
  LIBS.forEach(lib => {
    const subset = all.filter(r => r.lib === lib && r.size === size);
    const times = subset.map(r => r.ms);
    console.log(lib.padEnd(10), "median", median(times).toFixed(2) + " ms");
  });
}