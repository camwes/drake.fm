# Drake.fm

A personal site built with Next.js, centered on a map-based life timeline and a markdown-backed blog.

## Local Development

Run the development server:

```bash
npm run dev
```

Run verification:

```bash
npm run lint
npm run build
```

## Project Structure

- `src/app` - app routes
- `src/components` - UI components including the site shell, map, and shared focus card
- `src/data/life-events.ts` - timeline data for the map
- `content/blog` - markdown blog posts
- `src/lib/blog.ts` - blog loading and Ghost-link normalization
- `src/lib/life-atlas-utils.ts` - reusable map camera and route helpers
- `.github/workflows/deploy-pages.yml` - GitHub Pages workflow
- `WORKLOG.md` - current project state and hosting notes

## Deployment

This repo is configured for static export and GitHub Pages deployment.

Relevant files:

- `next.config.ts`
- `.github/workflows/deploy-pages.yml`

This site is live as a public site. Treat everything committed here as publicly readable and potentially permanently archived by clones, caches, and search engines.

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
4. Run `npm run lint` and `npm run build`.
5. Update `README.md` and `WORKLOG.md` if public behavior, deployment, or content sourcing changed.

## Documentation Maintenance

Keep docs in sync with the codebase.

When changing deployment behavior, public assets, content sources, privacy-sensitive material, or launch readiness, update:

- `WORKLOG.md` for current state and hosting notes
- `README.md` for durable setup and structure notes
