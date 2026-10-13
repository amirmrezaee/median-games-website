# Website design decisions

Date: 2026-10-13

## Approved scope
- Simple game-studio promotional website with game information and links.
- Persian and English with a visible language toggle; Persian RTL, English LTR.
- Target hosting: GitHub Pages, static files without a backend.

## Approved visual direction
- User rejected the dark concept as gloomy and approved the second bright daytime concept with “همین خوبه شروع کن”.
- Warm cream background, dark readable text, coral primary action, mint and yellow accents, colorful daytime game art.
- Desktop hero with copy and illustration; responsive stacked mobile layout; three game cards and a compact studio introduction/footer.
- Concept reference: `C:/Users/Amir/.codex/generated_images/01a135d8-400e-7c82-959b-8ef531547c6f/exec-4414cc47-1210-4bad-b933-2e998304f614.png`.

## Implementation choices and content status
- Buildless HTML/CSS/JavaScript; a small packaging script outputs only public website files into `dist/`.
- Shared CSS variables provide spacing and palette; locally bundled Vazirmatn font supports Persian and English.
- Game names, artwork and descriptions are explicitly illustrative placeholders until the user supplies real game content. No fabricated download/store/social/contact links.
- Game buttons open accessible detail dialogs. Real HTTPS links can be configured in `games.js`.
- Language preference is remembered locally, and shareable language selection uses `?lang=fa` or `?lang=en`.
- Source directory was empty and was not a Git repository at task start. No GitHub repository or remote was supplied; publication requires a real repository destination.

## GitHub publication — 2026-10-13
- User supplied the GitHub account `amirmrezaee` and explicitly asked the agent to create the repository.
- Created the public repository `amirmrezaee/median-games-website`; authenticated account matched the requested owner.
- GitHub Pages configured with the GitHub Actions build type; source branch `main`.
- Website URL: https://amirmrezaee.github.io/median-games-website/
- Repository URL: https://github.com/amirmrezaee/median-games-website
- The public deployment contains only the website files and assets; project documentation and screenshots are excluded by the build script.
- After the first live browser check passed, artwork was compressed to WebP to reduce transfer size by about 92% while retaining the approved composition. Original generated PNGs are preserved outside the public output and in Git history.

## Motion upgrade — 2026-10-13
- User supplied `median-motion-upgrade.patch` and explicitly requested applying and publishing it.
- Applied the patch once on the local `main`; it was not already present in this checkout.
- Motion layer adds staged entrance, hero parallax, scroll reveal, desktop card tilt, confetti, sticky navigation and dialog/language transitions.
- Visitors requesting reduced motion retain visible content without the motion layer. Persian/English and the approved bright visual direction remain in place.
