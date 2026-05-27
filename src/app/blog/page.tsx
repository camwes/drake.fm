import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen bg-bg px-6 pb-12 pt-28 text-fg lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Blog
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-5xl">
            Notes, stories, and map-side writing.
          </h1>
          <p className="mt-5 text-lg leading-8 text-fg-soft">
            Markdown-backed posts with wikilinks, backlinks, and static page builds.
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[2rem] border border-warm-soft bg-surface-deep p-6 shadow-[var(--c-shadow-deep)]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
                {formatPostDate(post.date)}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-fg">{post.title}</h2>
                {isDevelopment && post.draft ? (
                  <span className="rounded-full border border-accent bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                    Dev Draft
                  </span>
                ) : null}
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--c-muted-9)]">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
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
