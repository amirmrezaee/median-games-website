# Shared studio catalogue v1 — 2026-10-15

Canonical authoring source: `data/studio.v1.json`. Public endpoint:
https://amirmrezaee.github.io/median-games-website/data/studio.v1.json

Website, Unity applications and the future `/links/` page consume the same document.
`games.js` is a generated compatibility adapter, not another editable catalogue.
Run `node scripts/build.mjs` after edits (also runs on publication), then
`node scripts/verify-catalog.mjs`. The build rejects invalid/duplicate IDs, dates and URLs.

## Contract

- `schemaVersion: 1`; breaking changes require a new versioned URL. Consumers ignore extra fields.
- `updatedAt`: UTC `yyyy-MM-ddTHH:mm:ssZ`. Advance whenever data changes; clients reject older revisions.
- `company`: stable id, localized name/description, websiteUrl, logoUrl, optional wordmarkUrl, identityBoardUrl, socialLinks.
- Each social link: `id`, localized `label`, HTTPS `url`, optional HTTPS `iconUrl`, `enabled`, and booleans `website`, `apps`, `links`. Only enabled links for the relevant surface are displayed.
- Each game: stable id, exact `bundleIds` array (Android package/iOS bundle identifiers), localized title/summary/description, absolute HTTPS `image`, optional HTTPS `storeUrl`, enabled, releaseStatus, showOnWebsite/showInApps/showOnLinks.
- `releaseStatus`: `released`, `coming-soon`, `concept`. Apps and link hub only recommend released games with a store URL. Website may retain labeled concepts.
- `releasedAt`: first release, not latest update; `updatedAt`: latest known update. Unknown dates are empty, never inferred from Git activity. Fenjoon's first-release date is not verified, so remains empty; known listing update is preserved.
- `promotion`: enabled, integer priority, optional UTC startsAt/endsAt, website/apps/links booleans. Start inclusive; end exclusive. Promotion sorts first, then priority, then releasedAt descending (unknown last), then stable id. Disabled/expired promotion does not receive priority.
- Apps remove the current game by any exact bundle-id match. Unknown bundle id hides the rating action and still permits other released games.

## Branding and pending content

The user supplied `Arts/`. `assets/brand/median-games-logo.png` is a byte-for-byte copy of `Neon Interlocking M Emblem.png` (black background, not transparent).
`median-games-identity.png` preserves the supplied identity board, including logotype examples. It is a reference sheet, not an isolated wordmark; wordmarkUrl remains empty until an isolated production asset is available. Original Arts files are untouched and not automatically published.
No social account URLs were confirmed. `socialLinks` remains empty; names/handles drawn in a concept sheet are not account verification. The future link hub should omit an empty social group.

## Unity delivery

`com.mediangames.studiocatalog` lives in SharedPackages. Its included fallback is a generated snapshot of this document; source JSON remains canonical here. Refresh that snapshot when shipping a new package by copying the validated document to `Runtime/Resources/MedianGames/StudioCatalogFallback.json` (the shared repository supplies `Tools/StudioCatalogUnityVerification/Sync-Fallback.ps1`). Runtime caches validated fetches and preserves its last good catalogue on errors. No GitHub token/API is needed.

This delivery changes the website's data source and adds the service package. It does not build the future links page or a Unity About view. UI System receives a typed AboutPageData model; artwork rendering/theme/interaction remains its responsibility.

## Verification receipt — 2026-10-15
- Validated canonical JSON, generated browser adapter equality, current/unknown game filtering, concepts, promotion expiry/surface/order, duplicate ids and HTTPS rejection; packaged JSON equals source.
- Chromium checked Persian/English, persistent language, dialog/close, local asset/brand loading, empty social-group hiding and horizontal overflow at320/390/768/1024/1440.
- Current reduced-motion screenshots and source hashes: Screenshots/2026-10-15-catalog-v1. Reduced motion is used for stable complete captures; this is not a new animation implementation or Unity UI screenshot.
- The website keeps its existing approved bright theme. Only the About illustration now displays the user-supplied emblem.
