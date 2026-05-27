"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@drake/ui";

type SiteShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/running", label: "Running" },
  { href: "/chess", label: "Chess" },
];

export function SiteShell({ children }: Readonly<SiteShellProps>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="pointer-events-none fixed left-4 top-4 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-warm bg-surface/90 text-fg shadow-[var(--c-shadow-soft)] backdrop-blur transition hover:bg-surface-hi"
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
          className="pointer-events-auto rounded-full border border-warm bg-surface/90 px-5 py-2 text-fg-cream shadow-[var(--c-shadow-soft)] backdrop-blur transition hover:bg-surface-hi"
        >
          <span
            className="block text-3xl leading-none tracking-[0.04em] text-accent"
            style={{ fontFamily: "var(--font-drake-wordmark)" }}
          >
            Drake
          </span>
        </Link>
        <ThemeToggle />
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
        className={`fixed left-0 top-0 z-50 flex h-full w-[320px] max-w-[85vw] flex-col border-r border-warm-soft bg-surface-card shadow-[var(--c-shadow-strong)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-[var(--c-muted-3)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              Drake.fm
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-warm bg-surface text-fg transition hover:bg-surface-hi"
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
                      ? "border-accent bg-surface text-fg shadow-[0_0_0_1px_var(--c-accent-ring)]"
                      : "border-[var(--c-muted-2)] bg-[var(--c-muted-1)] text-[var(--c-muted-9)] hover:border-[var(--c-muted-4)] hover:bg-[var(--c-muted-2)] hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[var(--c-muted-3)] px-6 py-5 text-xs text-[var(--c-muted-6)]">
          <p>Copyright &copy; {currentYear} Cameron Drake</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </aside>

      {children}
    </div>
  );
}
