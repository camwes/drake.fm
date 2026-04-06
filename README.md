# Drake.fm

A personal site built with Next.js, centered on a map-based life timeline and a markdown-backed blog.

## Local Development

Run the development server:

```bash
pnpm run dev
```

Run verification:

```bash
pnpm run lint
pnpm run build
```

## Project Structure

- `src/app` - app routes
- `src/components` - UI components including the site shell, map, and shared focus card
- `src/data/life-events.ts` - timeline data for the map
- `content/blog` - markdown blog posts
- `src/lib/blog.ts` - blog loading, legacy placeholder normalization, and wikilink/backlink data
- `src/lib/life-atlas-utils.ts` - reusable map camera and route helpers
- `.github/workflows/deploy-pages.yml` - GitHub Pages workflow
- `WORKLOG.md` - current project state and hosting notes

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

HTML callout example:

```html
<div class="callout callout-note">
  <p class="callout-title">Note</p>
  <p>Callout body content goes here.</p>
</div>
```

Available callout classes:

- `callout callout-note`
- `callout callout-tip`
- `callout callout-warning`
- `callout callout-important`
- `callout callout-caution`

## Deployment

This repo is configured for static export and GitHub Pages deployment.

Relevant files:

- `next.config.ts`
- `.github/workflows/deploy-pages.yml`

This site is live as a public site. Treat everything committed here as publicly readable and potentially permanently archived by clones, caches, and search engines.

To deploy a new version of the site:

1. Run verification locally:
   - `pnpm run lint`
   - `pnpm run build`
2. Commit your changes.
3. Push to `main`.
4. GitHub Actions runs `.github/workflows/deploy-pages.yml`.
5. GitHub Pages publishes the updated static site.

Typical commands:

```bash
pnpm run lint
pnpm run build
git add .
git commit -m "your message"
git push origin main
```

After pushing:

- open the repo `Actions` tab
- watch the `Deploy to GitHub Pages` workflow
- refresh the live site after the workflow succeeds

Important:

- `pnpm run lint` alone is not enough to guarantee a successful deploy
- `pnpm run build` catches type and Next.js build issues that can still fail in GitHub Actions

GitHub-side requirements:

- `Settings -> Pages -> Source` should be `GitHub Actions`
- the repo must remain public for GitHub Pages on the current plan

## Public Repo Safety

Before pushing changes, review anything new in these locations carefully:

- `content/blog`
- `src/data/life-events.ts`
- `public/`
- `.github/workflows/`
- `README.md` and `WORKLOG.md`

Never commit:

- `.env` files
- API keys, tokens, passwords, or private keys
- exported CMS backups or raw data dumps
- personal documents, resumes, or source archives unless they are intentionally public
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

## Documentation Maintenance

Keep docs in sync with the codebase.

When changing deployment behavior, public assets, content sources, privacy-sensitive material, or launch readiness, update:

- `WORKLOG.md` for current state and hosting notes
- `README.md` for durable setup and structure notes
