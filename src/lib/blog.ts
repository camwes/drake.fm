import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  canonicalUrl?: string;
  featureImage?: string;
  draft?: boolean;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const isDevelopment = process.env.NODE_ENV === "development";

function normalizeContent(content: string): string {
  return content
    .replaceAll("__GHOST_URL__", "/blog")
    .replace(
      /^(\d+)\.\s\s/gm,
      (_match, footnoteNumber: string) =>
        `<span id="fn${footnoteNumber}"></span>\n${footnoteNumber}.  `,
    )
    .replace(
      /\[\\\[(\d+)\\\]\]\(#fn(\d+)\)/g,
      (_match, referenceNumber: string, footnoteNumber: string) =>
        `<sup id="fnref${referenceNumber}"><a href="#fn${footnoteNumber}">[${referenceNumber}]</a></sup>`,
    );
}

export async function getAllBlogPosts(): Promise<BlogPostMeta[]> {
  const fileNames = await fs.readdir(BLOG_DIRECTORY);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const filePath = path.join(BLOG_DIRECTORY, fileName);
        const raw = await fs.readFile(filePath, "utf8");
        const { data } = matter(raw);

        return {
          title: String(data.title ?? ""),
          slug: String(data.slug ?? fileName.replace(/\.md$/, "")),
          date: String(data.date ?? ""),
          excerpt: String(data.excerpt ?? ""),
          canonicalUrl: String(data.canonicalUrl ?? ""),
          featureImage: String(data.featureImage ?? ""),
          draft: Boolean(data.draft ?? false),
        };
      }),
  );

  return posts
    .filter((post) => isDevelopment || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIRECTORY, `${slug}.md`);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    const post = {
      title: String(data.title ?? ""),
      slug: String(data.slug ?? slug),
      date: String(data.date ?? ""),
      excerpt: String(data.excerpt ?? ""),
      canonicalUrl: String(data.canonicalUrl ?? ""),
      featureImage: String(data.featureImage ?? ""),
      draft: Boolean(data.draft ?? false),
      content: normalizeContent(content),
    };

    if (!isDevelopment && post.draft) {
      return null;
    }

    return post;
  } catch {
    return null;
  }
}
