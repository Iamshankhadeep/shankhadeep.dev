import type React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";
import type { Metadata } from "next";
// import type { NextWebVitalsMetric } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "../components/Analytics";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://shankhadeep.dev"),
	title: "Shankhadeep Dey - Full Stack Developer Portfolio",
	description:
		"Portfolio of Shankhadeep Dey, showcasing projects, skills, and experience in full-stack web and mobile development.",
	openGraph: {
		title: "Shankhadeep Dey - Full Stack Developer Portfolio",
		description:
			"Explore the projects and skills of Shankhadeep Dey, a full-stack developer.",
		url: "https://shankhadeep.dev",
		siteName: "Shankhadeep Dey Portfolio",
		locale: "en_US",
		type: "website",
	},
};

// Function to report Core Web Vitals to Analytics
// export function reportWebVitals(metric: NextWebVitalsMetric) {
// 	// Check if gtag is available (Analytics component should have loaded it)
// 	if (typeof window !== "undefined" && window.gtag) {
// 		window.gtag("event", metric.name, {
// 			event_category: "Web Vitals",
// 			// Google Analytics metrics must be integers, so the value is rounded.
// 			// For CLS the value is first multiplied by 1000 for greater precision
// 			// (note: increase the multiplier for greater precision if needed).
// 			value: Math.round(
// 				metric.name === "CLS" ? metric.value * 1000 : metric.value,
// 			),
// 			// The metric ID is unique to the current page load. When sending multiple
// 			// values from the same page (e.g. for CLS), TTI entries having the same ID
// 			// are related to the same display experience.
// 			event_label: metric.id,
// 			// Use a non-interaction event to avoid affecting bounce rate.
// 			non_interaction: true,
// 		});
// 	}
// }

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="flex flex-col min-h-screen">
					<Header />
					<main className="flex-grow container mx-auto px-4 py-8">
						{children}
					</main>
					<Footer />
				</div>
				<Analytics />
			</body>
		</html>
	);
};

export default Layout;
