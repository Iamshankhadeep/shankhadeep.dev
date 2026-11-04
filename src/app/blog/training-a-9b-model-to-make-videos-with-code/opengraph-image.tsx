import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
	"Training a 9B Model to Make Videos with Code: an ink-wash shrimp video written by the model";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "Training a 9B Model to Make Videos with Code";
const RESULT = "0 of 100 briefs before training. 39 of 40 after.";
const DOMAIN = "shankhadeep.dev";

// Satori can't use woff2, so request the font without a browser UA to get a TTF.
async function loadFont(weight: number, text: string) {
	try {
		const css = await (
			await fetch(
				`https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@${weight}&text=${encodeURIComponent(text)}`,
			)
		).text();
		const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
		if (!url) return null;
		return await (await fetch(url)).arrayBuffer();
	} catch {
		return null;
	}
}

export default async function Image() {
	const text = TITLE + RESULT + DOMAIN;
	const [regular, bold, frame] = await Promise.all([
		loadFont(400, text),
		loadFont(700, text),
		readFile(join(process.cwd(), "public/blog/training-a-9b-model-to-make-videos-with-code/og-frame.jpg")),
	]);
	const fonts = [
		regular && { name: "IBM Plex Mono", data: regular, weight: 400 as const },
		bold && { name: "IBM Plex Mono", data: bold, weight: 700 as const },
	].filter((f) => f !== null);
	const src = `data:image/jpeg;base64,${frame.toString("base64")}`;

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					gap: 56,
					padding: "64px 72px",
					background: "#ffffff",
					fontFamily: "IBM Plex Mono",
					borderTop: "16px solid #2563eb",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						height: "100%",
						flex: 1,
					}}
				>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div style={{ fontSize: 54, fontWeight: 700, color: "#111827", lineHeight: 1.15 }}>
							{TITLE}
						</div>
						<div style={{ fontSize: 28, color: "#4b5563", marginTop: 32, lineHeight: 1.4 }}>
							{RESULT}
						</div>
					</div>
					<div style={{ fontSize: 30, fontWeight: 700, color: "#2563eb" }}>{DOMAIN}</div>
				</div>
				<img src={src} width={470} height={470} style={{ border: "1px solid #e5e7eb" }} alt="" />
			</div>
		),
		{ ...size, fonts },
	);
}
