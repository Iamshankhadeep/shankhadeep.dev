import { ImageResponse } from "next/og";

export const alt = "Shankhadeep Dey - Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Shankhadeep Dey";
const ROLE = "Full Stack Developer";
const TAGLINE = "I design, build, and ship software that makes a difference.";
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
	const text = NAME + ROLE + TAGLINE + DOMAIN;
	const [regular, bold] = await Promise.all([loadFont(400, text), loadFont(700, text)]);
	const fonts = [
		regular && { name: "IBM Plex Mono", data: regular, weight: 400 as const },
		bold && { name: "IBM Plex Mono", data: bold, weight: 700 as const },
	].filter((f) => f !== null);

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "80px",
					background: "#ffffff",
					fontFamily: "IBM Plex Mono",
					borderTop: "16px solid #2563eb",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ fontSize: 84, fontWeight: 700, color: "#111827" }}>{NAME}</div>
					<div style={{ fontSize: 40, color: "#4b5563", marginTop: 16 }}>{ROLE}</div>
					<div style={{ fontSize: 30, color: "#4b5563", marginTop: 40, maxWidth: 900 }}>
						{TAGLINE}
					</div>
				</div>
				<div style={{ fontSize: 30, fontWeight: 700, color: "#2563eb" }}>{DOMAIN}</div>
			</div>
		),
		{ ...size, fonts },
	);
}
