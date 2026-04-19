# Drake.fm

A personal site built with Next.js, centered on a map-based life timeline and a markdown-backed blog.

## Local Development

```bash
pnpm run dev
```

## Verification

```bash
pnpm run lint
pnpm run build
```

`pnpm run lint` alone is not sufficient — always run `pnpm run build` before pushing. It catches type and Next.js build issues that lint misses.

## Running Heatmap

The life atlas map displays a Strava running heatmap generated from your activity data.

**One-time setup** — create `~/.config/running-coach/home_location.json` with your home coordinates and desired clip radius:

```json
{ "lat": 37.7551, "lng": -122.4307, "clip_radius_km": 0.8 }
```

Points within `clip_radius_km` of home are stripped before the data is committed to keep your home location private.

**Regenerate after new runs:**

```bash
cd ~/dock
/home/cdrake/dock/virtualenvs/running-coach/bin/python lib/agent/running-coach/tools/export_heatmap.py
```

Then commit `src/data/running-heatmap.json` and push. The heatmap data is baked into the static build — no runtime Strava auth needed.

## Project Structure

- `src/app/` — app routes
- `src/components/` — UI components (site shell, map, shared focus card)
- `src/data/life-events.ts` — timeline data for the map
- `src/lib/` — utilities (blog parsing, map camera and route helpers)
- `content/blog/` — markdown blog posts
- `.github/workflows/deploy-pages.yml` — GitHub Pages workflow
- `WORKLOG.md` — current project state and hosting notes

## Deployment

Static export, deployed to GitHub Pages via GitHub Actions on push to `main`.

1. Run `pnpm run lint` and `pnpm run build` locally.
2. Commit and push to `main`.
3. GitHub Actions runs `.github/workflows/deploy-pages.yml`.
4. Watch the `Deploy to GitHub Pages` workflow in the repo `Actions` tab.

GitHub-side requirements:
- `Settings → Pages → Source` must be `GitHub Actions`
- Repo must remain public for GitHub Pages on the current plan
