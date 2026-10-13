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
