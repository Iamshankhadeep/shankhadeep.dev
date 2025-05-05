// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

// TODO: Replace with your actual domain when deploying
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shankhadeep.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  // For now, just include the homepage.
  // Extend this array if you add more static pages (e.g., /blog, /about)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(), // Use current date/time or a specific build date
      changeFrequency: 'monthly', // Ensure this matches the allowed literal types
      priority: 1, // Priority relative to other URLs on your site (0.0 to 1.0)
    },
    // Example for adding another page:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.8,
    // },
  ];

  // TODO: If you add dynamic routes (e.g., blog posts), fetch their slugs/IDs
  // and map them to sitemap entries here.
  // const dynamicRoutes = ...

  return [
    ...staticPages,
    // ...dynamicRoutes, // Combine if you have dynamic routes
  ];
}
