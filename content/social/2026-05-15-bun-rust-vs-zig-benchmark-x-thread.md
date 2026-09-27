# X Thread Draft: Bun Rust vs Zig Benchmark

Post URL: https://shankhadeep.dev/blog/bun-rust-vs-zig-benchmark
Repo: https://github.com/Iamshankhadeep/bun-rust-vs-zig-benchmark

## 1

I benchmarked Bun's Rust rewrite PR build against Bun v1.3.14 stable on my M1 MacBook Air.

Narrow question: how does the exact Rust PR artifact compare with the stable Zig baseline on this one machine?

Raw data + scripts are public.

## 2

Setup:

- Stable: Bun v1.3.14, `1.3.14+0d9b296af`
- Rust PR artifact: `1.3.14-canary.1+ed1a70f81`
- Machine: M1 MacBook Air, 16 GB RAM, macOS 26.4.1
- Runner: `hyperfine`

No ambient `bun` from PATH.

## 3

Tooling results:

- `bun --version`: Rust 1.03x faster
- `bun eval`: Rust 1.07x faster
- `bun build` TSX fixture: Zig 1.03x faster
- `bun test` fixture: Rust 1.23x faster
- warm `bun install`: Rust 1.07x faster

## 4

Runtime workloads:

- loops: Rust 1.02x faster
- JSON: Rust 1.01x faster
- strings/regex: Rust 1.01x faster
- filesystem: Rust 1.01x faster
- self-contained `Bun.serve()` HTTP: Rust 1.33x faster

Most runtime cases were close. HTTP stood out.

## 5

Caveat: this is not a universal Bun performance verdict.

It is one M1 Mac, one macOS version, one fixture set, and one exact PR build.

The useful signal: the Rust rewrite was already neutral-to-faster on most paths I measured, with visible wins in `bun test` and HTTP.

## 6

Full write-up:
https://shankhadeep.dev/blog/bun-rust-vs-zig-benchmark

Benchmark repo with scripts, raw JSON, tables, binary hashes, and machine metadata:
https://github.com/Iamshankhadeep/bun-rust-vs-zig-benchmark
