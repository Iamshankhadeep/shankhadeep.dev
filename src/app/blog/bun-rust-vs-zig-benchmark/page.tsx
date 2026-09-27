import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const repoUrl =
	"https://github.com/Iamshankhadeep/bun-rust-vs-zig-benchmark";

const resultRows = [
	{
		area: "Startup",
		workload: "bun --version",
		zig: "4.39 ms",
		rust: "4.25 ms",
		relative: "Rust 1.03x faster",
	},
	{
		area: "Startup",
		workload: "bun eval",
		zig: "10.93 ms",
		rust: "10.19 ms",
		relative: "Rust 1.07x faster",
	},
	{
		area: "Build",
		workload: "bun build TSX fixture",
		zig: "11.57 ms",
		rust: "11.91 ms",
		relative: "Zig 1.03x faster",
	},
	{
		area: "Test",
		workload: "bun test fixture",
		zig: "53.62 ms",
		rust: "43.66 ms",
		relative: "Rust 1.23x faster",
	},
	{
		area: "Install",
		workload: "warm bun install",
		zig: "11.17 ms",
		rust: "10.47 ms",
		relative: "Rust 1.07x faster",
	},
	{
		area: "Runtime",
		workload: "loops",
		zig: "17.79 ms",
		rust: "17.40 ms",
		relative: "Rust 1.02x faster",
	},
	{
		area: "Runtime",
		workload: "JSON",
		zig: "16.78 ms",
		rust: "16.61 ms",
		relative: "Rust 1.01x faster",
	},
	{
		area: "Runtime",
		workload: "strings and regex",
		zig: "21.72 ms",
		rust: "21.51 ms",
		relative: "Rust 1.01x faster",
	},
	{
		area: "Runtime",
		workload: "filesystem",
		zig: "58.53 ms",
		rust: "57.70 ms",
		relative: "Rust 1.01x faster",
	},
	{
		area: "Runtime",
		workload: "self-contained HTTP",
		zig: "30.53 ms",
		rust: "22.93 ms",
		relative: "Rust 1.33x faster",
	},
];

const machineFacts = [
	"MacBook Air, MacBookAir10,1",
	"Apple M1",
	"8 cores: 4 performance and 4 efficiency",
	"16 GB memory",
	"macOS 26.4.1, Darwin 25.4.0 arm64",
];

export const metadata: Metadata = {
	title:
		"Benchmarking Bun's Rust Rewrite Against Bun v1.3.14 on an M1 MacBook Air",
	description:
		"I benchmarked Bun v1.3.14 stable against the exact Rust rewrite PR artifact across startup, build, test, install, and runtime workloads.",
	openGraph: {
		title:
			"Benchmarking Bun's Rust Rewrite Against Bun v1.3.14 on an M1 MacBook Air",
		description:
			"Local benchmark results for Bun's Rust rewrite PR build versus Bun v1.3.14 stable on Apple M1.",
		url: "https://shankhadeep.dev/blog/bun-rust-vs-zig-benchmark",
		type: "article",
		publishedTime: "2026-05-15",
	},
};

export default function BunRustVsZigBenchmarkPost() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<Header />
			<main className="py-12">
				<article className="space-y-10">
					<header className="space-y-5">
						<Link
							href="/blog"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Back to blog
						</Link>
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground">May 15, 2026</p>
							<h1 className="text-3xl sm:text-4xl font-bold leading-tight">
								Benchmarking Bun&apos;s Rust Rewrite Against Bun v1.3.14 on
								an M1 MacBook Air
							</h1>
							<p className="text-muted-foreground leading-7">
								I wanted a narrow, auditable answer to one question: on my
								Apple M1 MacBook Air, how does Bun&apos;s exact Rust rewrite PR
								build compare with Bun v1.3.14 stable?
							</p>
						</div>
					</header>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Context</h2>
						<p className="leading-7 text-muted-foreground">
							Bun v1.3.14 was published on May 13, 2026. The next day,
							PR{" "}
							<a
								href="https://github.com/oven-sh/bun/pull/30412"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								oven-sh/bun#30412
							</a>{" "}
							merged the Rust rewrite into Bun&apos;s main branch. GitHub
							reports that PR as 6,755 commits, 2,188 changed files,
							1,009,257 additions, and 4,024 deletions.
						</p>
						<p className="leading-7 text-muted-foreground">
							The PR thread says the rewrite passes Bun&apos;s pre-existing
							test suite, shrinks binary size, and has benchmarks ranging from
							neutral to faster. That is a broad claim across Bun&apos;s own
							matrix. This post is smaller: one machine, one stable baseline,
							one exact PR artifact, and the raw data checked into GitHub.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">What I Compared</h2>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 pr-4">Label</th>
										<th className="text-left py-2 pr-4">Source</th>
										<th className="text-left py-2">Revision</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-b border-border">
										<td className="py-3 pr-4">bun-zig</td>
										<td className="py-3 pr-4">
											<a
												href="https://bun.sh/blog/bun-v1.3.14"
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary hover:underline"
											>
												Bun v1.3.14 stable
											</a>
										</td>
										<td className="py-3">
											<code>1.3.14+0d9b296af</code>
										</td>
									</tr>
									<tr className="border-b border-border">
										<td className="py-3 pr-4">bun-rust</td>
										<td className="py-3 pr-4">
											Exact PR artifact from <code>ed1a70f81</code>
										</td>
										<td className="py-3">
											<code>1.3.14-canary.1+ed1a70f81</code>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<p className="leading-7 text-muted-foreground">
							The full benchmark repository is public at{" "}
							<a
								href={repoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								{repoUrl}
							</a>
							. It records the exact binary revisions, SHA-256 hashes, machine
							metadata, scripts, fixtures, raw JSON, and rendered tables.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Machine</h2>
						<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
							{machineFacts.map((fact) => (
								<li key={fact}>{fact}</li>
							))}
						</ul>
						<p className="leading-7 text-muted-foreground">
							I intentionally excluded serial numbers, hardware UUIDs, and
							other unique device identifiers from the repo and this post.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Methodology</h2>
						<p className="leading-7 text-muted-foreground">
							I used{" "}
							<a
								href="https://bun.com/docs/project/benchmarking"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Bun&apos;s documented benchmarking guidance
							</a>{" "}
							and measured with <code>hyperfine</code>. The scripts never call
							an ambient <code>bun</code> from <code>PATH</code>; every command
							uses either <code>./bin/bun-zig</code> or{" "}
							<code>./bin/bun-rust</code>.
						</p>
						<p className="leading-7 text-muted-foreground">
							The suite covers startup, TSX build, <code>bun:test</code>, warm
							install, and five original runtime workloads: loops, JSON,
							strings/regex, filesystem, and a self-contained{" "}
							<code>Bun.serve()</code> HTTP test. The relative column below is
							pairwise, so each Zig command is compared only with the matching
							Rust command for the same workload.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Results</h2>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 pr-4">Area</th>
										<th className="text-left py-2 pr-4">Workload</th>
										<th className="text-left py-2 pr-4">Zig stable</th>
										<th className="text-left py-2 pr-4">Rust PR</th>
										<th className="text-left py-2">Pair result</th>
									</tr>
								</thead>
								<tbody>
									{resultRows.map((row) => (
										<tr
											key={`${row.area}-${row.workload}`}
											className="border-b border-border"
										>
											<td className="py-3 pr-4">{row.area}</td>
											<td className="py-3 pr-4">{row.workload}</td>
											<td className="py-3 pr-4">{row.zig}</td>
											<td className="py-3 pr-4">{row.rust}</td>
											<td className="py-3">{row.relative}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">What Stood Out</h2>
						<ul className="list-disc pl-6 space-y-3 text-muted-foreground">
							<li>
								The clearest tooling win was <code>bun test</code>: the Rust PR
								build ran the generated test fixture in 43.66 ms versus 53.62
								ms for Bun v1.3.14 stable, about 1.23x faster.
							</li>
							<li>
								The largest runtime gap was the self-contained HTTP workload:
								22.93 ms for the Rust PR build versus 30.53 ms for the stable
								Zig build, about 1.33x faster.
							</li>
							<li>
								Startup eval and warm install were modest Rust wins, both
								around 1.07x.
							</li>
							<li>
								The TSX build fixture slightly favored the stable Zig build:
								11.57 ms versus 11.91 ms.
							</li>
							<li>
								Loops, JSON, strings/regex, and filesystem were effectively
								close on this machine.
							</li>
						</ul>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Caveats</h2>
						<p className="leading-7 text-muted-foreground">
							This is not a universal Bun verdict. It is one Apple M1 MacBook
							Air, one macOS version, and one exact Rust PR build. Some
							workloads are tiny enough that startup and process setup still
							matter. The runtime scripts are full-process elapsed-time tests,
							not inner-loop nanosecond microbenchmarks.
						</p>
						<p className="leading-7 text-muted-foreground">
							I also did not benchmark Node.js, Deno, Linux, Windows, x64, or a
							real production service. The useful conclusion is narrower: for
							this local fixture set, the Rust PR build was already neutral to
							faster on most measured paths, with visible wins in{" "}
							<code>bun test</code> and the HTTP workload.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Takeaway</h2>
						<p className="leading-7 text-muted-foreground">
							I expected a rewrite this large to show at least one obvious
							regression in a small local suite. That did not happen here. The
							results are mostly close, with a few Rust-side wins and one small
							build result favoring the stable Zig baseline.
						</p>
						<p className="leading-7 text-muted-foreground">
							The next useful step would be broader validation: Linux, x64,
							Windows, larger install fixtures, long-running server tests, and
							real app workloads. For now, the interesting part is that the
							exact PR artifact was already competitive on this M1 machine.
						</p>
					</section>
				</article>
			</main>
			<Footer />
		</div>
	);
}
