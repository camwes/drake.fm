"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SiteShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/", label: "Life Map" },
  { href: "/blog", label: "Blog" },
];

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="pointer-events-none fixed left-4 top-4 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7a4a2b] bg-[#2a1812]/90 text-[#fff4df] shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-[#3a2119]"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="site-navigation-drawer"
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        </button>
        <Link
          href="/"
          className="pointer-events-auto rounded-full border border-[#7a4a2b] bg-[#2a1812]/90 px-5 py-2 text-[#f4c77d] shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-[#3a2119]"
        >
          <span
            className="block text-3xl leading-none tracking-[0.04em] text-[#f8d57e]"
            style={{ fontFamily: "var(--font-drake-wordmark)" }}
          >
            Drake
          </span>
        </Link>
      </div>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        id="site-navigation-drawer"
        className={`fixed left-0 top-0 z-50 flex h-full w-[320px] max-w-[85vw] flex-col border-r border-[#5d3827] bg-[#130d0c] shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f8d57e]">
              Navigation
            </p>
            <p className="mt-2 text-sm text-white/60">Explore the map and blog.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#7a4a2b] bg-[#2a1812] text-[#fff4df] transition hover:bg-[#3a2119]"
            aria-label="Close navigation menu"
          >
            X
          </button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-2xl border px-4 py-4 text-sm transition ${
                    isActive
                      ? "border-[#f8d57e] bg-[#2a1812] text-white shadow-[0_0_0_1px_rgba(248,213,126,0.35)]"
                      : "border-white/8 bg-white/4 text-white/75 hover:border-white/20 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {children}
    </div>
  );
}
