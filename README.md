# Drake.fm

A personal site built with Next.js, centered on a map-based life timeline and a markdown-backed blog. Lives inside the dock pnpm monorepo at `~/dock/projects/drake-fm/`, alongside the private `dock-dash` dashboards. Shared chrome lives in `packages/drake-ui` (`@drake/ui`).

## Local Development

```bash
# Run all pnpm commands from the dock repo root (~/dock/), not from this dir.
pnpm install                  # one-time + after dep changes
pnpm -F drake-life-map dev    # localhost:3000
```

## Verification

```bash
pnpm -F drake-life-map lint
pnpm -F drake-life-map build
```

`pnpm run lint` alone is not sufficient — always run the build before pushing. It catches type and Next.js build issues that lint misses.

## Running Heatmap

The `/running` page displays a Strava running heatmap generated from your activity data, split into **per-area** views so each area's heat normalizes relative to that area.

**One-time setup** — create `~/.config/running-coach/home_location.json` with your home coordinates and desired clip radius:

```json
{ "lat": YOUR_LAT, "lng": YOUR_LNG, "clip_radius_km": 0.8 }
```

Points within `clip_radius_km` of home are stripped before the data is committed to keep your home location private.

**Areas + seeds.** The displayed `src/data/running-heatmap-1yr.json` is clustered into areas (`{"areas": [...]}`). `src/data/running-regions.json` names anchor areas via `seeds` (e.g. San Francisco, Foster City) and sets the cluster/match radii; runs outside any seed auto-surface as `travel-N` areas. Add a seed to give a recurring spot a real name + framing. Set `"seededOnly": true` (the current default) to render only seed areas and drop everything else.

**Regenerate after new runs:**

```bash
cd ~/dock
RC=/home/cdrake/dock/virtualenvs/running-coach/bin/python
$RC lib/agent/running-coach/tools/export_heatmap.py --since-days 365 --output running-heatmap-1yr.json --format areas
$RC lib/agent/running-coach/tools/export_heatmap.py   # all-time, flat
```

Then commit the `src/data/running-heatmap*.json` files and push. The heatmap data is baked into the static build — no runtime Strava auth needed.

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
