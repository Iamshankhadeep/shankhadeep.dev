export const blogPosts = [
	{
		slug: "training-a-9b-model-to-make-videos-with-code",
		title: "Training a 9B Model to Make Videos with Code",
		description:
			"Eight rounds of SFT and GRPO on Qwen3.5-9B to write short looping videos as code, in a sumi-e ink style: the rewards that failed, the data that worked, and what it cost.",
		date: "2026-11-05",
		href: "/blog/training-a-9b-model-to-make-videos-with-code",
	},
	{
		slug: "bun-rust-vs-zig-benchmark",
		title:
			"Benchmarking Bun's Rust Rewrite Against Bun v1.3.14 on an M1 MacBook Air",
		description:
			"I compared Bun v1.3.14 stable with the exact Rust rewrite PR artifact across startup, build, test, install, and runtime workloads.",
		date: "2026-05-15",
		href: "/blog/bun-rust-vs-zig-benchmark",
	},
] as const;
