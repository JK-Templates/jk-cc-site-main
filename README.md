# JonyKashi.CC 
## Main Web Site
### Insipration
#### Bs44

## CI/CD

Automated checks and deployments keep this portfolio copy in sync with the live main site:

- **Pull requests and pushes to `main`/`development`**: run linting, type checks, and production builds to ensure content parity and prevent regressions.
- **Pushes to `main`**: build and publish the static bundle to GitHub Pages so the repository always serves the latest version of the site content.

> The workflow lives at `.github/workflows/ci-cd.yml` and requires GitHub Pages to be enabled in the repository settings. No additional secrets are needed because the deployment uses the built-in `GITHUB_TOKEN`.
