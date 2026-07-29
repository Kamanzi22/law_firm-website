import { supabase } from "../supabaseClient";
import type { InsightArticleData } from "../../data/insights";

interface ArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  reading_minutes: number;
  cover_image_url: string | null;
  content: string[] | null;
  author: { slug: string } | { slug: string }[] | null;
}

export async function fetchArticles(): Promise<InsightArticleData[]> {
  const { data, error } = await supabase!
    .from("articles")
    .select("slug, title, excerpt, category, published_at, reading_minutes, cover_image_url, content, author:team_members(slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as ArticleRow[]).map((row): InsightArticleData => {
    const author = Array.isArray(row.author) ? row.author[0] : row.author;
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      category: row.category,
      author: author?.slug ?? "",
      date: row.published_at ?? "",
      readingMinutes: row.reading_minutes,
      coverImage: row.cover_image_url ?? "/images/insights/placeholder.svg",
      content: row.content ?? [],
    };
  });
}
