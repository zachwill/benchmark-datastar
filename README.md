# benchmark-datastar

Idea: simple `innerHTML` benchmark for jQuery, htmx, and Datastar.

- `small.html` consists of 100 elements
- `big.html` consists of 5,000 elements

## Results

```
=== small.html ===
datastar   median   16.20 ms
htmx       median   16.75 ms
idiomorph  median   19.30 ms
jquery     median   16.15 ms

=== big.html ===
datastar   median   29.05 ms
htmx       median  139.95 ms
idiomorph  median 2867.80 ms
jquery     median   22.60 ms
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