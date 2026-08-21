import "server-only";
import { XMLParser } from "fast-xml-parser";

const BLOG_ID = "n-mshsun";
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID}.xml`;

export interface NaverBlogPost {
  title: string;
  link: string;
  category: string;
  publishedAt: string;
  description: string;
}

export interface NaverBlogFeed {
  title: string;
  description: string;
  link: string;
  posts: NaverBlogPost[];
}

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "#text" in value) {
    return asText((value as { "#text": unknown })["#text"]);
  }
  return "";
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export async function getNaverBlogFeed(): Promise<NaverBlogFeed> {
  const response = await fetch(RSS_URL, {
    next: { revalidate: 1800 },
    headers: { "User-Agent": "HiBezzang-Content-Studio/1.0" },
  });

  if (!response.ok) throw new Error(`Naver RSS responded with ${response.status}`);

  const xml = await response.text();
  const parser = new XMLParser({ ignoreAttributes: false, processEntities: true, trimValues: true });
  const channel = parser.parse(xml)?.rss?.channel as Record<string, unknown> | undefined;
  if (!channel) throw new Error("Invalid Naver RSS response");

  const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];
  const posts = rawItems.slice(0, 6).map((raw: Record<string, unknown>) => ({
    title: asText(raw.title),
    link: asText(raw.link).replace(/\?fromRss=.*$/, ""),
    category: asText(raw.category) || "블로그",
    publishedAt: asText(raw.pubDate),
    description: stripHtml(asText(raw.description)).slice(0, 150),
  }));

  return {
    title: asText(channel.title),
    description: asText(channel.description),
    link: `https://blog.naver.com/${BLOG_ID}`,
    posts,
  };
}
