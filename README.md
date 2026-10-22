# desirekaleba.github.io

My personal site: a home page, three case studies (PageVow, VelaBid, StartupBlink) and a 404. Static
[Astro](https://astro.build), deployed to GitHub Pages at https://desirekaleba.github.io.

## Run it

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # astro check, then a static build into dist/
pnpm preview   # serve dist/
```

Node 24 (Astro needs 22.23.4 or later). pnpm 9.12.0, pinned in `package.json`.

## Where things are

- `src/data/` holds all the copy: `site.ts` (contact details), `work.ts` (case studies), `experience.ts`,
  `stack.ts` (the stack graph). Edit text here, not in the components. A case-study section with no
  content is not rendered.
- `src/scripts/board/` is the departures board in the hero. `board.ts` holds its state, `flat-view.ts`
  draws it in HTML (first paint, and the fallback without WebGL), and `three-view.ts` draws it in
  three.js once the page is idle. The wall behind the 3D board shows the source of `board.ts`.
- `public/assets/resume.pdf` is the CV linked from the site. `public/og.png` is the link preview image.

## Deploy

Every push to `main` builds and deploys through `.github/workflows/deploy.yml`. Pull requests only build.
