# benchmark-datastar

## Results

```
=== small.html ===
jquery     median 0.60 ms
htmx       median 1.00 ms

=== big.html ===
jquery     median 4.90 ms
htmx       median 126.30 ms
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