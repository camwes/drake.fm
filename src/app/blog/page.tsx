import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen bg-[#120b0a] px-6 pb-12 pt-28 text-white lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f8d57e]">
            Blog
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#fff4df] sm:text-5xl">
            Notes, stories, and map-side writing.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#f2d4b0]">
            Markdown-backed posts with wikilinks, backlinks, and static page builds.
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[2rem] border border-[#5d3827] bg-[#1a100d] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#f0b77f]">
                {formatPostDate(post.date)}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
                {isDevelopment && post.draft ? (
                  <span className="rounded-full border border-[#f8d57e] bg-[#2a1812] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8d57e]">
                    Dev Draft
                  </span>
                ) : null}
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
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
