import { siteConfig, pageMetadata } from "@/lib/metadata";

export default function sitemap() {
  const lastModified = new Date();

  return Object.values(pageMetadata).map((page) => ({
    url: `${siteConfig.url}${page.path === "/" ? "" : page.path}`,
    lastModified,
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : 0.8,
  }));
}
