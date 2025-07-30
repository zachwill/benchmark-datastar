# benchmark-datastar

## Results

```
=== small.html ===
jquery     median 0.60 ms
htmx       median 0.90 ms

=== big.html ===
jquery     median 5.80 ms
htmx       median 124.70 ms
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