<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Keep repository documentation current when behavior changes. If you change deployment setup, public assets, content sources, privacy-sensitive material, or launch readiness, update the relevant docs in the same task, especially `WORKLOG.md` and `README.md` when applicable.

This repo backs a live public website. Treat all committed content as public-by-default. Before committing or proposing commits, pay special attention to `public/`, `content/blog`, `src/data/life-events.ts`, and workflow files. Do not add secrets, backups, exports, personal documents, or sensitive personal data unless the user explicitly wants that information public.

Project-specific preferences learned from the user:

- Keep documentation tidy and current. If stale references, public-only leftovers, or removed assets are discovered, clean up the docs in the same task.
- Prefer concise, practical changes over broad rewrites. Preserve working behavior and iterate in small focused steps.
- Prefer public-safe repo hygiene. Remove unused exports, source archives, or directly downloadable artifacts that do not need to ship with the site.
- For blog excerpts, prefer quote-like lines taken from the post itself when they better capture the voice of the piece.
- The life map should support per-event camera tuning from `src/data/life-events.ts`, including per-event zoom.
- Prefer extracting reusable map math, camera logic, route helpers, and transition utilities into `src/lib/` instead of letting `src/components/life-atlas.tsx` grow unchecked.
- Prefer extracting repeated UI blocks into shared components when map or blog files accumulate duplicated markup.
- At-rest map views should be north-up or close to it.
- Avoid flashy or corny map motion. Long-distance transitions should be smooth direct camera moves with enough duration for tiles to render.
- Keep the custom ground-route animation only for the Stanford to San Francisco transition unless the user asks for additional special cases.
- The Stanford to San Francisco transition should feel like a land route, keep the marker on the basemap, and avoid visible path lines unless explicitly requested.
- On mobile, prioritize map visibility over overlays. Stack map detail content below the map and keep controls minimal.

Preferred working style:

- When behavior changes, update the relevant docs instead of leaving cleanup for later.
- Explain changes in plain language and focus on user-facing behavior rather than internal implementation trivia.
- When tuning UI or animation details, prefer iterative adjustments that are easy to validate visually.
- Regularly run verification while working, not just at the end. For changes that could affect deployability, check `npm run lint` and use `npm run build` before handing off or asking the user to push.
- Do not treat lint as sufficient for deploy safety. This repo can pass `npm run lint` and still fail GitHub Pages type checking or Next build steps. After refactors, utility extraction, timer/global typing changes, or other type-heavy edits, `npm run build` is required.
- Keep repository guidance durable and project-specific so future agents can pick up context quickly.
<!-- END:nextjs-agent-rules -->
