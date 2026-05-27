"use client";

import type { LifeEvent } from "@/data/life-events";

type FocusCardProps = {
  event: LifeEvent;
  className?: string;
  headingClassName?: string;
};

export function FocusCard({
  event,
  className = "",
  headingClassName = "text-2xl md:text-3xl",
}: Readonly<FocusCardProps>) {
  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">
            Current focus
          </p>
          <h2 className={`mt-2 font-semibold text-fg ${headingClassName}`}>
            {event.title}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-accent-soft">
            {event.year} / {event.city}
          </p>
        </div>
        <div
          className="mt-1 h-4 w-4 rounded-full border border-[var(--c-muted-9)] shadow-[0_0_24px_var(--c-accent-glow)]"
          style={{ backgroundColor: event.accent }}
        />
      </div>
      <p className="mt-4 select-text text-sm leading-6 text-fg-warm">
        {event.summary}
      </p>
      <p className="mt-3 select-text text-sm leading-7 text-[var(--c-muted-9)]">
        {event.detail}
      </p>
    </div>
  );
}
