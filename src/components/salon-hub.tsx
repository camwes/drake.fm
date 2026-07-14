import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { type Collection } from "@/lib/salon";

const DOMAIN_LABELS: Record<string, string> = {
  route: "Running Routes",
  place: "Places",
  track: "Music",
  album: "Music",
  artist: "Music",
  other: "More",
};

function domainLabel(domain: string): string {
  return DOMAIN_LABELS[domain] ?? domain;
}

export function SalonHub({
  grouped,
  prose,
}: {
  grouped: Record<string, Collection[]>;
  prose?: string;
}) {
  const domains = Object.keys(grouped);

  return (
    <main className="min-h-screen bg-bg px-6 pb-16 pt-28 text-fg lg:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-[var(--c-muted-3)] pb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">Salon</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-5xl">
            Things I&rsquo;d recommend
          </h1>
          {prose ? (
            <div className="mt-5 text-lg leading-8 text-fg-soft [&>p]:mb-0">
              <ReactMarkdown>{prose}</ReactMarkdown>
            </div>
          ) : null}
        </header>

        {domains.map((domain) => (
          <section key={domain} className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--c-muted-5)]">
              {domainLabel(domain)}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {grouped[domain].map((collection) => (
                <Link
                  key={collection.id}
                  href={`/salon/${collection.id}`}
                  className="flex flex-col rounded-2xl border border-[var(--c-muted-2)] bg-[var(--c-muted-1)] px-5 py-5 transition hover:border-accent hover:bg-[var(--c-muted-2)]"
                >
                  {collection.area ? (
                    <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
                      {collection.area.label}
                    </p>
                  ) : null}
                  <h2 className="mt-2 text-lg font-semibold text-fg">{collection.title}</h2>
                  {collection.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--c-muted-9)]">
                      {collection.description}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-[var(--c-muted-5)]">
                    {collection.picks.length}{" "}
                    {collection.picks.length === 1 ? "pick" : "picks"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
