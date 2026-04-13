import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fidely.com";

  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/business", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/customers", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/help", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/careers", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/press", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/signup", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/wallet", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const cardTypes = ["punch", "reward", "membership", "cashback", "discount"];

  return [
    ...staticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...cardTypes.map((type) => ({
      url: `${baseUrl}/card/${type}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
