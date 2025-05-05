// src/components/Analytics.tsx
'use client'; // Required for hooks like usePathname

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Define the gtag function signature on the Window interface
declare global {
  interface Window {
    // Define specific gtag signatures using overloads
    gtag?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (command: 'config', targetId: string, config?: { 
        page_path?: string; 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any 
      }): void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (command: 'event', eventName: string, eventParams?: { 
        event_category?: string; value?: number; event_label?: string; non_interaction?: boolean; 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any 
      }): void;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: Record<string, any>[]; 
  }
}

// Fetch the Measurement ID from environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Function to report page views
export const pageview = (url: string) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && window.gtag) {
    // Now explicitly using the defined signature
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

const Analytics = () => {
  const pathname = usePathname();

  // Track page views when path changes
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      pageview(pathname);
    }
  }, [pathname]);

  // Only render scripts if GA_MEASUREMENT_ID is set
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID is not set. Analytics disabled.');
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
