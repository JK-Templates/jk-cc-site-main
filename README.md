# JonyKashi.CC 
## Main Web Site
### Insipration
#### Bs44

## Google Drive-backed content

Home page hero copy, imagery, and category cards now read from published Google Drive assets. Configure the embed links through environment variables (use `.env.local` for local development) or by editing `src/config/driveContent.js`:

- `VITE_DRIVE_HERO_IMAGE_EMBED_URL` – published-to-web image (use "Copy image address" from Drive > Publish to the web) for the hero circle.
- `VITE_DRIVE_HERO_DOC_EMBED_URL` – published document embed showing the hero blurb.
- `VITE_DRIVE_HERO_TITLE`, `VITE_DRIVE_HERO_SUBTITLE`, `VITE_DRIVE_HERO_CTA_PRIMARY`, `VITE_DRIVE_HERO_CTA_SECONDARY` – optional overrides for hero copy and buttons.
- `VITE_DRIVE_CATEGORIES_FEED_URL` – a JSON feed from a Drive-backed source (e.g., Google Sheets published as JSON) that returns an array of category objects with `title`, `description`, `image`, and `link` keys.

### Updating content (no code changes required)
1. Open the Drive document/image/Sheet that owns the content, choose **File → Share → Publish to web**, and copy the embed link (for Sheets, publish as web page).
2. Paste the embed link into the appropriate env variable above and redeploy (or update your hosting env vars). The site automatically converts common share links to embeddable URLs and shows loading/fallback states if Drive is unavailable.
3. For category data managed in Sheets, publish the sheet with headers matching the JSON keys (`title`, `description`, `image`, `link`, `icon`), then expose it via a JSON feed URL and set `VITE_DRIVE_CATEGORIES_FEED_URL` to that endpoint.

Fallback content remains defined in `src/config/driveContent.js` so the page renders even before Drive assets are wired up.
