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
- `src/components` - UI components including the site shell and map
- `src/data/life-events.ts` - timeline data for the life map
- `content/blog` - markdown blog posts
- `src/lib/blog.ts` - blog loading and Ghost-link normalization
- `.github/workflows/deploy-pages.yml` - GitHub Pages workflow
- `WORKLOG.md` - current project state and hosting notes

## Deployment

This repo is configured for static export and GitHub Pages deployment.

Relevant files:

- `next.config.ts`
- `.github/workflows/deploy-pages.yml`

## Documentation Maintenance

Keep docs in sync with the codebase.

When changing deployment behavior, public assets, content sources, privacy-sensitive material, or launch readiness, update:

- `WORKLOG.md` for current state and hosting notes
- `README.md` for durable setup and structure notes
