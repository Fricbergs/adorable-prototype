# Technology Stack

**Analysis Date:** 2026-01-29

## Languages

**Primary:**
- JavaScript - All application code, build scripts, and configuration
- JSX - React component syntax in `src/` directory (18.3.1 compatible)

**Secondary:**
- CSS - Tailwind CSS utility classes (no custom CSS files, all styling via Tailwind)

## Runtime

**Environment:**
- Node.js (version managed via npm, no .nvmrc specified)
- Browser: Modern ES2020+ (Vite default transpilation)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.3.1 - UI component framework and state management via hooks
- React Router DOM 7.11.0 - Client-side routing with basename="/adorable-prototype"
- Vite 6.0.1 - Build tool, dev server, and production bundler

**UI & Styling:**
- Tailwind CSS 3.4.15 - Utility-first CSS framework, configured in `tailwind.config.js`
- Tailwind Autoprefixer 10.4.20 - Vendor prefix auto-injection via PostCSS
- Lucide React 0.454.0 - Icon library (Home, Users, Settings, Stethoscope, etc.)

**Testing:**
- Vitest 4.0.16 - Unit test runner (Node environment)
- @vitest/ui 4.0.16 - Test runner visualization
- Config: `vitest.config.js` (globals: true, includes `src/**/*.{test,spec}.{js,jsx}`)

**Build/Dev:**
- @vitejs/plugin-react 4.3.3 - React Fast Refresh plugin
- PostCSS 8.4.49 - CSS transformation pipeline
- gh-pages 6.3.0 - Deploy to GitHub Pages via `npm run deploy`

## Key Dependencies

**Critical:**
- react - Core rendering engine for all UI
- react-dom - React DOM API (18.3.1)
- react-router-dom - Enables multi-page routing (admin routes at / and customer routes at /review/:id, /fill/:id)
- lucide-react - Icon provider (used in Header.jsx, modals, components for visual indicators)

**Infrastructure:**
- Tailwind CSS - Complete styling foundation (no custom CSS files found)
- Vite - Module bundling and development server with ES2020+ target

## Configuration

**Environment:**
- Browser-only client (no server-side environment variables detected)
- No .env files required or found
- Data persistence via browser localStorage only
- Base path configured in vite.config.js: `base: '/adorable-prototype/'`

**Build:**
- `tailwind.config.js` - Content sources: `index.html`, `src/**/*.{js,ts,jsx,tsx}`
- `postcss.config.js` - Tailwind and autoprefixer plugins
- `vite.config.js` - React plugin, base path configuration
- `vitest.config.js` - Test globals enabled, Node environment

**Routing:**
- `src/main.jsx` - Entry point with BrowserRouter, basename="/adorable-prototype"
- Admin routes: `/` → App.jsx (main intake prototype)
- Customer routes: `/review/:id` → CustomerReviewView, `/fill/:id` → CustomerFillView

## Platform Requirements

**Development:**
- Node.js (npm required)
- Modern browser with ES2020 support
- 200+ demo residents generated on app load (CPU/memory consideration)

**Production:**
- Static hosting (GitHub Pages via gh-pages package, or any CDN)
- Base path: `/adorable-prototype/` must be preserved
- No backend server required (client-only SPA)
- Browser localStorage available (all data persisted client-side)

## Build Output

**Commands:**
- `npm run dev` - Development server on http://localhost:5173
- `npm run build` - Production build output to `dist/`
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm run test` - Run Vitest in watch mode
- `npm run test:ui` - Run Vitest with UI dashboard
- `npm run test:run` - Run Vitest once (CI mode)

**Output Target:**
- Development: In-memory serving via Vite
- Production: Static files in `dist/` directory (ready for any static host)
- Deployed to: GitHub Pages at `/adorable-prototype/` path

---

*Stack analysis: 2026-01-29*
