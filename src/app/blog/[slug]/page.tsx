import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg px-6 pb-16 pt-28 text-fg lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex rounded-full border border-warm bg-surface px-4 py-2 text-xs uppercase tracking-[0.24em] text-fg-cream transition hover:bg-surface-hi"
        >
          Back to blog
        </Link>

        <header className="mt-8 border-b border-[var(--c-muted-3)] pb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
            {formatPostDate(post.date)}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-5xl">
            {post.title}
          </h1>
          {isDevelopment && post.draft ? (
            <div className="mt-4">
              <span className="rounded-full border border-accent bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                Dev Draft
              </span>
            </div>
          ) : null}
          {post.excerpt ? (
            <p className="mt-5 text-lg leading-8 text-fg-soft">{post.excerpt}</p>
          ) : null}
        </header>

        <article className="prose mt-10 max-w-none prose-headings:text-[var(--c-fg)] prose-p:text-[var(--c-muted-9)] prose-strong:text-[var(--c-fg)] prose-a:text-[var(--c-accent)] prose-blockquote:border-l-[var(--c-accent)] prose-blockquote:text-[var(--c-fg-soft)] prose-code:text-[var(--c-accent)] prose-pre:border prose-pre:border-[var(--c-border-warm-soft)] prose-pre:bg-[var(--c-surface-deep)] prose-li:text-[var(--c-muted-9)] prose-hr:border-[var(--c-muted-3)] prose-div:my-0 prose-div:max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {post.backlinks.length > 0 ? (
          <section className="mt-12 rounded-[2rem] border border-warm-soft bg-surface-deep p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Linked From
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {post.backlinks.map((backlink) => (
                <Link
                  key={backlink.slug}
                  href={backlink.href}
                  className="rounded-full border border-warm bg-surface px-4 py-2 text-sm text-fg-soft transition hover:bg-surface-hi"
                >
                  {backlink.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {isDevelopment && post.wikilinkIssues.length > 0 ? (
          <section className="mt-6 rounded-[2rem] border border-warm-deep bg-surface-deep p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Wikilink Warnings
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-fg-soft">
              {post.wikilinkIssues.map((issue) => (
                <li key={`${issue.target}-${issue.message}`}>
                  <code className="text-accent">{issue.target}</code>: {issue.message}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
