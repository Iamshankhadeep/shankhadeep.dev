import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const media = "/blog/training-a-9b-model-to-make-videos-with-code";
const suryaUrl = "https://surya.website/rling-qwen-to-paint-with-code";

const builtWith = [
	"Model: Qwen3.5-9B, LoRA fine-tuned with SFT, then GRPO",
	"Data: 2,000 sumi-e reels written by Claude Code agents (Opus 5.5)",
	"Judge: Claude Haiku 5.5, grading rendered stills against a reference",
	"Compute: one rented A100 80GB per training round",
];

const loop = [
	["Brief", "one paragraph: subject, palette, motion"],
	["scene.js", "the model writes 2–4k tokens of canvas code"],
	["Render", "headless Chrome steps through every frame"],
	["Gate", "errors, loop seam, determinism, motion"],
	["Judge", "stills vs. the reference reel"],
	["GRPO", "8 samples per brief, ranked by reward"],
];

const results = [
	{ model: "Round 6 RL (260 reels)", passes: "205 / 320", content: "0.31", motion: "0.24", good: "4" },
	{ model: "Round 8 SFT (1,944 reels)", passes: "156 / 320", content: "0.38", motion: "0.50", good: "15" },
	{ model: "Round 8 SFT + RL", passes: "247 / 320", content: "0.42", motion: "0.49", good: "24" },
];

const costRows = [
	{ item: "Convert 600 hand-built reels into harness scenes", cost: "$881" },
	{ item: "Compress the training scenes to 4k tokens or less", cost: "$847" },
	{ item: "Write 2,000 no-text sumi-e scenes, including 200 redos", cost: "$1,605" },
	{ item: "Briefs and the subject catalog", cost: "~$25" },
	{ item: "RunPod A100, 7 training rounds plus idle storage", cost: "~$85" },
	{ item: "The original 600 reels, and the judge calls", cost: "not tracked" },
];

const perVideoRows = [
	{ model: "Claude Opus 5.5", working: "3 / 4", call: "$0.224", video: "~$0.30" },
	{ model: "Claude Sonnet 5.5", working: "3 / 4", call: "$0.152", video: "~$0.20" },
	{ model: "Claude Haiku 5.5", working: "0 / 4", call: "$0.007", video: "none worked" },
	{ model: "This 9B model (A100 at $1.79/h)", working: "247 / 320", call: "~$0.004", video: "~$0.006" },
];

const pairs = [
	{ id: "189", title: "River shrimp", note: "Passes the full video gate." },
	{ id: "255", title: "Bamboo copter", note: "Passes the full video gate." },
	{ id: "175", title: "Falling feather", note: "Passes the full video gate." },
	{ id: "158", title: "Bowing sunflower", note: "Fails it: still for the first 0.3 s." },
	{ id: "146", title: "Matcha bowl", note: "Fails it: freezes for 2.2 s." },
	{ id: "059", title: "Pavement weed", note: "Fails it: freezes for 1.2 s." },
];

export const metadata: Metadata = {
	title: "Training a 9B Model to Make Videos with Code",
	description:
		"Eight rounds of SFT and GRPO on Qwen3.5-9B to write short looping videos as code, in a sumi-e ink style: the rewards that failed, the data that worked, and what it cost.",
	openGraph: {
		title: "Training a 9B Model to Make Videos with Code",
		description:
			"From 0/100 to 247/320 working videos: SFT, GRPO, a content judge, a motion reward, and 2,000 training reels.",
		url: "https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code",
		type: "article",
		publishedTime: "2026-11-05",
	},
};

function Reel({ id, title }: { id: string; title: string }) {
	return (
		<video
			src={`${media}/pair-${id}.mp4`}
			poster={`${media}/pair-${id}.jpg`}
			autoPlay
			muted
			loop
			playsInline
			aria-label={`${title}: reference on the left, model on the right`}
			className="w-full rounded-md border border-border bg-muted"
		/>
	);
}

function LoopDiagram() {
	return (
		<ol className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm" aria-label="Training loop">
			{loop.map(([name, what], i) => (
				<li key={name} className="rounded-md border border-border p-3 space-y-1">
					<p className="font-medium">
						<span className="text-muted-foreground mr-2">{i + 1}</span>
						{name}
					</p>
					<p className="text-muted-foreground leading-6">{what}</p>
				</li>
			))}
		</ol>
	);
}

export default function MakeVideosWithCodePost() {
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
							<p className="text-sm text-muted-foreground">
								November 5, 2026 · Data, Training, Reward design
							</p>
							<h1 className="text-3xl sm:text-4xl font-bold leading-tight">
								Training a 9B Model to Make Videos with Code
							</h1>
						</div>
						<p className="leading-7 text-muted-foreground">
							Ask a video model for a clip and you get pixels. You
							cannot open them up. You cannot move one stroke. All you can do
							is change the prompt and roll again.
						</p>
						<p className="leading-7 text-muted-foreground">
							A video written as code is different. The code is the video. You can
							read it, change one brush stroke, and render the same frames
							again. And code can be checked: it renders or it crashes, it loops
							or it doesn&apos;t. RL works when the reward can be checked. Taste
							can&apos;t, at least not directly. This post is about how far a
							9B model gets anyway.
						</p>
						<figure className="space-y-2">
							<video
								src={`${media}/montage.mp4`}
								poster={`${media}/montage.jpg`}
								controls
								autoPlay
								muted
								loop
								playsInline
								aria-label="Montage of reels written by the final model"
								className="w-full rounded-md border border-border bg-muted"
							/>
							<figcaption className="text-sm text-muted-foreground">
								Every clip is a video the final model wrote, as code, for a brief
								it never saw in training. Unmute for sound.
							</figcaption>
						</figure>
					</header>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">What I built</h2>
						<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
							{builtWith.map((x) => (
								<li key={x}>{x}</li>
							))}
						</ul>
						<p className="leading-7 text-muted-foreground">
							It started from Surya&apos;s{" "}
							<a
								href={suryaUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								RL-ing Qwen to paint with code
							</a>
							. I wanted to know if the same idea holds for animation. And
							whether most of the work could be data instead of hand-tuning.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">How it works</h2>
						<p className="leading-7 text-muted-foreground">
							The model does not write a web page. A fixed harness owns
							rendering, timing, seeded randomness and export. A style kit owns
							the medium: wet washes that bleed, dry-brush strokes, rice paper,
							the red hanko seal. The model writes only <code>scene.js</code>:
							what is on screen, where, and how it moves.
						</p>
						<LoopDiagram />
						<p className="leading-7 text-muted-foreground">
							Every pixel is a pure function of time. So every sample can be
							rendered frame by frame and graded by a program. No human in the
							loop.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Reward functions</h2>
						<p className="leading-7 text-muted-foreground">
							Every reward I wrote got gamed. Each fix closed one shortcut and
							showed me the next.
						</p>
						<p className="leading-7 text-muted-foreground">
							<span className="text-foreground">Does it render?</span> The base
							model got 0 of 100 briefs to render. So did every small model I tried:
							Qwen3.5 at 2B, 4B and 9B, and Gemma 4. Fine-tuning alone was still
							0. GRPO with a pass/fail gate got 2. A gate is a cliff, and most
							samples fell off it.
						</p>
						<p className="leading-7 text-muted-foreground">
							<span className="text-foreground">Partial credit.</span> 71% of
							failures were scenes that crashed partway through. So I paid for
							how far a scene ran before it broke. Syntax errors halved. Passing
							reels in 8 tries per brief went from 44 to 74, out of 800.
						</p>
						<p className="leading-7 text-muted-foreground">
							<span className="text-foreground">A judge for content.</span> A
							Claude Haiku judge compared the rendered stills with the reference
							reel: subject, richness, medium. Briefs with a working reel climbed
							to 90 of 100. Content did not. It stayed flat at about 0.2. RL
							amplifies what the model already samples. Working-but-empty reels
							were common. Rich ones were rare.
						</p>
						<p className="leading-7 text-muted-foreground">
							<span className="text-foreground">Fewer things to learn.</span> Six
							styles and on-screen text were too much for a small model. I
							narrowed it to one style, sumi-e, with no text. RL gave every test
							brief a working reel. Then I rendered full videos of the 13 best.
							11 of them froze for 1.4 to 8.3 seconds. The gate only compared
							seven stills, so RL had learned to pass by barely moving.
						</p>
						<p className="leading-7 text-muted-foreground">
							<span className="text-foreground">Watch the motion.</span> Reward v6
							adds a frame-to-frame motion probe and a stricter judge, averaged
							over two calls. This one held. Under v6, RL raised passes and
							content and kept motion where it was.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">The reference set</h2>
						<p className="leading-7 text-muted-foreground">
							Better rewards were not enough. The model needed better examples.
						</p>
						<p className="leading-7 text-muted-foreground">
							Claude built a catalog of about 2,500 simple subjects across 22
							categories: songbirds, sea life, teaware, tools, weather. Then it
							dropped any repeat of a main subject. Each one became a brief: one
							subject, at most two supporting elements, one looping motion.
							Headless Claude Code agents wrote the scenes straight against the
							harness. Each scene had to pass the gate in under 4,000 tokens.
						</p>
						<p className="leading-7 text-muted-foreground">
							All 2,000 passed. Passing is not the same as good, so I went
							through contact sheets of every reel. About 10% were too small, not
							recognisable, nearly blank, or a dark smear. Those 200 were rewritten
							with a note naming the problem. 16 still failed and were left out.
						</p>
						<figure className="space-y-2">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={`${media}/reference-grid.jpg`}
								alt="A grid of 32 sumi-e reference reels from the training set: birds, plants, bowls, tools, animals"
								className="w-full rounded-md border border-border"
							/>
							<figcaption className="text-sm text-muted-foreground">
								32 of the 1,944 training reels, one still each.
							</figcaption>
						</figure>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Progression</h2>
						<p className="leading-7 text-muted-foreground">
							Same 40 held-out briefs, 8 tries each, all scored with reward v6:
						</p>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 pr-4">Model</th>
										<th className="text-left py-2 pr-4">Working reels</th>
										<th className="text-left py-2 pr-4">Content</th>
										<th className="text-left py-2 pr-4">Motion</th>
										<th className="text-left py-2">Briefs with a good reel</th>
									</tr>
								</thead>
								<tbody>
									{results.map((r) => (
										<tr key={r.model} className="border-b border-border">
											<td className="py-3 pr-4">{r.model}</td>
											<td className="py-3 pr-4">{r.passes}</td>
											<td className="py-3 pr-4">{r.content}</td>
											<td className="py-3 pr-4">{r.motion}</td>
											<td className="py-3">{r.good}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className="leading-7 text-muted-foreground">
							More data was the biggest single gain. The new SFT model, before
							any RL, beats the old RL model. RL on top added 91 working reels and
							9 more briefs with a good reel. It did that without trading the
							motion away this time.
						</p>
						<figure className="space-y-2">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={`${media}/progression.jpg`}
								alt="Four briefs (orchid, matcha bowl, sunflower, river shrimp), each shown as the reference, round 6 RL, round 8 SFT and round 8 RL"
								className="w-full rounded-md border border-border"
							/>
							<figcaption className="text-sm text-muted-foreground">
								Rows: orchid, matcha bowl, sunflower, river shrimp. Columns: the
								reference, round 6 RL, round 8 SFT, round 8 RL. Best of 8 tries.
							</figcaption>
						</figure>
						<p className="leading-7 text-muted-foreground">
							Six of the final model&apos;s best reels, each next to its reference.
							Three still fail the strict full-video gate on motion.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{pairs.map((p) => (
								<figure key={p.id} className="space-y-2">
									<Reel id={p.id} title={p.title} />
									<figcaption className="text-sm text-muted-foreground">
										<span className="text-foreground">{p.title}.</span> {p.note}
									</figcaption>
								</figure>
							))}
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">What it cost</h2>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 pr-4">Item</th>
										<th className="text-left py-2">Cost</th>
									</tr>
								</thead>
								<tbody>
									{costRows.map((row) => (
										<tr key={row.item} className="border-b border-border">
											<td className="py-3 pr-4">{row.item}</td>
											<td className="py-3 whitespace-nowrap">{row.cost}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className="leading-7 text-muted-foreground">
							Making the data cost about forty times as much as training on it.
							The RunPod figure for rounds 3 to 5 is estimated from their run
							times.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">What one video costs</h2>
						<p className="leading-7 text-muted-foreground">
							Once it&apos;s trained, how does the small model compare with just
							asking Claude? I gave each model the same system prompt and brief
							the 9B model gets, one call per brief, and ran every result through
							the same gate:
						</p>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 pr-4">Model</th>
										<th className="text-left py-2 pr-4">Working videos</th>
										<th className="text-left py-2 pr-4">Cost per call</th>
										<th className="text-left py-2">Cost per working video</th>
									</tr>
								</thead>
								<tbody>
									{perVideoRows.map((r) => (
										<tr key={r.model} className="border-b border-border">
											<td className="py-3 pr-4">{r.model}</td>
											<td className="py-3 pr-4">{r.working}</td>
											<td className="py-3 pr-4">{r.call}</td>
											<td className="py-3 whitespace-nowrap">{r.video}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className="leading-7 text-muted-foreground">
							The 9B model is 35 to 50 times cheaper per working video than Sonnet
							or Opus. Most of Claude&apos;s cost is thinking: the scene itself is
							2,000 to 4,000 tokens of code, but each call wrote 10,000 to 14,000
							output tokens. Haiku is cheap but got none of its four to work.
						</p>
						<p className="leading-7 text-muted-foreground">
							The comparison is not like for like. Claude&apos;s working videos are
							much richer than the 9B model&apos;s. The Claude rows are 4 held-out
							briefs each, so treat them as rough. The 9B figure is an upper bound:
							320 videos took 46 minutes on the A100, and that includes rendering
							and judging every one.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold">Closing</h2>
						<p className="leading-7 text-muted-foreground">
							Taste lives in the reward and in the data. Whenever the reward
							could be satisfied cheaply, by reels that worked but were empty or
							passed but were frozen, RL found the shortcut. The fixes that
							worked were the ones that measured what I actually wanted.
						</p>
						<p className="leading-7 text-muted-foreground">
							The videos are still sparse next to the references. A strict
							judge score of 0.42 means the subject is usually there and the
							brushwork usually isn&apos;t. One brief never worked at all. And
							this is slower than asking a frontier model, which writes these
							scenes on the first try.
						</p>
						<p className="leading-7 text-muted-foreground">
							Next: the full-video motion checks inside the training reward, a
							held-out set of simple briefs, and more RL steps now that RL keeps
							the motion.
						</p>
					</section>
				</article>
			</main>
			<Footer />
		</div>
	);
}
