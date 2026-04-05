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
          <p className="text-xs uppercase tracking-[0.25em] text-[#f8d57e]">
            Current focus
          </p>
          <h2 className={`mt-2 font-semibold text-white ${headingClassName}`}>
            {event.title}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#f0b77f]">
            {event.year} / {event.city}
          </p>
        </div>
        <div
          className="mt-1 h-4 w-4 rounded-full border border-white/70 shadow-[0_0_24px_rgba(248,213,126,0.45)]"
          style={{ backgroundColor: event.accent }}
        />
      </div>
      <p className="mt-4 select-text text-sm leading-6 text-[#f5d4b5]">
        {event.summary}
      </p>
      <p className="mt-3 select-text text-sm leading-7 text-white/78">
        {event.detail}
      </p>
    </div>
  );
}
