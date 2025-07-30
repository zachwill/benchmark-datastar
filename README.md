# benchmark-datastar

Idea: simple benchmark for jQuery, htmx, and Datastar.

## Results

```
=== small.html ===
jquery     median 15.60 ms
htmx       median 16.90 ms
datastar   median 16.20 ms

=== big.html ===
jquery     median 23.40 ms
htmx       median 140.70 ms
datastar   median 29.90 ms
```

---

## Installation

To install Playwright dependencies:

```bash
bun install

# Note: downloads Chromium, Firefox, WebKit, etc
bunx playwright install --with-deps
```

## Benchmark

To run:

```bash
# Start the server in one terminal
bun run server.ts

# Run the benchmark in another
bun run runner.ts
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.