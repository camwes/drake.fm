import { type Pick } from "@/lib/salon";
import { DIFFICULTY_LABELS } from "@/lib/salon-map";

function StravaIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

function routeChips(pick: Pick): string[] {
  const chips: string[] = [];
  if (pick.route.difficultyTier) {
    chips.push(DIFFICULTY_LABELS[pick.route.difficultyTier]);
  }
  if (pick.route.distanceMi != null) chips.push(`${pick.route.distanceMi} mi`);
  if (pick.route.surface) chips.push(pick.route.surface);
  if (pick.route.elevationGainFt != null) chips.push(`${pick.route.elevationGainFt} ft gain`);
  return chips;
}

export function PickCard({ pick, color }: { pick: Pick; color?: string }) {
  const chips = routeChips(pick);

  return (
    <article className="flex flex-col rounded-2xl border border-[var(--c-muted-2)] bg-[var(--c-muted-1)] px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-semibold text-fg">
          {color ? (
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          ) : null}
          {pick.title}
        </h3>
        {pick.endorsement ? (
          <span className="shrink-0 rounded-full border border-accent bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            {pick.endorsement}
          </span>
        ) : null}
      </div>

      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-[var(--c-muted-2)] px-2.5 py-1 text-xs text-[var(--c-muted-6)]"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      {pick.why ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--c-muted-9)]">{pick.why}</p>
      ) : (
        <p className="mt-3 text-sm italic leading-relaxed text-[var(--c-muted-5)]">
          Notes coming soon.
        </p>
      )}

      {pick.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {pick.tags.map((tag) => (
            <span key={tag} className="text-xs text-[var(--c-muted-5)]">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      {pick.links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {pick.links.map((link) => {
            const isStrava = link.type === "strava";
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isStrava
                    ? "inline-flex items-center gap-2 rounded-full bg-[#FC4C02] px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                    : "inline-flex items-center gap-2 rounded-full border border-warm bg-surface px-3.5 py-2 text-xs font-semibold text-fg transition hover:bg-surface-hi"
                }
              >
                {isStrava ? <StravaIcon /> : null}
                {link.label}
              </a>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
