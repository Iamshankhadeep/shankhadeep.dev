// src/components/Analytics.tsx
"use client"; // Required for hooks like usePathname

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Define GA parameter types
type GtagConfigParams = {
	page_path?: string;
	[key: string]: unknown;
};

type GtagEventParams = {
	event_category?: string;
	value?: number;
	event_label?: string;
	non_interaction?: boolean;
	[key: string]: unknown;
};

// Define the gtag function signature on the Window interface
declare global {
	interface Window {
		// Define specific gtag signatures using overloads
		gtag?: {
			(command: "config", targetId: string, config?: GtagConfigParams): void;
			(
				command: "event",
				eventName: string,
				eventParams?: GtagEventParams,
			): void;
		};
		dataLayer?: Record<string, unknown>[];
	}
}

// Fetch the Measurement ID from environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Function to report page views
export const pageview = (url: string) => {
	if (GA_MEASUREMENT_ID && typeof window !== "undefined" && window.gtag) {
		// Now explicitly using the defined signature
		window.gtag("config", GA_MEASUREMENT_ID, {
			page_path: url,
		});
	}
};

const Analytics = () => {
	const pathname = usePathname();

	// Track page views when path changes
	useEffect(() => {
		if (GA_MEASUREMENT_ID && pathname) {
			pageview(pathname);
		}
	}, [pathname]);

	// Only render scripts if GA_MEASUREMENT_ID is set
	if (!GA_MEASUREMENT_ID) {
		console.warn(
			"Google Analytics Measurement ID is not set. Analytics disabled.",
		);
		return null;
	}

	return (
		<>
			{/* Google Analytics Global Site Tag (gtag.js) */}
			<Script
				strategy="afterInteractive" // Load after page becomes interactive
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
			/>
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
		</>
	);
};

export default Analytics;
