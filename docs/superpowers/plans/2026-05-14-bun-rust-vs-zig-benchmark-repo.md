# Bun Rust vs Zig Benchmark Repo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a separate benchmark repository at `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark` comparing Bun v1.3.14 stable against the exact Rust rewrite PR build.

**Architecture:** The repository is a self-contained benchmark harness with pinned Bun binaries in `bin/`, deterministic fixtures in `fixtures/`, benchmark entrypoints in `benchmarks/`, setup/summary utilities in `scripts/`, and auditable output in `results/`. Scripts never use ambient `bun`; they call `./bin/bun-zig` and `./bin/bun-rust` explicitly.

**Tech Stack:** Bash, Bun, TypeScript, `hyperfine`, GitHub CLI, macOS command-line tools.

---

## Scope Check

This plan implements only the benchmark repository. The blog post and Twitter/X post depend on generated results and will be planned after the benchmark repo runs end to end.

## File Structure

- Create repo: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark`
- Create: `.gitignore` for generated caches, temporary outputs, and downloaded binaries.
- Create: `README.md` with project purpose, quickstart, machine caveat, and result links.
- Create: `METHODOLOGY.md` with exact comparison target and benchmark rules.
- Create: `scripts/lib.sh` with shared paths and validation helpers.
- Create: `scripts/install-buns.sh` to install `bin/bun-zig` and `bin/bun-rust`.
- Create: `scripts/collect-machine-info.sh` to write sanitized `results/machine.json`.
- Create: `scripts/create-fixtures.sh` to generate deterministic fixtures.
- Create: `scripts/run-all.sh` to run setup, benchmarks, and summary generation.
- Create: `scripts/summarize-results.ts` to convert raw `hyperfine` JSON into `results/SUMMARY.md`.
- Create: `benchmarks/run-startup.sh`, `benchmarks/run-build.sh`, `benchmarks/run-test.sh`, `benchmarks/run-install.sh`.
- Generate: `fixtures/react-app`, `fixtures/test-suite`, `fixtures/install-fixture`.
- Generate: `results/raw`, `results/tables`, `results/machine.json`, `results/SUMMARY.md`.

### Task 1: Bootstrap Local Repository

**Files:**
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/.gitignore`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/README.md`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/METHODOLOGY.md`

- [ ] **Step 1: Create the repo directory and initialize git**

Run:

```bash
cd /Users/blank/Github/sidehustle
mkdir -p bun-rust-vs-zig-benchmark
cd bun-rust-vs-zig-benchmark
git init
```

Expected: git initializes an empty repository.

- [ ] **Step 2: Add `.gitignore`**

Create `.gitignore`:

```gitignore
.DS_Store
.cache/
tmp/
bin/
fixtures/install-fixture/node_modules/
fixtures/install-fixture/bun.lockb
```

- [ ] **Step 3: Add `README.md`**

Create `README.md`:

```markdown
# Bun Rust vs Zig Benchmark

This repository benchmarks Bun v1.3.14 stable against the Rust rewrite PR build on one Apple M1 MacBook Air.

The goal is auditability. The scripts pin two separate Bun executables, collect sanitized machine metadata, run deterministic benchmark fixtures with `hyperfine`, and preserve raw result data.

## Comparison

| Label | Source | Expected revision |
| --- | --- | --- |
| `bun-zig` | Bun v1.3.14 stable release | `0d9b296af33f2b851fcbf4df3e9ec89751734ba4` |
| `bun-rust` | PR #30412 release artifact via `bun-pr` | `ed1a70f81708d7d137de8de057d11668c5f4e220` or merge commit `23427dbc12fdcff30c23a96a3d6a66d62fdc091d` |

If the PR artifact cannot be downloaded or its revision does not match the expected PR head or merge commit, the install script exits without running benchmarks.

## Requirements

- macOS on Apple Silicon
- `gh` authenticated with GitHub
- `hyperfine`
- `unzip`
- `curl`

Install `hyperfine` with:

```bash
brew install hyperfine
```

## Run

```bash
./scripts/create-fixtures.sh
./scripts/install-buns.sh
./scripts/collect-machine-info.sh
./scripts/run-all.sh
```

Generated outputs:

- `results/machine.json`
- `results/raw/*.json`
- `results/tables/*.md`
- `results/SUMMARY.md`
- `results/raw/binaries.json`

## Caveat

These are local measurements from one MacBook Air, not a universal performance claim about Bun on every platform or workload.
```

- [ ] **Step 4: Add `METHODOLOGY.md`**

Create `METHODOLOGY.md`:

```markdown
# Methodology

## Question

How does Bun's Rust rewrite PR build compare with Bun v1.3.14 stable on this Apple M1 MacBook Air?

## Binaries

The benchmark uses two executable files:

- `./bin/bun-zig`
- `./bin/bun-rust`

The scripts never call ambient `bun` from `PATH`.

`./scripts/install-buns.sh` records `--version`, `--revision`, path, SHA-256, and source URL in `results/raw/binaries.json`.

## Machine Metadata

`./scripts/collect-machine-info.sh` writes sanitized hardware and OS details to `results/machine.json`.

The script intentionally excludes serial number, hardware UUID, provisioning UDID, and other unique device identifiers.

## Benchmark Tool

The benchmark runner is `hyperfine`.

Rules:

- Startup benchmark: 5 warmups, 30 measured runs.
- Build benchmark: 3 warmups, 15 measured runs.
- Test benchmark: 3 warmups, 20 measured runs.
- Install benchmark: 2 warmups, 10 measured runs after separate cache prewarming.
- Raw JSON output is kept under `results/raw/`.
- Markdown tables are kept under `results/tables/`.
- Very small differences with overlapping uncertainty are treated as neutral.

## Benchmarks

### Startup

Commands:

- `./bin/bun-zig --version`
- `./bin/bun-rust --version`
- `./bin/bun-zig -e "console.log(1)"`
- `./bin/bun-rust -e "console.log(1)"`

### Build

Builds the deterministic TSX fixture in `fixtures/react-app` with `bun build`.

### Test

Runs the deterministic `bun:test` suite in `fixtures/test-suite`.

### Install

Runs warm `bun install --frozen-lockfile` against `fixtures/install-fixture` with separate cache directories for each binary.

The install benchmark measures package manager behavior after the registry data and package tarballs are already available locally.
```

- [ ] **Step 5: Commit bootstrap docs**

Run:

```bash
git add .gitignore README.md METHODOLOGY.md
git commit -m "docs: bootstrap benchmark repo"
```

Expected: commit succeeds with three files.

### Task 2: Add Shared Script Helpers

**Files:**
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/scripts/lib.sh`

- [ ] **Step 1: Create `scripts/lib.sh`**

Create `scripts/lib.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIG_BUN="$ROOT/bin/bun-zig"
RUST_BUN="$ROOT/bin/bun-rust"
RAW_DIR="$ROOT/results/raw"
TABLE_DIR="$ROOT/results/tables"
TMP_DIR="$ROOT/tmp"

ensure_dirs() {
  mkdir -p "$ROOT/bin" "$RAW_DIR" "$TABLE_DIR" "$TMP_DIR"
}

require_executable() {
  local path="$1"
  if [[ ! -x "$path" ]]; then
    echo "Missing executable: $path" >&2
    exit 1
  fi
}

require_hyperfine() {
  if ! command -v hyperfine >/dev/null 2>&1; then
    echo "Missing hyperfine. Install it with: brew install hyperfine" >&2
    exit 1
  fi
}

require_binaries() {
  require_executable "$ZIG_BUN"
  require_executable "$RUST_BUN"
}

sha256_file() {
  shasum -a 256 "$1" | awk '{print $1}'
}

record_binaries() {
  ensure_dirs

  local zig_version zig_revision zig_sha rust_version rust_revision rust_sha
  zig_version="$("$ZIG_BUN" --version)"
  zig_revision="$("$ZIG_BUN" --revision)"
  zig_sha="$(sha256_file "$ZIG_BUN")"

  rust_version="$("$RUST_BUN" --version)"
  rust_revision="$("$RUST_BUN" --revision)"
  rust_sha="$(sha256_file "$RUST_BUN")"

  cat > "$RAW_DIR/binaries.json" <<JSON
{
  "bun_zig": {
    "label": "Bun v1.3.14 stable Zig baseline",
    "path": "$ZIG_BUN",
    "version": "$zig_version",
    "revision": "$zig_revision",
    "sha256": "$zig_sha",
    "source": "https://github.com/oven-sh/bun/releases/download/bun-v1.3.14/bun-darwin-aarch64.zip"
  },
  "bun_rust": {
    "label": "Bun Rust rewrite PR build",
    "path": "$RUST_BUN",
    "version": "$rust_version",
    "revision": "$rust_revision",
    "sha256": "$rust_sha",
    "source": "bunx bun-pr 30412"
  }
}
JSON
}
```

- [ ] **Step 2: Make helper executable**

Run:

```bash
chmod +x scripts/lib.sh
```

Expected: `scripts/lib.sh` is executable.

- [ ] **Step 3: Commit helper**

Run:

```bash
git add scripts/lib.sh
git commit -m "chore: add benchmark script helpers"
```

Expected: commit succeeds.

### Task 3: Add Binary Install and Machine Metadata Scripts

**Files:**
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/scripts/install-buns.sh`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/scripts/collect-machine-info.sh`

- [ ] **Step 1: Create `scripts/install-buns.sh`**

Create `scripts/install-buns.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ensure_dirs

stable_url="https://github.com/oven-sh/bun/releases/download/bun-v1.3.14/bun-darwin-aarch64.zip"
stable_zip="$TMP_DIR/bun-v1.3.14-darwin-aarch64.zip"
stable_extract="$TMP_DIR/bun-v1.3.14"

echo "Installing Bun v1.3.14 stable to $ZIG_BUN"
rm -rf "$stable_extract"
curl --fail --location --output "$stable_zip" "$stable_url"
unzip -oq "$stable_zip" -d "$stable_extract"
cp "$stable_extract/bun-darwin-aarch64/bun" "$ZIG_BUN"
chmod +x "$ZIG_BUN"

zig_revision="$("$ZIG_BUN" --revision)"
if [[ "$zig_revision" != *"0d9b296af"* ]]; then
  echo "Unexpected Bun v1.3.14 revision: $zig_revision" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Missing GitHub CLI. Install gh and authenticate before running this script." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
fi

echo "Installing Bun Rust rewrite PR build via bun-pr 30412"
PATH="$ROOT/bin:$HOME/.bun/bin:$PATH" "$ZIG_BUN" x bun-pr 30412

candidate=""
for path in "$HOME/.bun/bin/bun-30412" "$(command -v bun-30412 2>/dev/null || true)"; do
  if [[ -n "$path" && -x "$path" ]]; then
    candidate="$path"
    break
  fi
done

if [[ -z "$candidate" ]]; then
  echo "Unable to locate bun-30412 after running bun-pr. Not using a later canary." >&2
  exit 1
fi

cp "$candidate" "$RUST_BUN"
chmod +x "$RUST_BUN"

rust_revision="$("$RUST_BUN" --revision)"
if [[ "$rust_revision" != *"ed1a70f81708"* && "$rust_revision" != *"23427dbc12fd"* ]]; then
  echo "Rust build revision does not match PR #30412 head or merge commit: $rust_revision" >&2
  exit 1
fi

record_binaries

echo "Installed benchmark binaries:"
cat "$RAW_DIR/binaries.json"
```

- [ ] **Step 2: Create `scripts/collect-machine-info.sh`**

Create `scripts/collect-machine-info.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ensure_dirs

product_name="$(sw_vers -productName)"
product_version="$(sw_vers -productVersion)"
build_version="$(sw_vers -buildVersion)"
kernel="$(uname -a)"
chip="$(sysctl -n machdep.cpu.brand_string)"
model="$(sysctl -n hw.model)"
memory_bytes="$(sysctl -n hw.memsize)"
physical_cpu="$(sysctl -n hw.physicalcpu)"
logical_cpu="$(sysctl -n hw.logicalcpu)"
core_description="$(system_profiler SPHardwareDataType 2>/dev/null | awk -F': ' '/Total Number of Cores/ {print $2; exit}')"

cat > "$ROOT/results/machine.json" <<JSON
{
  "machine": "MacBook Air",
  "model": "$model",
  "chip": "$chip",
  "core_description": "$core_description",
  "physical_cpu": $physical_cpu,
  "logical_cpu": $logical_cpu,
  "memory_bytes": $memory_bytes,
  "memory_gb": 16,
  "os": "$product_name $product_version",
  "build": "$build_version",
  "kernel": "$kernel",
  "notes": "Serial number, hardware UUID, provisioning UDID, and other unique identifiers are intentionally excluded."
}
JSON

cat "$ROOT/results/machine.json"
```

- [ ] **Step 3: Make scripts executable**

Run:

```bash
chmod +x scripts/install-buns.sh scripts/collect-machine-info.sh
```

Expected: both scripts are executable.

- [ ] **Step 4: Commit setup scripts**

Run:

```bash
git add scripts/install-buns.sh scripts/collect-machine-info.sh
git commit -m "chore: add Bun install and machine metadata scripts"
```

Expected: commit succeeds.

### Task 4: Add Deterministic Fixture Generator

**Files:**
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/scripts/create-fixtures.sh`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/fixtures/react-app`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/fixtures/test-suite`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/fixtures/install-fixture`

- [ ] **Step 1: Create `scripts/create-fixtures.sh`**

Create `scripts/create-fixtures.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURES="$ROOT/fixtures"

rm -rf "$FIXTURES/react-app" "$FIXTURES/test-suite" "$FIXTURES/install-fixture"

mkdir -p "$FIXTURES/react-app/src/components"
mkdir -p "$FIXTURES/react-app/node_modules/react"
mkdir -p "$FIXTURES/test-suite"
mkdir -p "$FIXTURES/install-fixture"

cat > "$FIXTURES/react-app/package.json" <<'JSON'
{
  "name": "react-build-fixture",
  "private": true,
  "version": "1.0.0",
  "type": "module"
}
JSON

cat > "$FIXTURES/react-app/node_modules/react/package.json" <<'JSON'
{
  "name": "react",
  "version": "19.0.0-fixture",
  "type": "module",
  "exports": {
    "./jsx-runtime": "./jsx-runtime.js"
  }
}
JSON

cat > "$FIXTURES/react-app/node_modules/react/jsx-runtime.js" <<'JS'
export const Fragment = Symbol.for("react.fragment");

export function jsx(type, props, key) {
  return { type, props: props || {}, key: key == null ? null : String(key) };
}

export const jsxs = jsx;
JS

for i in $(seq 0 199); do
  cat > "$FIXTURES/react-app/src/components/Component${i}.tsx" <<TSX
export function Component${i}() {
  const items = ["${i}-alpha", "${i}-beta", "${i}-gamma", "${i}-delta"];
  return (
    <section className="card card-${i}" data-index="${i}">
      <h2>Component ${i}</h2>
      <p>This deterministic component gives Bun's bundler TSX input to parse.</p>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
TSX
done

{
  for i in $(seq 0 199); do
    echo "import { Component${i} } from \"./components/Component${i}\";"
  done
  echo
  echo "export function App() {"
  echo "  return ("
  echo "    <main>"
  for i in $(seq 0 199); do
    echo "      <Component${i} />"
  done
  echo "    </main>"
  echo "  );"
  echo "}"
  echo
  echo "console.log(JSON.stringify(App()).length);"
} > "$FIXTURES/react-app/src/index.tsx"

for i in $(seq 0 119); do
  cat > "$FIXTURES/test-suite/case${i}.test.ts" <<TS
import { expect, test } from "bun:test";

function checksum(seed: number) {
  let value = seed;
  for (let i = 0; i < 500; i++) {
    value = (value * 33 + i) % 1000003;
  }
  return value;
}

test("checksum ${i}", () => {
  expect(checksum(${i})).toBe(checksum(${i}));
  expect(checksum(${i}) >= 0).toBe(true);
});
TS
done

cat > "$FIXTURES/install-fixture/package.json" <<'JSON'
{
  "name": "install-fixture",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "is-even": "1.0.0",
    "is-odd": "3.0.1",
    "nanoid": "5.0.9",
    "picocolors": "1.1.1"
  },
  "devDependencies": {
    "typescript": "5.8.3"
  }
}
JSON

echo "Generated deterministic fixtures under $FIXTURES"
```

- [ ] **Step 2: Run the fixture generator**

Run:

```bash
chmod +x scripts/create-fixtures.sh
./scripts/create-fixtures.sh
```

Expected: `fixtures/react-app`, `fixtures/test-suite`, and `fixtures/install-fixture` exist.

- [ ] **Step 3: Commit generated fixtures and generator**

Run:

```bash
git add scripts/create-fixtures.sh fixtures
git commit -m "test: add deterministic benchmark fixtures"
```

Expected: commit succeeds.

### Task 5: Add Benchmark Scripts

**Files:**
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/benchmarks/run-startup.sh`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/benchmarks/run-build.sh`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/benchmarks/run-test.sh`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/benchmarks/run-install.sh`

- [ ] **Step 1: Create `benchmarks/run-startup.sh`**

Create `benchmarks/run-startup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/scripts/lib.sh"

ensure_dirs
require_binaries
require_hyperfine

hyperfine --warmup 5 --runs 30 \
  --export-json "$RAW_DIR/startup.json" \
  --export-markdown "$TABLE_DIR/startup.md" \
  -n "zig: bun --version" "$ZIG_BUN --version" \
  -n "rust: bun --version" "$RUST_BUN --version" \
  -n "zig: bun eval" "$ZIG_BUN -e 'console.log(1)'" \
  -n "rust: bun eval" "$RUST_BUN -e 'console.log(1)'"
```

- [ ] **Step 2: Create `benchmarks/run-build.sh`**

Create `benchmarks/run-build.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/scripts/lib.sh"

ensure_dirs
require_binaries
require_hyperfine

cd "$ROOT"

hyperfine --warmup 3 --runs 15 \
  --prepare "rm -rf '$TMP_DIR/build-zig' '$TMP_DIR/build-rust'" \
  --export-json "$RAW_DIR/build.json" \
  --export-markdown "$TABLE_DIR/build.md" \
  -n "zig: bun build TSX fixture" "$ZIG_BUN build fixtures/react-app/src/index.tsx --outdir '$TMP_DIR/build-zig' --target browser --minify" \
  -n "rust: bun build TSX fixture" "$RUST_BUN build fixtures/react-app/src/index.tsx --outdir '$TMP_DIR/build-rust' --target browser --minify"
```

- [ ] **Step 3: Create `benchmarks/run-test.sh`**

Create `benchmarks/run-test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/scripts/lib.sh"

ensure_dirs
require_binaries
require_hyperfine

cd "$ROOT"

hyperfine --warmup 3 --runs 20 \
  --export-json "$RAW_DIR/test.json" \
  --export-markdown "$TABLE_DIR/test.md" \
  -n "zig: bun test fixture" "$ZIG_BUN test fixtures/test-suite" \
  -n "rust: bun test fixture" "$RUST_BUN test fixtures/test-suite"
```

- [ ] **Step 4: Create `benchmarks/run-install.sh`**

Create `benchmarks/run-install.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/scripts/lib.sh"

ensure_dirs
require_binaries
require_hyperfine

cd "$ROOT"

fixture="$ROOT/fixtures/install-fixture"
if [[ ! -f "$fixture/bun.lock" ]]; then
  echo "Missing fixtures/install-fixture/bun.lock. Generate it with: (cd fixtures/install-fixture && ../../bin/bun-zig install --lockfile-only)" >&2
  exit 1
fi

rm -rf "$ROOT/.cache/install-zig" "$ROOT/.cache/install-rust" "$fixture/node_modules"
mkdir -p "$ROOT/.cache/install-zig" "$ROOT/.cache/install-rust"

"$ZIG_BUN" install --cwd "$fixture" --frozen-lockfile --cache-dir "$ROOT/.cache/install-zig" --silent
rm -rf "$fixture/node_modules"
"$RUST_BUN" install --cwd "$fixture" --frozen-lockfile --cache-dir "$ROOT/.cache/install-rust" --silent
rm -rf "$fixture/node_modules"

hyperfine --warmup 2 --runs 10 \
  --prepare "rm -rf '$fixture/node_modules'" \
  --export-json "$RAW_DIR/install.json" \
  --export-markdown "$TABLE_DIR/install.md" \
  -n "zig: warm bun install" "$ZIG_BUN install --cwd '$fixture' --frozen-lockfile --cache-dir '$ROOT/.cache/install-zig' --silent" \
  -n "rust: warm bun install" "$RUST_BUN install --cwd '$fixture' --frozen-lockfile --cache-dir '$ROOT/.cache/install-rust' --silent"
```

- [ ] **Step 5: Make benchmark scripts executable and commit**

Run:

```bash
chmod +x benchmarks/run-startup.sh benchmarks/run-build.sh benchmarks/run-test.sh benchmarks/run-install.sh
git add benchmarks
git commit -m "bench: add Bun comparison benchmark scripts"
```

Expected: commit succeeds.

### Task 6: Add Summary and Run-All Scripts

**Files:**
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/scripts/summarize-results.ts`
- Create: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/scripts/run-all.sh`

- [ ] **Step 1: Create `scripts/summarize-results.ts`**

Create `scripts/summarize-results.ts`:

```ts
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type HyperfineResult = {
  command: string;
  mean: number;
  stddev: number;
  median: number;
  min: number;
  max: number;
};

type HyperfineFile = {
  results: HyperfineResult[];
};

const root = new URL("..", import.meta.url).pathname.replace(/\/scripts\/?$/, "");
const resultsDir = join(root, "results");
const rawDir = join(resultsDir, "raw");

const files = [
  ["Startup", "startup.json"],
  ["Build", "build.json"],
  ["Test", "test.json"],
  ["Install", "install.json"],
] as const;

function ms(seconds: number) {
  return `${(seconds * 1000).toFixed(2)} ms`;
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

let markdown = "# Benchmark Summary\n\n";

const machinePath = join(resultsDir, "machine.json");
if (existsSync(machinePath)) {
  const machine = readJson<Record<string, unknown>>(machinePath);
  markdown += "## Machine\n\n";
  markdown += `- Machine: ${machine.machine}\n`;
  markdown += `- Model: ${machine.model}\n`;
  markdown += `- Chip: ${machine.chip}\n`;
  markdown += `- Cores: ${machine.core_description}\n`;
  markdown += `- Memory: ${machine.memory_gb} GB\n`;
  markdown += `- OS: ${machine.os}\n\n`;
}

const binariesPath = join(rawDir, "binaries.json");
if (existsSync(binariesPath)) {
  const binaries = readJson<Record<string, { version: string; revision: string; sha256: string }>>(binariesPath);
  markdown += "## Binaries\n\n";
  markdown += "| Label | Version | Revision | SHA-256 |\n";
  markdown += "| --- | --- | --- | --- |\n";
  markdown += `| bun-zig | ${binaries.bun_zig.version} | ${binaries.bun_zig.revision} | ${binaries.bun_zig.sha256} |\n`;
  markdown += `| bun-rust | ${binaries.bun_rust.version} | ${binaries.bun_rust.revision} | ${binaries.bun_rust.sha256} |\n\n`;
}

for (const [title, file] of files) {
  const path = join(rawDir, file);
  if (!existsSync(path)) continue;

  const data = readJson<HyperfineFile>(path);
  const fastest = Math.min(...data.results.map((result) => result.mean));

  markdown += `## ${title}\n\n`;
  markdown += "| Command | Mean | Stddev | Min | Max | Relative |\n";
  markdown += "| --- | ---: | ---: | ---: | ---: | ---: |\n";

  for (const result of data.results) {
    const relative = result.mean / fastest;
    markdown += `| \`${result.command}\` | ${ms(result.mean)} | ${ms(result.stddev)} | ${ms(result.min)} | ${ms(result.max)} | ${relative.toFixed(2)}x |\n`;
  }

  markdown += "\n";
}

markdown += "## Caveat\n\n";
markdown += "These results describe one Apple M1 MacBook Air run. They should not be read as a universal Bun performance verdict.\n";

writeFileSync(join(resultsDir, "SUMMARY.md"), markdown);
console.log(markdown);
```

- [ ] **Step 2: Create `scripts/run-all.sh`**

Create `scripts/run-all.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT"

./scripts/create-fixtures.sh
./scripts/install-buns.sh
./scripts/collect-machine-info.sh

if [[ ! -f fixtures/install-fixture/bun.lock ]]; then
  (cd fixtures/install-fixture && ../../bin/bun-zig install --lockfile-only)
fi

./benchmarks/run-startup.sh
./benchmarks/run-build.sh
./benchmarks/run-test.sh
./benchmarks/run-install.sh

./bin/bun-zig scripts/summarize-results.ts
```

- [ ] **Step 3: Make scripts executable and commit**

Run:

```bash
chmod +x scripts/run-all.sh
git add scripts/summarize-results.ts scripts/run-all.sh
git commit -m "chore: add benchmark summary runner"
```

Expected: commit succeeds.

### Task 7: Run Setup and Verify Scripts

**Files:**
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/machine.json`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/raw/binaries.json`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/fixtures/install-fixture/bun.lock`

- [ ] **Step 1: Install `hyperfine` if missing**

Run:

```bash
if ! command -v hyperfine >/dev/null 2>&1; then
  brew install hyperfine
fi
hyperfine --version
```

Expected: prints a `hyperfine` version.

- [ ] **Step 2: Install pinned Bun binaries**

Run:

```bash
./scripts/install-buns.sh
```

Expected:

- `bin/bun-zig` exists and `bin/bun-zig --revision` includes `0d9b296af`.
- `bin/bun-rust` exists and `bin/bun-rust --revision` includes `ed1a70f81708` or `23427dbc12fd`.
- `results/raw/binaries.json` exists.

- [ ] **Step 3: Collect sanitized machine metadata**

Run:

```bash
./scripts/collect-machine-info.sh
```

Expected: `results/machine.json` exists and contains no serial number, UUID, provisioning UDID, or activation-lock value.

- [ ] **Step 4: Generate install lockfile**

Run:

```bash
(cd fixtures/install-fixture && ../../bin/bun-zig install --lockfile-only)
```

Expected: `fixtures/install-fixture/bun.lock` exists.

- [ ] **Step 5: Commit lockfile and machine/binary metadata**

Run:

```bash
git add fixtures/install-fixture/bun.lock results/machine.json results/raw/binaries.json
git commit -m "chore: record benchmark environment"
```

Expected: commit succeeds.

### Task 8: Run Benchmarks and Commit Results

**Files:**
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/raw/startup.json`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/raw/build.json`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/raw/test.json`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/raw/install.json`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/tables/startup.md`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/tables/build.md`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/tables/test.md`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/tables/install.md`
- Generate: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/SUMMARY.md`

- [ ] **Step 1: Run startup benchmark**

Run:

```bash
./benchmarks/run-startup.sh
```

Expected: `results/raw/startup.json` and `results/tables/startup.md` exist.

- [ ] **Step 2: Run build benchmark**

Run:

```bash
./benchmarks/run-build.sh
```

Expected: `results/raw/build.json` and `results/tables/build.md` exist.

- [ ] **Step 3: Run test benchmark**

Run:

```bash
./benchmarks/run-test.sh
```

Expected: `results/raw/test.json` and `results/tables/test.md` exist.

- [ ] **Step 4: Run install benchmark**

Run:

```bash
./benchmarks/run-install.sh
```

Expected: `results/raw/install.json` and `results/tables/install.md` exist.

- [ ] **Step 5: Generate summary**

Run:

```bash
./bin/bun-zig scripts/summarize-results.ts
```

Expected: `results/SUMMARY.md` exists and includes machine, binary, and benchmark sections.

- [ ] **Step 6: Commit benchmark results**

Run:

```bash
git add results fixtures/install-fixture/bun.lock
git commit -m "bench: record Bun Rust vs Zig results"
```

Expected: commit succeeds.

### Task 9: Publish GitHub Repository

**Files:**
- Modify: local git remote configuration only.

- [ ] **Step 1: Create GitHub repository**

Run:

```bash
gh repo create Iamshankhadeep/bun-rust-vs-zig-benchmark --public --source /Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark --remote origin --push
```

Expected: GitHub creates the public repository and pushes local commits.

- [ ] **Step 2: Verify remote**

Run:

```bash
git remote -v
gh repo view Iamshankhadeep/bun-rust-vs-zig-benchmark
```

Expected: `origin` points to `git@github.com:Iamshankhadeep/bun-rust-vs-zig-benchmark.git`, and `gh repo view` prints repo metadata.

- [ ] **Step 3: Capture final repository status**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: worktree is clean and the latest commits include benchmark setup and result commits.

### Task 10: Implementation Completion Check

**Files:**
- Read: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/SUMMARY.md`
- Read: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/raw/binaries.json`
- Read: `/Users/blank/Github/sidehustle/bun-rust-vs-zig-benchmark/results/machine.json`

- [ ] **Step 1: Verify binary revisions**

Run:

```bash
./bin/bun-zig --revision
./bin/bun-rust --revision
```

Expected:

- `bun-zig` includes `0d9b296af`.
- `bun-rust` includes `ed1a70f81708` or `23427dbc12fd`.

- [ ] **Step 2: Verify private identifiers are absent**

Run:

```bash
rg -n "Serial|Hardware UUID|Provisioning|UDID|Activation Lock|C02|B445" results README.md METHODOLOGY.md
```

Expected: no matches. `rg` exits with code 1 when it finds no matches.

- [ ] **Step 3: Verify result files exist**

Run:

```bash
ls results/raw results/tables
test -f results/SUMMARY.md
```

Expected: raw JSON files, Markdown tables, and `results/SUMMARY.md` are present.

- [ ] **Step 4: Report final repo URL**

Report:

```text
https://github.com/Iamshankhadeep/bun-rust-vs-zig-benchmark
```

Include whether any benchmark failed, was noisy, or was skipped.
