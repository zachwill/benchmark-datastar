# benchmark-datastar

Idea: simple `innerHTML` benchmark for Datastar, htmx, Idiomorph, and jQuery.

- `small.html` consists of 100 elements
- `big.html` consists of 5,000 elements

## Results

```
=== small.html ===
datastar           15.95 ms
datastar-replace   15.70 ms
htmx               17.20 ms
idiomorph          19.45 ms
jquery             15.70 ms
vanilla            15.70 ms

=== big.html ===
datastar           29.95 ms
datastar-replace   22.60 ms
htmx              138.90 ms
idiomorph        2811.05 ms
jquery             23.60 ms
vanilla            23.40 ms
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