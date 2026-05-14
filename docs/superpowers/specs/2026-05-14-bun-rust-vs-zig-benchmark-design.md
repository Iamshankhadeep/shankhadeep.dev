# Bun Rust vs Zig Benchmark Design

Date: 2026-05-14

## Goal

Create an auditable benchmark project comparing Bun v1.3.14 stable, the last stable Zig baseline, against the exact Rust rewrite PR build. Use the benchmark results to publish a blog post on `shankhadeep.dev` and a concise Twitter/X launch post.

The benchmark should answer one narrow question: how did the Rust rewrite perform against the stable Zig build on this specific Apple M1 MacBook Air? It should not claim to be a universal Bun performance verdict.

## Confirmed Facts

- Stable baseline: Bun v1.3.14 was published on 2026-05-13 and targets commit `0d9b296af33f2b851fcbf4df3e9ec89751734ba4`.
- Rust rewrite: GitHub PR `oven-sh/bun#30412`, titled "Rewrite Bun in Rust", was merged on 2026-05-14 at 08:09 UTC.
- Rust merge commit: `23427dbc12fdcff30c23a96a3d6a66d62fdc091d`.
- PR scale: 6,755 commits, 2,188 changed files, about 1,009,257 additions, and 4,024 deletions.
- Bun's own benchmarking docs recommend `hyperfine` for CLI/script benchmarks and recording exact `bun --revision` output.

Primary sources:

- https://bun.sh/blog/bun-v1.3.14
- https://github.com/oven-sh/bun/pull/30412
- https://bun.com/docs/project/benchmarking
- https://bun.com/docs/guides/util/upgrade
- https://bun.com/docs/project/contributing

## Benchmark Repository

Create a separate GitHub repository:

```text
bun-rust-vs-zig-benchmark
```

Proposed structure:

```text
benchmarks/
  run-startup.sh
  run-build.sh
  run-test.sh
  run-install.sh

fixtures/
  react-app/
  test-suite/
  install-fixture/

scripts/
  install-buns.sh
  collect-machine-info.sh
  run-all.sh
  summarize-results.ts

results/
  raw/
  tables/
  machine.json

README.md
METHODOLOGY.md
```

## Binary Pinning

The benchmark must install or locate two separate Bun executables and never rely on whichever `bun` appears first on `PATH`.

- `./bin/bun-zig`: Bun v1.3.14 stable from the official `bun-v1.3.14` release.
- `./bin/bun-rust`: exact Rust rewrite build from PR #30412 or the closest downloadable build for merge commit `23427dbc12fdcff30c23a96a3d6a66d62fdc091d`.

Every run must record:

- `bun --version`
- `bun --revision`
- executable path
- SHA-256 of the binary
- installation source URL or artifact identifier

If an exact PR artifact cannot be downloaded, the benchmark must stop and document the blocker rather than silently using a later canary.

## Machine Metadata

Publish sanitized local machine details:

```text
Machine: MacBook Air
Model: MacBookAir10,1
Chip: Apple M1
CPU cores: 8 total, 4 performance + 4 efficiency
Memory: 16 GB
OS: macOS 26.4.1
Kernel: Darwin 25.4.0 arm64
```

Do not publish serial number, hardware UUID, provisioning UDID, or other unique device identifiers.

## Benchmarks

Use `hyperfine` with fixed warmups and run counts. Export raw JSON and Markdown tables for each benchmark.

Initial benchmark suite:

1. Startup and version command latency
   - `bun --version`
   - `bun -e "console.log(1)"`

2. TypeScript/JSX runtime startup
   - run a generated TypeScript/TSX fixture through each binary

3. Build benchmark
   - `bun build` on a generated React component fixture
   - fixture is committed so the benchmark is repeatable

4. Test runner benchmark
   - `bun test` on a generated test suite
   - enough files/tests to measure more than startup noise

5. Package install benchmark
   - use a committed lockfile and fixture package
   - measure warm install separately from cold/cache-sensitive install
   - make cache and `node_modules` handling explicit in the benchmark script

The HTTP benchmark is optional. Include it only if the load generator and setup are fair on macOS and do not dominate the result. If included, keep it in a separate section with extra caveats.

## Methodology Rules

- Use the same fixture, environment variables, and current working directory for both binaries.
- Run on AC power if possible and close obvious background workloads before measuring.
- Record exact commands in `METHODOLOGY.md`.
- Use `hyperfine --warmup` and `--runs`; choose run counts high enough for stable confidence intervals.
- Preserve raw `hyperfine` JSON in `results/raw/`.
- Generate Markdown tables in `results/tables/`.
- Treat very small differences as neutral when the confidence intervals overlap.
- Phrase conclusions as local measurements, not global truth.

## Blog Post

Add a blog post to `shankhadeep.dev` after the benchmark repo exists and the results are generated.

Post outline:

1. Context: Bun's Rust rewrite and why it is notable.
2. What was compared: Bun v1.3.14 stable vs exact Rust rewrite PR build.
3. Machine: sanitized M1 MacBook Air details.
4. Methodology: tools, fixtures, run counts, binary revisions.
5. Results: compact tables and the highest-signal observations.
6. Caveats: local machine, macOS, canary/PR-build status, benchmark limits.
7. Takeaway: measured results plus what still needs broader validation.
8. Link to benchmark repository and raw data.

## Twitter/X Post

Publish a short thread after the blog is ready:

1. Hook: benchmarked Bun's Rust rewrite against Bun v1.3.14 Zig on an M1 MacBook Air.
2. Setup: exact revisions and benchmark repo link.
3. Results: one compact table or the clearest headline numbers.
4. Caveat: this is a local M1 benchmark, not a universal verdict.
5. Link: blog post and GitHub repo.

## Error Handling

- If the exact Rust PR build is unavailable, stop and document the failure.
- If a benchmark fails on one binary but not the other, preserve stdout/stderr and mark the row as failed instead of deleting it.
- If `hyperfine` is missing, install it via Homebrew as part of setup instructions.
- If a result is too noisy, rerun with a higher run count or mark it inconclusive.

## Testing and Verification

Before publishing:

- Run `scripts/collect-machine-info.sh` and inspect the sanitized output.
- Run `scripts/install-buns.sh` and verify both `bun --revision` values are captured.
- Run `scripts/run-all.sh` end to end.
- Regenerate result tables from raw JSON.
- Confirm README and methodology commands match the actual scripts.
- Build the portfolio site after adding the blog post.

## Out of Scope

- Building Bun from source unless no exact PR binary is available and the user explicitly approves the added time and complexity.
- Claims about Linux, Windows, x64, or production server workloads.
- Benchmarking Node.js, Deno, or other JavaScript runtimes.
- Publishing private machine identifiers.
