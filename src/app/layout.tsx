import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Analytics from "../components/Analytics";
import FloatingContactButton from "../components/FloatingContactButton";

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-ibm-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
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
	icons: {
		icon: "/logo.svg",
	},
};

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<html lang="en">
			<body className={`${ibmPlexMono.variable} font-mono antialiased`}>
				<div className="flex flex-col min-h-screen">
					<main className="flex-grow">{children}</main>
				</div>
				<FloatingContactButton />
				<Analytics />
			</body>
		</html>
	);
};

export default Layout;
