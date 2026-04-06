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
    <main className="min-h-screen bg-[#120b0a] px-6 pb-16 pt-28 text-white lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex rounded-full border border-[#7a4a2b] bg-[#2a1812] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f4c77d] transition hover:bg-[#3a2119]"
        >
          Back to blog
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f0b77f]">
            {formatPostDate(post.date)}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#fff4df] sm:text-5xl">
            {post.title}
          </h1>
          {isDevelopment && post.draft ? (
            <div className="mt-4">
              <span className="rounded-full border border-[#f8d57e] bg-[#2a1812] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8d57e]">
                Dev Draft
              </span>
            </div>
          ) : null}
          {post.excerpt ? (
            <p className="mt-5 text-lg leading-8 text-[#f2d4b0]">{post.excerpt}</p>
          ) : null}
        </header>

        <article className="prose prose-invert mt-10 max-w-none prose-headings:text-[#fff4df] prose-p:text-white/80 prose-strong:text-white prose-a:text-[#f8d57e] prose-blockquote:border-l-[#f8d57e] prose-blockquote:text-[#f2d4b0] prose-code:text-[#f8d57e] prose-pre:border prose-pre:border-[#5d3827] prose-pre:bg-[#1a100d] prose-li:text-white/80 prose-hr:border-white/10 prose-div:my-0 prose-div:max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {post.backlinks.length > 0 ? (
          <section className="mt-12 rounded-[2rem] border border-[#5d3827] bg-[#1a100d] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f8d57e]">
              Linked From
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {post.backlinks.map((backlink) => (
                <Link
                  key={backlink.slug}
                  href={backlink.href}
                  className="rounded-full border border-[#7a4a2b] bg-[#2a1812] px-4 py-2 text-sm text-[#f2d4b0] transition hover:bg-[#3a2119]"
                >
                  {backlink.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {isDevelopment && post.wikilinkIssues.length > 0 ? (
          <section className="mt-6 rounded-[2rem] border border-[#8b5c39] bg-[#24130d] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f8d57e]">
              Wikilink Warnings
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#f2d4b0]">
              {post.wikilinkIssues.map((issue) => (
                <li key={`${issue.target}-${issue.message}`}>
                  <code className="text-[#f8d57e]">{issue.target}</code>: {issue.message}
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
