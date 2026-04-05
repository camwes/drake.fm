# Drake.fm Worklog

## Current State

This project is a Next.js 16 app with:

- a full-screen map-first home page
- a right-side timeline panel
- a shared hamburger menu and side drawer
- a blog powered by markdown files in `content/blog`

The current UI direction is:

- map is the primary visual focus
- top-left branding says `Drake`
- `Drake` uses the local old-English font to echo the Drake Hotel inspiration
- timeline selection drives map movement

## Branding

The top-left brand is implemented in:

- `src/components/site-shell.tsx`

The old-English font is loaded in:

- `src/app/layout.tsx`

The font asset was moved to:

- `public/fonts/old-english-five/OldEnglishFive-axyVg.ttf`

## Blog Setup

Blog content is stored outside the app code in:

- `content/blog`

Import source status:

- the original Ghost export file has been removed from the public repo
- imported markdown posts remain under `content/blog`

Important blog implementation files:

- `src/lib/blog.ts`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

Installed blog-related packages:

- `react-markdown`
- `remark-gfm`
- `gray-matter`
- `turndown`
- `rehype-raw`
- `@tailwindcss/typography`

## Blog Behavior

Markdown rendering:

- posts render with `react-markdown`
- `remark-gfm` is enabled
- typography styles are enabled through Tailwind in `src/app/globals.css`

Footnotes:

- imported Ghost posts did not use true GFM footnotes
- `src/lib/blog.ts` normalizes legacy Ghost-style footnote anchors so the footnote number links and return links work again

Drafts:

- add `draft: true` in frontmatter to make a post a draft
- drafts appear in development
- drafts are excluded from production builds
- current draft post is `content/blog/js.md` (`Learning Javascript`)

Internal Ghost links:

- `__GHOST_URL__` is normalized to `/blog`

Known content caveat:

- some imported posts may still contain legacy image or old Ghost asset paths that may need manual cleanup later

## Navigation

Shared nav shell:

- `src/components/site-shell.tsx`

Behavior:

- hamburger opens a left drawer
- drawer links currently include `Life Map` and `Blog`

## Map / Timeline Implementation

Main map component:

- `src/components/life-atlas.tsx`

Data source:

- `src/data/life-events.ts`

Map stack:

- `deck.gl`
- `react-map-gl/maplibre`
- CARTO Dark Matter basemap:
  - `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`

Map controls:

- built-in nav controls were removed because of interaction problems
- custom zoom buttons are overlaid in the top-right of the map
- map overlay text is selectable

## Current Map Animation Rules

The map route animation is intentionally constrained.

Current behavior:

- route animation only plays when moving one step forward in timeline order
- jumping around the timeline does not show the animated route
- moving backward in time does not show the animated route
- non-animated moves just pan/fly the camera to the target

Current transition style:

- the camera pulls back to a route overview during forward sequential travel
- then eases into the destination
- travel duration is intentionally slower and cinematic

Current moving marker:

- the previous plane experiments were removed
- the active route now uses a subtle moving marker instead of a plane graphic
- marker rides above the arc with a small altitude offset to avoid z-fighting

Important constants in `src/components/life-atlas.tsx`:

- `NAVIGATION_DURATION`
- `ROUTE_HEIGHT_MULTIPLIER`
- `ROUTE_PULSE_ALTITUDE_OFFSET`

## Things That Were Tried

These were attempted and then backed away from or simplified:

- full always-on route network between all life events
- icon-atlas based plane marker
- text-based plane marker
- vector plane path marker

Reason:

- they either changed the feel of the animation too much or caused rendering / visibility issues

## Likely Next Good Steps

- clean up old Ghost image URLs in imported blog posts
- refine the map marker styling if an even subtler travel indicator is desired
- improve the `Drake` badge styling to feel even closer to Drake Hotel signage
- add richer blog index metadata like feature images or tags if wanted

## Verification Status

At the current stopping point, the app was passing:

- `npm run lint`
- `npm run build`

## Hosting Notes

The user wants this document kept current as new things are learned.
If an agent changes deployment setup, public assets, content sourcing, or other launch-relevant behavior, update this file in the same task.

GitHub Pages deployment is the next likely major step.

Current status:

- app currently builds successfully with `next build`
- `next.config.ts` is now configured for static export
- GitHub Pages will require static export because there is no Node server runtime there
- project now includes a Pages workflow at `.github/workflows/deploy-pages.yml`
- current config assumes GitHub Actions deployment to a project Pages URL and derives `basePath` / `assetPrefix` from `GITHUB_REPOSITORY`
- `trailingSlash: true` is enabled for friendlier static hosting on GitHub Pages

Likely GitHub Pages plan:

1. Update `next.config.ts` for static export
   - set `output: "export"`
   - set `images: { unoptimized: true }` if Next image optimization is ever introduced
   - if deployed to a project site instead of a custom domain, set `basePath` and `assetPrefix`

2. Decide the deployment URL shape
   - custom domain is simplest for asset paths
   - if using standard project pages, final URL will likely be something like `https://<user>.github.io/<repo>`
   - because this app lives in `projects/drake-life-map` inside a larger git repo, deployment details depend on whether the GitHub repo root is this app or a parent monorepo

3. Add a GitHub Actions workflow
   - install deps in `projects/drake-life-map`
   - run `npm ci`
   - run `npm run build`
   - upload the generated `out` directory as the Pages artifact
   - deploy using `actions/deploy-pages`

4. Verify static compatibility
   - current blog setup should work because posts are read at build time and generated statically
   - current routes already build as static pages
   - external map tiles are loaded client-side and should still work on Pages

5. Decide repo strategy
   - easiest path: make `drake-life-map` its own GitHub repo
   - possible but slightly more complex path: keep it in the parent repo and configure the workflow with the project subdirectory as the working directory

Recommended approach:

- best option is to host this project from its own dedicated GitHub repo
- then use GitHub Pages with a GitHub Actions deploy from the repo root
- if a custom domain is available, use that to avoid `basePath` and `assetPrefix` complexity

Current repo hosting plan:

- user created a new empty GitHub repo at `git@github.com:camwes/drake.fm.git`
- current app still lives inside the parent `/home/cdrake/dock` repo, which is `camwes/dotfiles`
- best next step is to move / sync this project into the standalone `drake.fm` repo root
- important lesson: do not hardcode a local absolute Turbopack root in `next.config.ts` because it breaks when the project is moved or cloned elsewhere
