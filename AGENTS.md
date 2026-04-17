Keep repository documentation current when behavior changes. If you change deployment setup, public assets, content sources, privacy-sensitive material, or launch readiness, update the relevant docs in the same task — `WORKLOG.md` for current state and hosting notes, `README.md` for durable setup and structure notes.

## Architecture

- **Framework:** Next.js (static export mode), React 19, TypeScript 5, Tailwind CSS 4
- **Deployment:** GitHub Actions → GitHub Pages (triggered on push to `main`)
- **Map:** MapLibre GL + Deck.gl + react-map-gl; primary feature is a full-screen life timeline map
- **Blog:** Markdown files in `content/blog/` parsed with gray-matter; rendered via react-markdown

**Key source layout:**
- `src/app/` — Next.js app router pages
- `src/components/` — React components (`life-atlas.tsx` is the core map component)
- `src/data/life-events.ts` — structured timeline entries with coordinates, zoom, era, colors
- `src/lib/blog.ts` — blog loading, legacy placeholder normalization, wikilink/backlink data
- `src/lib/life-atlas-utils.ts` — reusable map camera and route helpers
- `content/blog/` — markdown blog posts (set `draft: true` in frontmatter to hide)

## Commands

```bash
pnpm run dev     # Start local dev server
pnpm run lint    # Run ESLint
pnpm run build   # Build static export to /out
pnpm start       # Serve production build
```

**Lint alone is not sufficient for deploy safety.** This project can pass `pnpm run lint` and still fail during the GitHub Pages build step. Always run `pnpm run build` after refactors, type-heavy changes, or new utility extraction before considering work complete.

## Architectural Preferences

- Extract reusable map math, camera logic, route helpers, and transition utilities into `src/lib/` instead of letting `src/components/life-atlas.tsx` grow unchecked.
- Extract repeated UI blocks into shared components when map or blog files accumulate duplicated markup.
- At-rest map views should be north-up or close to it.
- Avoid flashy or corny map motion. Long-distance transitions should be smooth direct camera moves with enough duration for tiles to render.
- Keep the custom ground-route animation only for the Stanford to San Francisco transition unless the user asks for additional special cases.
- The Stanford to San Francisco transition should feel like a land route, keep the marker on the basemap, and avoid visible path lines unless explicitly requested.
- The life map should support per-event camera tuning from `src/data/life-events.ts`, including per-event zoom.
- On mobile, prioritize map visibility over overlays. Stack map detail content below the map and keep controls minimal.

## Blog Authoring

The blog supports standard markdown links, raw HTML blocks, and Obsidian-style wikilinks.

Supported wikilink forms:
- `[[slug]]`
- `[[Post Title]]`
- `[[target|Custom Label]]`

Resolution behavior:
- exact slug matches first
- normalized slug matches next
- title and `aliases` frontmatter are used as fallbacks

Optional frontmatter:

```yaml
aliases:
  - JavaScript
  - JS Notes
tags:
  - programming
  - notes
```

Notes:
- invalid wikilinks show warnings in development on the post page
- invalid wikilinks fail production builds so the published note graph stays healthy
- backlinks are rendered automatically at the bottom of each post
- the legacy `__BLOG_URL__` placeholder is normalized to `/blog`
- callouts should use raw HTML blocks instead of Obsidian callout syntax
- for blog excerpts, prefer quote-like lines taken from the post itself when they better capture the voice of the piece

HTML callout example:

```html
<div class="callout callout-note">
  <p class="callout-title">Note</p>
  <p>Callout body content goes here.</p>
</div>
```

Available callout classes (always include the base `callout` class plus the modifier):
- `callout callout-note`
- `callout callout-tip`
- `callout callout-warning`
- `callout callout-important`
- `callout callout-caution`

## Public Repo Safety

This repo backs a live public website. Treat all committed content as public-by-default. Before committing or proposing commits, pay special attention to `public/`, `content/blog`, `src/data/life-events.ts`, and workflow files.

Never commit:
- `.env` files
- API keys, tokens, passwords, or private keys
- exported CMS backups or raw data dumps
- personal documents, resumes, or source archives unless intentionally public
- exact home addresses, phone numbers, or other sensitive identifiers unless intentionally public

Use extra caution with:
- blog posts that mention private individuals, employers, clients, or internal projects
- map timeline entries that reveal more location detail than intended
- files in `public/`, because they are directly downloadable
- workflow changes that may expose environment details or deployment metadata

Pre-push checklist:
1. Run `git status --short` and review every changed file.
2. Review diffs for `public/`, `content/blog`, and `src/data/life-events.ts`.
3. Confirm no secrets or exported source material were added.
4. Run `pnpm run lint` and `pnpm run build`.
5. Update `README.md` and `WORKLOG.md` if public behavior, deployment, or content sourcing changed.

## General Preferences

- Keep documentation tidy and current. If stale references, public-only leftovers, or removed assets are discovered, clean up the docs in the same task.
- Prefer concise, practical changes over broad rewrites. Preserve working behavior and iterate in small focused steps.
- Prefer public-safe repo hygiene. Remove unused exports, source archives, or directly downloadable artifacts that do not need to ship with the site.

## Preferred Working Style

- When behavior changes, update the relevant docs instead of leaving cleanup for later.
- Explain changes in plain language and focus on user-facing behavior rather than internal implementation trivia.
- When tuning UI or animation details, prefer iterative adjustments that are easy to validate visually.
- Regularly run verification while working, not just at the end. For changes that could affect deployability, check `pnpm run lint` and `pnpm run build` before handing off or asking the user to push.
- Do not treat lint as sufficient for deploy safety. After refactors, utility extraction, timer/global typing changes, or other type-heavy edits, `pnpm run build` is required.
- Keep repository guidance durable and project-specific so future agents can pick up context quickly.

## Next.js Note

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
