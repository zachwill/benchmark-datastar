# benchmark-datastar

Idea: simple `innerHTML` benchmark for Datastar, htmx, Idiomorph, and jQuery.

- `small.html` consists of 100 elements
- `big.html` consists of 5,000 elements

## Results

```
=== small.html (median) ===
vanilla            15.90 ms
jquery             16.10 ms
datastar-replace   16.10 ms
datastar           16.10 ms
htmx               17.10 ms
idiomorph          19.45 ms

=== big.html (median) ===
vanilla            23.20 ms
jquery             23.60 ms
datastar-replace   26.40 ms
datastar           29.80 ms
htmx              143.35 ms
idiomorph        2811.05 ms
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