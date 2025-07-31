// @ts-nocheck
import { chromium, type Page, type Browser } from "playwright";
import cliProgress from "cli-progress";

const ITERATIONS = 20;
const SIZES = ["small", "big"] as const;
const LIBS = ["datastar", "htmx", "idiomorph", "jquery"] as const;
const BASE_URL = "http://localhost:3000";

declare global {
  interface Window {
    benchmarkResults: Array<{ lib: string; ms: number; timestamp: number }>;
  }
}

interface Sample {
  lib: string;
  size: string;
  ms: number;
}

const PROGRESS_CONFIG = {
  format: 'Benchmark |{bar}| {percentage}% | {value}/{total} | ETA: {eta}s | {lib}/{size} ({iteration}) | Last: {lastTime}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
  stopOnComplete: true,
  clearOnComplete: false
};

async function collectSamples(
  page: Page,
  lib: string,
  size: string,
  progressBar: cliProgress.SingleBar
): Promise<Sample[]> {
  const samples: Sample[] = [];
  await page.goto(`${BASE_URL}/${lib}`);
  await page.waitForLoadState('domcontentloaded');

  for (let i = 0; i < ITERATIONS; i++) {
    await page.evaluate(() => { window.benchmarkResults = []; });
    await page.click(`#${size}`);

    const result = await page.waitForFunction(() => {
      return window.benchmarkResults?.length > 0
        ? window.benchmarkResults[window.benchmarkResults.length - 1]
        : false;
    });

    const benchmarkData = await result.jsonValue();
    samples.push({ lib: benchmarkData.lib, size, ms: benchmarkData.ms });

    progressBar.increment(1, {
      lib,
      size,
      iteration: `${i + 1}/${ITERATIONS}`,
      lastTime: `${benchmarkData.ms.toFixed(2)}ms`
    });
  }
  return samples;
}

function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function createProgressBar(): cliProgress.SingleBar {
  const totalOperations = SIZES.length * LIBS.length * ITERATIONS;
  const progressBar = new cliProgress.SingleBar(PROGRESS_CONFIG, cliProgress.Presets.shades_classic);

  console.log(`Starting benchmark: ${SIZES.length} sizes × ${LIBS.length} libs × ${ITERATIONS} iterations = ${totalOperations} total operations\n`);
  progressBar.start(totalOperations, 0, { lib: '', size: '', iteration: '', lastTime: '' });

  return progressBar;
}

function printResults(samples: Sample[]): void {
  for (const size of SIZES) {
    console.log(`\n=== ${size}.html ===`);
    for (const lib of LIBS) {
      const subset = samples.filter(s => s.lib === lib && s.size === size);
      const times = subset.map(s => s.ms);
      const medianTime = calculateMedian(times);
      console.log(lib.padEnd(10), "median", medianTime.toFixed(2) + " ms");
    }
  }
}

async function runBenchmark(): Promise<void> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const progressBar = createProgressBar();

    const allSamples: Sample[] = [];
    for (const size of SIZES) {
      for (const lib of LIBS) {
        const samples = await collectSamples(page, lib, size, progressBar);
        allSamples.push(...samples);
      }
    }

    progressBar.stop();
    console.log('\n');

    printResults(allSamples);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

await runBenchmark();