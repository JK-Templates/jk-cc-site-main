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
# JonyKashi.CC - Personal Portfolio & Creative Showcase

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

> A modern, feature-rich personal portfolio website built with React, Vite, and Base44 SDK, showcasing professional work, AI experiments, blog content, and interactive features.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Testing & Linting](#-testing--linting)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Security & Maintenance](#-security--maintenance)
- [Appendix](#-appendix)

---

## 🎯 Project Overview

### Purpose

JonyKashi.CC is a comprehensive personal portfolio and creative showcase website designed to:

- **Display Professional Work**: Showcase portfolio projects, coding samples, and professional achievements
- **Share Knowledge**: Publish blog posts, AI prompts, and technical insights
- **Provide Interactivity**: Offer engaging user experiences with modern web technologies
- **Enable Contact**: Facilitate professional networking and collaboration opportunities
- **Demonstrate Skills**: Highlight expertise in full-stack development, AI integration, and modern web architecture

### Target Users

- **Potential Clients**: Looking for web development and AI integration services
- **Recruiters/Employers**: Evaluating technical skills and project portfolio
- **Peers/Developers**: Seeking inspiration, code examples, or collaboration
- **Content Consumers**: Interested in AI, web development, and technical content

### High-Level Goals

1. **Professional Presence**: Establish a strong online presence with a modern, performant website
2. **Content Management**: Provide flexible content creation and management capabilities
3. **User Engagement**: Deliver rich, interactive experiences with smooth animations and transitions
4. **Technical Excellence**: Demonstrate best practices in modern web development
5. **Scalability**: Build on a robust foundation that can grow with evolving needs

---

## 🛠 Tech Stack

### Core Technologies

- **React 18.2** - UI library for building component-based interfaces
- **Vite 6.1** - Next-generation frontend build tool for fast development
- **Tailwind CSS 3.4** - Utility-first CSS framework for rapid styling
- **React Router DOM 6.26** - Client-side routing and navigation

### Key Dependencies & Integrations

#### Base44 Platform
- **@base44/sdk (^0.8.3)** - Backend integration and data management
- **@base44/vite-plugin (^0.2.9)** - Vite plugin for Base44 integration

#### State Management & Data Fetching
- **Zustand 4.5** - Lightweight state management
- **@tanstack/react-query 5.84** - Powerful data fetching and caching

#### UI Component Libraries
- **Radix UI** - Comprehensive suite of accessible, unstyled UI primitives
  - Dialogs, Dropdowns, Popovers, Tooltips, Accordions, Tabs, and more
- **Lucide React 0.475** - Modern icon library
- **Framer Motion 11.16** - Animation library for smooth transitions
- **cmdk 1.0** - Command palette interface

#### Rich Content & Media
- **React Quill 2.0** - WYSIWYG rich text editor
- **React Markdown 9.0** - Markdown rendering
- **html2canvas 1.4** - Screenshot and image generation
- **jsPDF 2.5** - PDF document generation
- **canvas-confetti 1.9** - Celebration animations

#### Data Visualization & Interaction
- **Recharts 2.15** - Composable charting library
- **React Leaflet 4.2** - Interactive map components
- **@hello-pangea/dnd 17.0** - Drag-and-drop functionality
- **Three.js 0.171** - 3D graphics and animations

#### Forms & Validation
- **React Hook Form 7.54** - Performant form management
- **@hookform/resolvers 4.1** - Schema validation resolvers
- **Zod 3.24** - TypeScript-first schema validation

#### Authentication & Payments
- **@react-oauth/google 0.12** - Google OAuth integration
- **@stripe/react-stripe-js 3.0** - Stripe payment processing
- **@stripe/stripe-js 5.2** - Stripe.js library
- **jwt-decode 4.0** - JWT token parsing

#### Additional Utilities
- **date-fns 3.6** - Date manipulation and formatting
- **lodash 4.17** - Utility functions
- **react-hot-toast 2.6** - Toast notifications
- **sonner 2.0** - Toast notification system
- **next-themes 0.4** - Theme management (dark/light mode)
- **react-error-boundary 4.0** - Error boundary components

### Development Tools

- **TypeScript 5.8** - Type checking and enhanced IDE support
- **ESLint 9.19** - Code linting and quality enforcement
- **Autoprefixer 10.4** - CSS vendor prefix management
- **PostCSS 8.5** - CSS transformations

---

## ✨ Features

### Core Functionality

#### 1. **Portfolio Showcase**
- Display projects with rich media (images, videos, demos)
- Categorized project listings
- Interactive project detail views

#### 2. **Blog & Content Management**
- Markdown-based blog posts
- Rich text editing with React Quill
- Content categorization and tagging
- Code syntax highlighting

#### 3. **AI Integration**
- AI prompt library and showcase
- AI-generated video gallery
- Interactive AI experiments
- Base44 SDK integration for AI capabilities

#### 4. **Interactive Features**
- Drag-and-drop interface components
- Interactive charts and data visualizations
- Map-based location features
- 3D graphics and animations

#### 5. **User Authentication**
- Google OAuth login
- JWT-based session management
- Protected routes and content

#### 6. **Payment Processing**
- Stripe integration for payments
- Subscription management
- Transaction handling

#### 7. **Export & Generation**
- PDF generation from content
- Screenshot capture (html2canvas)
- Content export functionality

#### 8. **Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

#### 9. **Performance Optimizations**
- Code splitting and lazy loading
- Optimized asset delivery
- React Query caching
- Fast refresh in development

#### 10. **Accessibility**
- ARIA-compliant components (Radix UI)
- Keyboard navigation support
- Screen reader friendly

### Page Structure

Based on `src/pages.config.js`, the site includes:

- **Home** - Landing page with overview and highlights
- **Portfolio** - Project showcase and case studies
- **Codex** - Technical documentation or knowledge base
- **AIPrompts** - Collection of AI prompts and experiments
- **AIVideos** - AI-generated video gallery
- **Blog** - Blog post listings
- **BlogPost** - Individual blog post view
- **Contact** - Contact form and information
- **Base44** - Base44 platform integration showcase

---

## 📦 Prerequisites

### System Requirements

- **Node.js**: Version 18.x or higher (20.x recommended)
  - Check version: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)

- **npm**: Version 9.x or higher (comes with Node.js)
  - Check version: `npm --version`

- **Git**: For version control
  - Check version: `git --version`
  - Download: [git-scm.com](https://git-scm.com/)

### Recommended Tools

- **VS Code** - IDE with excellent React/JavaScript support
- **Chrome/Firefox DevTools** - For debugging
- **Postman** or **Insomnia** - For API testing (if needed)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JK-Templates/jk-cc-site-main.git
cd jk-cc-site-main
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`. The process may take a few minutes.

### 3. Configure Environment Variables

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables) section for details):

```bash
cp .env.example .env  # If example exists, or create new file
```

Edit `.env` with your configuration values.

### 4. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

---

## 🔐 Environment Variables

### Required Variables

Create a `.env` file in the root directory with the following variables:

```env
# Base44 SDK Configuration
VITE_BASE44_APP_ID=your_base44_app_id_here
VITE_BASE44_BACKEND_URL=https://api.base44.com

# Optional: Legacy SDK Import Support
BASE44_LEGACY_SDK_IMPORTS=false

# Google OAuth (if using authentication)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Stripe (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Additional Configuration (as needed)
VITE_API_BASE_URL=https://your-api-url.com
VITE_SITE_URL=https://jonykashi.cc
```

### Environment Variable Details

#### Base44 Configuration

- **VITE_BASE44_APP_ID**: Your Base44 application identifier
  - Obtain from: [Base44 Dashboard](https://base44.com)
  - Used in: `src/lib/app-params.js`

- **VITE_BASE44_BACKEND_URL**: Base44 backend API URL
  - Default: `https://api.base44.com`
  - Can be customized for different environments

- **BASE44_LEGACY_SDK_IMPORTS**: Support for legacy import paths
  - Set to `true` only if using old `@/integrations` imports
  - Default: `false` (use new SDK imports from `@base44/sdk`)

#### Google OAuth Configuration

- **VITE_GOOGLE_CLIENT_ID**: Google OAuth 2.0 client ID
  - Obtain from: [Google Cloud Console](https://console.cloud.google.com/)
  - Required for: Google authentication features
  - Setup: Enable Google OAuth API and create OAuth credentials

#### Stripe Configuration

- **VITE_STRIPE_PUBLISHABLE_KEY**: Stripe publishable key (starts with `pk_`)
  - Obtain from: [Stripe Dashboard](https://dashboard.stripe.com/)
  - Required for: Payment processing features
  - Note: Use test keys (`pk_test_`) for development

### Security Notes

⚠️ **Important**: 
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly
- Keep secret keys on the server side only
- All `VITE_*` prefixed variables are exposed in the client bundle

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR).
- Default port: `5173`
- Automatic browser refresh on file changes
- Fast refresh for React components

### Build

```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Optimizes assets
- Generates source maps

### Preview

```bash
npm run preview
```
Locally preview the production build before deployment.
- Serves files from `dist/` directory
- Useful for testing production-like environment

### Linting

```bash
npm run lint
```
Runs ESLint to check code quality (quiet mode - only shows errors).

```bash
npm run lint:fix
```
Automatically fixes ESLint issues where possible.

### Type Checking

```bash
npm run typecheck
```
Runs TypeScript compiler to check for type errors without emitting files.
- Uses `jsconfig.json` for configuration
- Validates JavaScript files with JSDoc types

---

## 🏗 Architecture

### Project Structure

```
jk-cc-site-main/
├── .github/              # GitHub Actions workflows (CI/CD)
├── functions/            # Serverless functions (if applicable)
├── public/               # Static assets
├── src/
│   ├── api/              # API integration layer
│   ├── assets/           # Images, fonts, media files
│   ├── components/       # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   ├── ui/           # UI primitives (shadcn/ui style)
│   │   ├── SeoHead.jsx   # SEO meta tags component
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and helpers
│   │   └── app-params.js # App configuration and parameters
│   ├── pages/            # Page components (route views)
│   │   ├── Home.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Blog.jsx
│   │   └── ...
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Root application component
│   ├── App.css           # Global application styles
│   ├── Layout.jsx        # Main layout wrapper
│   ├── main.jsx          # Application entry point
│   ├── index.css         # Global CSS and Tailwind imports
│   └── pages.config.js   # Page routing configuration
├── .gitignore            # Git ignore rules
├── components.json       # shadcn/ui configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── jsconfig.json         # JavaScript/TypeScript config
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite build configuration
└── README.md             # This file
```

### Routing

The application uses a custom routing system defined in `src/pages.config.js`:

```javascript
import { PAGES, pagesConfig } from './src/pages.config.js';

// Configure pages
export const pagesConfig = {
    mainPage: "Home",      // Default landing page
    Pages: PAGES,          // Page component mapping
    Layout: __Layout,      // Wrapper layout component
};
```

Pages are integrated with React Router DOM for client-side navigation.

### State Management

#### Local State
- **React Hooks** (`useState`, `useEffect`, etc.) for component-level state
- **React Context** for theme, auth, and shared UI state

#### Global State
- **Zustand** - Lightweight state management for application-wide state
  - User authentication state
  - UI preferences
  - Cross-component data

#### Server State
- **TanStack Query** - Data fetching, caching, and synchronization
  - API request management
  - Automatic refetching
  - Optimistic updates
  - Cache invalidation

### Data Flow

1. **Component Rendering**: React components render UI based on props and state
2. **User Interactions**: Events trigger state updates or API calls
3. **State Updates**: Zustand stores or React Query cache updates
4. **Re-rendering**: Components automatically re-render with new data
5. **API Integration**: Base44 SDK handles backend communication

### Component Architecture

#### UI Components (`src/components/ui/`)
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Accessible by default
- Reusable across pages

#### Page Components (`src/pages/`)
- Container components for routes
- Compose UI components
- Handle page-specific logic
- Implement SEO metadata

#### Layout Component (`src/Layout.jsx`)
- Wraps all pages
- Provides navigation
- Handles global state
- Manages theme switching

### API Integration

#### Base44 SDK
```javascript
import { base44 } from '@base44/sdk';

// Configuration loaded from app-params
const params = getAppParams();
```

#### API Layer (`src/api/`)
- Abstracts API calls
- Handles authentication tokens
- Manages error handling
- Provides typed responses

---

## 🌐 Deployment

### Recommended Platforms

#### Vercel (Recommended)

**Pros**: Zero-config, automatic deployments, edge network, preview deployments

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to your project settings in Vercel dashboard
   - Add all `VITE_*` environment variables
   - Redeploy after adding variables

**Vercel Configuration** (optional `vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

#### Netlify

**Pros**: Simple setup, form handling, serverless functions support

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add in Netlify dashboard

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

**Pros**: Free hosting, integrated with repository

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add scripts to `package.json`**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update `vite.config.js`** (if using subdirectory):
   ```javascript
   export default defineConfig({
     base: '/jk-cc-site-main/',
     // ... rest of config
   });
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Repository Settings → Pages
   - Source: gh-pages branch

### Build Configuration

#### Environment-Specific Builds

**Production**:
```bash
NODE_ENV=production npm run build
```

**Staging**:
```bash
NODE_ENV=staging npm run build
```

#### Build Optimization

Vite automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Generates source maps
- Tree-shakes unused code
- Code splits by route

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test critical user flows
- [ ] Check responsive design on multiple devices
- [ ] Verify SEO meta tags
- [ ] Test authentication (if applicable)
- [ ] Verify payment integration (if applicable)
- [ ] Check console for errors
- [ ] Validate performance (Lighthouse score)
- [ ] Test all external links
- [ ] Verify analytics integration (if applicable)

### CI/CD

Automated checks and deployments keep this portfolio in sync:

- **Pull requests and pushes to `main`/`development`**: 
  - Run linting (`npm run lint`)
  - Run type checks (`npm run typecheck`)
  - Build production bundle (`npm run build`)
  - Ensure content parity and prevent regressions

- **Pushes to `main`**: 
  - Build and publish static bundle to deployment platform
  - Automatic deployment to production

> The workflow lives at `.github/workflows/ci-cd.yml` and requires appropriate secrets and deployment platform configuration.

---

## 🧪 Testing & Linting

### Linting

#### ESLint

Run code quality checks:
```bash
npm run lint        # Check for errors
npm run lint:fix    # Auto-fix issues
```

**Configuration**: `eslint.config.js`

**Plugins**:
- `eslint-plugin-react` - React-specific linting rules
- `eslint-plugin-react-hooks` - Hooks rules enforcement
- `eslint-plugin-react-refresh` - Fast refresh validation
- `eslint-plugin-unused-imports` - Detect unused imports

**Recommended VSCode Extension**:
```json
{
  "recommendations": ["dbaeumer.vscode-eslint"]
}
```

### Type Checking

```bash
npm run typecheck
```

Validates JavaScript with JSDoc types and TypeScript files.

**Configuration**: `jsconfig.json`

### Testing (To Be Implemented)

Currently, no testing framework is configured. **Recommended additions**:

#### Vitest (Recommended for Vite projects)

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/user-event
```

#### Example Test Structure

```
src/
├── components/
│   ├── Button.jsx
│   └── __tests__/
│       └── Button.test.jsx
```

### Code Formatting

#### Prettier (Recommended)

Install Prettier for consistent code formatting:

```bash
npm install --save-dev prettier
```

**Create `.prettierrc`**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**Add scripts**:
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,md}\""
  }
}
```

### Git Hooks with Husky

Automate linting and formatting before commits:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**Create `.husky/pre-commit`**:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Add to `package.json`**:
```json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Dependency Installation Failures**

**Problem**: `npm install` fails with errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer dependencies flag
npm install --legacy-peer-deps
```

#### 2. **Node Version Mismatch**

**Problem**: "Unsupported Node.js version" errors

**Solution**: Use Node.js 18.x or higher
```bash
# Check current version
node --version

# Using nvm (Node Version Manager)
nvm install 20
nvm use 20
```

#### 3. **esbuild Binary Issues**

**Problem**: "esbuild" or "esbuild-darwin-64" not found

**Solutions**:
```bash
# Reinstall esbuild
npm install esbuild --force

# Or rebuild native dependencies
npm rebuild esbuild

# If using Apple Silicon Mac
npm install --platform=darwin --arch=arm64 esbuild
```

#### 4. **Fast Refresh Not Working**

**Problem**: Changes don't reflect immediately in dev mode

**Solutions**:
- Ensure components follow React Fast Refresh rules:
  - Component names must start with uppercase
  - Use named exports for components
  - Don't export non-component functions from component files

```javascript
// ✅ Good
export function MyComponent() { }

// ❌ Bad - lowercase
export function myComponent() { }
```

#### 5. **Environment Variables Not Loading**

**Problem**: `import.meta.env.VITE_*` returns undefined

**Solutions**:
- Ensure `.env` file is in project root
- Variable names must start with `VITE_`
- Restart dev server after changing `.env`
- Check for syntax errors in `.env` file

```bash
# Restart dev server
# Ctrl+C to stop
npm run dev
```

#### 6. **Build Failures**

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear cache and rebuild
rm -rf dist .vite
npm run build

# Check for TypeScript/linting errors first
npm run typecheck
npm run lint
```

#### 7. **Port Already in Use**

**Problem**: "Port 5173 is already in use"

**Solutions**:
```bash
# Kill process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Or specify different port
npm run dev -- --port 3000
```

#### 8. **Memory Issues (Large Builds)**

**Problem**: "JavaScript heap out of memory"

**Solution**:
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 9. **CI/CD Pipeline Failures**

**Problem**: GitHub Actions workflow fails

**Common causes**:
- Missing environment variables in GitHub Secrets
- Node version mismatch in workflow
- Dependency installation timeout

**Solutions**:
- Check workflow logs in GitHub Actions tab
- Verify secrets are configured in repository settings
- Update Node version in `.github/workflows/*.yml`

#### 10. **Stripe/OAuth Integration Issues**

**Problem**: Authentication or payment features not working

**Solutions**:
- Verify API keys are correct (check for trailing spaces)
- Ensure correct environment (test vs production keys)
- Check browser console for CORS or network errors
- Verify redirect URLs are whitelisted in provider dashboards

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Review Vite and React documentation
3. Search GitHub issues in this repository
4. Contact the maintainer (see [Appendix](#-appendix))

---

## 🤝 Contributing

### How to Contribute

We welcome contributions! Please follow these guidelines:

#### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/jk-cc-site-main.git
cd jk-cc-site-main
npm install
```

#### 2. Create a Feature Branch

**Branch Naming Convention**:
```bash
git checkout -b feature/your-feature-name
git checkout -b fix/bug-description
git checkout -b docs/documentation-update
```

Examples:
- `feature/add-blog-comments`
- `fix/navigation-mobile-menu`
- `docs/update-setup-instructions`

#### 3. Make Your Changes

- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

#### 4. Commit Your Changes

**Commit Message Convention** (Conventional Commits):

```bash
git commit -m "feat: add blog comment functionality"
git commit -m "fix: resolve mobile navigation issue"
git commit -m "docs: update installation instructions"
git commit -m "style: format code with prettier"
git commit -m "refactor: simplify authentication logic"
git commit -m "test: add tests for contact form"
git commit -m "chore: update dependencies"
```

**Format**: `<type>: <description>`

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style/formatting (no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

#### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Screenshots (for UI changes)
- Testing notes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] No console errors or warnings
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are tested in browser
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow convention
- [ ] PR description is clear and complete
- [ ] Screenshots included (for UI changes)
- [ ] No sensitive data (keys, tokens) in code

### Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

### Development Best Practices

- **Keep PRs focused**: One feature or fix per PR
- **Write descriptive commits**: Future maintainers will thank you
- **Test thoroughly**: On different browsers and screen sizes
- **Ask questions**: If unsure, ask before implementing
- **Be patient**: Reviews may take time

---

## 🔒 Security & Maintenance

### Dependency Management

#### Updating Dependencies

**Check for outdated packages**:
```bash
npm outdated
```

**Update specific package**:
```bash
npm update package-name
```

**Update all packages** (with caution):
```bash
npm update
```

**Major version updates**:
```bash
npm install package-name@latest
```

#### Security Audits

**Run security audit**:
```bash
npm audit
```

**Fix vulnerabilities automatically**:
```bash
npm audit fix
```

**Fix with breaking changes** (review carefully):
```bash
npm audit fix --force
```

#### Lockfile Management

- **Always commit `package-lock.json`**
- Do not manually edit lockfile
- Regenerate if corrupted:
  ```bash
  rm package-lock.json
  npm install
  ```

### Secret Handling

#### Best Practices

1. **Never commit secrets** to version control
   - API keys
   - Passwords
   - Private keys
   - Access tokens

2. **Use environment variables** for sensitive data
   - Store in `.env` (gitignored)
   - Use different values for dev/production

3. **Rotate keys regularly**
   - Change API keys periodically
   - Update in all environments

4. **Use secret management services** in production
   - Vercel/Netlify environment variables
   - AWS Secrets Manager
   - HashiCorp Vault

#### If a Secret is Exposed

1. **Immediately revoke** the exposed key/token
2. **Generate a new secret**
3. **Update all environments**
4. **Review git history** and remove if committed
5. **Consider** using tools like `git-filter-repo` to rewrite history

### Maintenance Schedule

#### Weekly
- Check for security vulnerabilities (`npm audit`)
- Review and address critical issues

#### Monthly
- Update patch versions of dependencies
- Review and merge Dependabot PRs
- Test updated dependencies thoroughly

#### Quarterly
- Update minor versions of major dependencies
- Review and update documentation
- Performance audit (Lighthouse)
- Accessibility audit

#### Annually
- Major dependency updates
- Architecture review
- Security penetration testing (if applicable)

### Monitoring

Consider implementing:
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance monitoring**: Vercel Analytics, New Relic
- **Uptime monitoring**: UptimeRobot, Pingdom

---

## 📚 Appendix

### Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check linting (errors only)
npm run lint:fix         # Fix linting issues
npm run typecheck        # Check types

# Dependency Management
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check for outdated packages
npm audit                # Security audit
npm audit fix            # Fix vulnerabilities

# Git Operations
git status               # Check status
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to remote
git pull                 # Pull from remote

# Cleanup
rm -rf node_modules      # Remove dependencies
rm -rf dist              # Remove build output
npm cache clean --force  # Clear npm cache
```

### Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `eslint.config.js` | Linting rules |
| `jsconfig.json` | JavaScript/TypeScript settings |
| `src/main.jsx` | Application entry point |
| `src/App.jsx` | Root component |
| `src/pages.config.js` | Page routing configuration |
| `.env` | Environment variables (gitignored) |
| `.gitignore` | Git ignore rules |

### Recommended VSCode Extensions

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "yoavbls.pretty-ts-errors"
  ]
}
```

### External Resources

- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **React Router**: https://reactrouter.com/
- **TanStack Query**: https://tanstack.com/query/
- **Zustand**: https://github.com/pmndrs/zustand
- **Base44**: https://base44.com/
- **Radix UI**: https://www.radix-ui.com/

### Contact & Support

- **Website**: https://jonykashi.cc
- **Repository**: https://github.com/JK-Templates/jk-cc-site-main
- **Issues**: https://github.com/JK-Templates/jk-cc-site-main/issues

For questions or support, please open an issue on GitHub.

### License

This is a private repository. All rights reserved.

**Copyright © 2024 JonyKashi.CC**

---

<div align="center">

**Built with ❤️ using React, Vite, and Base44**

*Last updated: December 2024*

</div>
