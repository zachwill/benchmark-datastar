// @ts-nocheck
import { chromium } from "playwright";   // bun add -d playwright
const N = 200;                           // iterations per lib
const SIZES = ["small", "big"];
const LIBS = ["jquery", "htmx", "datastar"] as const;

const browser = await chromium.launch();
const page = await browser.newPage();

interface Sample { lib: string; size: string; ms: number; }

async function collect(lib: string, size: string): Promise<Sample[]> {
  const out: Sample[] = [];
  await page.goto(`http://localhost:3000/${lib}`);
  await page.waitForFunction(() => typeof window.start === "function");
  for (let i = 0; i < N; i++) {
    const result = await page.evaluate((s) => {
      return new Promise(res => {
        window.start(s);                     // invokes page-global start()
        window.addEventListener("bench-done", e => res(e.detail), { once: true });
      });
    }, size);
    out.push({ ...result, size });
  }
  return out;
}

// Patch pages to dispatch bench-done (so the runner above works)
page.exposeFunction("benchResult", (data: any) => {
  page.evaluate(data => {
    window.dispatchEvent(new CustomEvent("bench-done", { detail: data }));
  }, data);
});

// Monkey-patch the table writer so it calls benchResult()
await page.addInitScript(() => {
  console.table = (rows) => benchResult(rows[0]);
});

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