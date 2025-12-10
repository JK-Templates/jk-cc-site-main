# Release v1.1

## Overview
This release consolidates work from pull requests #1–#3 into a single deployable package for the dual-site setup. It bundles the LSD-inspired experience updates, navigation polish, and the branch-synchronization documentation so both domains can stay aligned while using their respective visual modes.

## Highlights
- Added the dreamlike navigation shell with animated logo, particle background, and dynamic color palettes to support the Matrix LSD mode while keeping normal navigation smooth for the main site.
- Introduced cinematic transitions and an upgraded preloader (`SiteTransition`, `Preloader`, and global animation styles) to create fluid cross-site handoffs and page changes.
- Documented branch organization, synchronization steps, and Hebrew quick-reference checklists to streamline future downstreaming across main and test deployments.
- Bumped the application version to **1.1.0** to mark the consolidated release for downstream deployment.

## Deployment Notes
- Use this release as the shared source for both `www.jonykashi.cc` (normal mode) and `test.jonykashi.cc` (Matrix LSD mode). Apply the visual mode toggle per environment while keeping content in sync.
- After deploying, update downstream branches to match this release tag to keep future PRs incremental and avoid drift between the two sites.
