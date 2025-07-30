// @ts-nocheck
import { chromium } from "playwright";   // bun add -d playwright
import cliProgress from "cli-progress";  // bun add cli-progress
const N = 100;                           // iterations per lib (testing)
const SIZES = ["small", "big"];
const LIBS = ["jquery", "htmx", "datastar"] as const;

// TypeScript declaration for benchmark results global
declare global {
  interface Window {
    benchmarkResults: Array<{ lib: string; ms: number; timestamp: number }>;
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();

interface Sample { lib: string; size: string; ms: number; }

async function collect(lib: string, size: string, progressBar: cliProgress.SingleBar): Promise<Sample[]> {
  const out: Sample[] = [];
  await page.goto(`http://localhost:3000/${lib}`);
  await page.waitForLoadState('domcontentloaded');

  for (let i = 0; i < N; i++) {
    // Clear any existing results before this click
    await page.evaluate(() => { window.benchmarkResults = []; });
    await page.click(`#${size}`);

    // Wait for the benchmark result to appear in window.benchmarkResults
    const result = await page.waitForFunction(() => {
      return window.benchmarkResults && window.benchmarkResults.length > 0
        ? window.benchmarkResults[window.benchmarkResults.length - 1]
        : false;
    });

    const benchmarkData = await result.jsonValue();
    out.push({ lib: benchmarkData.lib, size, ms: benchmarkData.ms });

    // Update progress bar
    progressBar.increment(1, {
      lib: lib,
      size: size,
      iteration: `${i + 1}/${N}`,
      lastTime: `${benchmarkData.ms.toFixed(2)}ms`
    });
  }
  return out;
}

// ---------- run ----------
const totalOperations = SIZES.length * LIBS.length * N;

// Create progress bar
const progressBar = new cliProgress.SingleBar({
  format: 'Benchmark |{bar}| {percentage}% | {value}/{total} | ETA: {eta}s | {lib}/{size} ({iteration}) | Last: {lastTime}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
  stopOnComplete: true,
  clearOnComplete: false
}, cliProgress.Presets.shades_classic);

console.log(`Starting benchmark: ${SIZES.length} sizes × ${LIBS.length} libs × ${N} iterations = ${totalOperations} total operations\n`);
progressBar.start(totalOperations, 0, {
  lib: '',
  size: '',
  iteration: '',
  lastTime: ''
});

const all: Sample[] = [];
for (const size of SIZES) {
  for (const lib of LIBS) {
    all.push(...await collect(lib, size, progressBar));
  }
}

progressBar.stop();
console.log('\n'); // Add space after progress bar
await browser.close();

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