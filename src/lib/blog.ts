import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createWikilinkResolver, rewriteWikilinks, type WikilinkIssue, type WikilinkReference } from "@/lib/blog-wikilinks";

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  canonicalUrl?: string;
  featureImage?: string;
  draft?: boolean;
  aliases?: string[];
  tags?: string[];
};

export type BlogPost = BlogPostMeta & {
  content: string;
  backlinks: WikilinkReference[];
  outboundLinks: WikilinkReference[];
  wikilinkIssues: WikilinkIssue[];
};

const isDevelopment = process.env.NODE_ENV === "development";
let blogDataPromise: Promise<BlogData> | null = null;

function normalizeContent(content: string): string {
  return content
    .replaceAll("__BLOG_URL__", "/blog")
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
  const blogData = await getBlogData();
  return blogData.posts
    .map((post) => toBlogPostMeta(post))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const blogData = await getBlogData();
  return blogData.postsBySlug.get(slug) ?? null;
}

type RawBlogPost = BlogPostMeta & {
  rawContent: string;
};

type BlogData = {
  posts: BlogPost[];
  postsBySlug: Map<string, BlogPost>;
};

async function getBlogData(): Promise<BlogData> {
  if (isDevelopment) {
    return loadBlogData();
  }

  blogDataPromise ??= loadBlogData();
  return blogDataPromise;
}

async function loadBlogData(): Promise<BlogData> {
  const rawPosts = await loadRawBlogPosts();
  const visiblePosts = rawPosts.filter((post) => isDevelopment || !post.draft);
  const resolver = createWikilinkResolver(
    visiblePosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      aliases: post.aliases ?? [],
    })),
  );

  const posts: BlogPost[] = visiblePosts.map((post) => {
    const rewrittenContent = rewriteWikilinks(normalizeContent(post.rawContent), resolver);
    return {
      ...post,
      content: rewrittenContent.content,
      backlinks: [] as WikilinkReference[],
      outboundLinks: rewrittenContent.outboundLinks.filter((link) => link.slug !== post.slug),
      wikilinkIssues: rewrittenContent.issues,
    };
  });

  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  for (const post of posts) {
    for (const outboundLink of post.outboundLinks) {
      const targetPost = postsBySlug.get(outboundLink.slug);
      if (!targetPost) {
        continue;
      }

      const backlink = {
        slug: post.slug,
        title: post.title,
        href: `/blog/${post.slug}`,
      };

      if (!targetPost.backlinks.some((existingLink) => existingLink.slug === backlink.slug)) {
        targetPost.backlinks.push(backlink);
      }
    }
  }

  const issues = posts.flatMap((post) =>
    post.wikilinkIssues.map((issue) => `${post.slug}: ${issue.message}`),
  );
  if (issues.length > 0 && !isDevelopment) {
    throw new Error(`Invalid wikilinks found during blog build:\n${issues.join("\n")}`);
  }

  return {
    posts,
    postsBySlug,
  };
}

async function loadRawBlogPosts(): Promise<RawBlogPost[]> {
  const fileNames = await fs.readdir(BLOG_DIRECTORY);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const filePath = path.join(BLOG_DIRECTORY, fileName);
        const raw = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(raw);

        return {
          title: String(data.title ?? ""),
          slug: String(data.slug ?? fileName.replace(/\.md$/, "")),
          date: String(data.date ?? ""),
          excerpt: String(data.excerpt ?? ""),
          canonicalUrl: String(data.canonicalUrl ?? ""),
          featureImage: String(data.featureImage ?? ""),
          draft: Boolean(data.draft ?? false),
          aliases: normalizeStringList(data.aliases),
          tags: normalizeStringList(data.tags),
          rawContent: content,
        };
      }),
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item)).filter(Boolean);
}

function toBlogPostMeta(post: BlogPost): BlogPostMeta {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    canonicalUrl: post.canonicalUrl,
    featureImage: post.featureImage,
    draft: post.draft,
    aliases: post.aliases,
    tags: post.tags,
  };
}
