# benchmark-datastar

Idea: simple `innerHTML` benchmark for jQuery, htmx, and Datastar.

- `small.html` consists of 100 elements
- `big.html` consists of 5,000 elements

## Results

```
=== small.html ===
jquery     median  15.60 ms
htmx       median  16.90 ms
datastar   median  16.20 ms

=== big.html ===
jquery     median  23.40 ms
htmx       median 140.70 ms
datastar   median  29.90 ms
```

---

## Installation

To install CLI progress and Playwright dependencies:

```bash
bun install
# Note: downloads Chromium, Firefox, WebKit, etc
bunx playwright install --with-deps
```

## Benchmark

To run:

```bash
# Start the server in one terminal
bun server.ts

# Run the benchmark in another
bun runner.ts
```