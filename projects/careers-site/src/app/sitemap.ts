import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.grq.ae";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
