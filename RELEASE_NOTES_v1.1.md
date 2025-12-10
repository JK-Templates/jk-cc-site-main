# Release v1.1 – Consolidated PRs (post-main rebase)

## Overview
After rebasing the branch onto the latest `main`, this release rolls up every merged PR to date into a single v1.1 package. The drop focuses on the psychedelic "dream" experience across loading, navigation, and page transitions, and documents the branching strategy that guided the work.

## Pull Request Rollup
- **PR #1 – Branch visibility & sync guidance**: Added the branch organization deep-dive, quick status summary, Hebrew-language sync guide, and the step-by-step synchronization plan to keep the workflow aligned with `main`. (Files: `BRANCH_ORGANIZATION.md`, `BRANCH_STATUS_SUMMARY.md`, `BRANCH_SYNC_HEBREW.md`, `SYNCHRONIZATION_PLAN.md`)
- **PR #2 – Experience + docs bundle**: Introduced the LSD-inspired layout experience (animated dream palette backgrounds, animated logo, and particle layers), a neon preloader, matrix-like site transition curtain, global animation presets, and placeholder feature documentation. (Key files: `src/Layout.jsx`, `src/components/ui/Preloader.jsx`, `src/components/ui/SiteTransition.jsx`, `src/components/ui/global-animations.css.jsx`, `FEATURE_1.md`, `FEATURE_2.md`, `TODO.md`)
- **PR #3 – Rebase consolidation**: Ensured the aggregated work sits on top of the refreshed `main` history so v1.1 contains every approved change without drift.

## Highlights
- **Immersive transitions**: New preloader and site-transition overlays pair with the dream-color navigation shell to deliver the LSD-mode experience across page loads and cross-site jumps.
- **Documentation pass**: Branch governance guides plus feature placeholders capture the scope of delivered work and set expectations for future syncs.
- **Versioning**: The app version increments to **1.1.0** to mark the consolidated release.
