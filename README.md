# JonyKashi.CC

This repository hosts the shared codebase for both production (`www.jonykashi.cc`) and test (`test.jonykashi.cc`) deployments. All environments should track the same content branch (`development`), with runtime configuration used to change the visual experience.

## Site modes (LSD vs. normal)

Use the `VITE_SITE_MODE` flag to choose the visual theme at runtime:

- `lsd`: Enables the lucid-dream experience with animated particles and psychedelic gradients.
- `normal`: Uses the grounded palette and disables the LSD-only background treatments.

The current mode is read from the environment at startup and can be flipped in-app (desktop and mobile menus expose a small toggle, stored in `localStorage` for local testing). The resolved mode is available in `src/config/siteMode.js` and consumed by `src/Layout.jsx`.

### Domain defaults

- `www.jonykashi.cc`: `VITE_SITE_MODE=normal`
- `test.jonykashi.cc`: `VITE_SITE_MODE=lsd`

Both deployments should build from the shared `development` branch; only the environment variable changes between them.

## Local and CI validation

1. Set the desired mode before building:
   ```bash
   export VITE_SITE_MODE=lsd   # or normal
   npm run build
   ```
2. Repeat the build for the alternate mode to validate both experiences locally and in CI before promoting to `main`.

## Inspiration

- Bs44
