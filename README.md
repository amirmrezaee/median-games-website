# Median Games website

A cheerful bilingual static studio website for GitHub Pages. Persian is the default; English is available through the language toggle or `?lang=en`.

## Preview

From this directory run `python -m http.server 4173`, then open `http://localhost:4173`.

## Game content

Edit `games.js` to replace the three illustrative entries. Each entry supports a localized title, summary, description, status, image and links. Add real links as `{ label: { fa: 'دانلود', en: 'Download' }, url: 'https://your-real-store-url' }`. Empty link arrays show the preview notice. Remove or update the localized `previewNotice` in `app.js` once actual games replace the placeholders.

Images and fonts are local, so visitors do not depend on external asset hosts. Generated artwork is illustrative, not footage from actual games.

## GitHub Pages

Repository: https://github.com/amirmrezaee/median-games-website

Site: https://amirmrezaee.github.io/median-games-website/

1. Put these source files in the intended GitHub repository on `main`.
2. In repository Settings → Pages, set the source to **GitHub Actions**.
3. The included `.github/workflows/pages.yml` builds and deploys `dist/` on pushes to `main`, or from a manual workflow run.

Run `node scripts/build.mjs` for a local publication build. Only the public site files are copied to `dist/`; internal documentation and screenshots are excluded. All asset paths are relative, including for project URLs such as `username.github.io/repository/`.

The public repository and GitHub Pages workflow are configured. Pushing to `main` publishes the public files in `dist/` automatically.
