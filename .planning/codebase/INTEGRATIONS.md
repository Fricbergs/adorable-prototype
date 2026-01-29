# External Integrations

**Analysis Date:** 2026-01-29

## APIs & External Services

**No External APIs Detected:**
- No HTTP client packages (fetch/axios) used in application code
- No calls to external services (Stripe, Supabase, Firebase, etc.)
- All functionality is self-contained client-side

**Customer Routes:**
- `GET /review/:id` - CustomerReviewView (local data only)
- `GET /fill/:id` - CustomerFillView (local data only)
- Routes exist for future customer survey filling but no API integration

## Data Storage

**Database:**
- No external database (prototype stage)
- localStorage used exclusively for data persistence
- Client-side only, no sync mechanism to backend

**Local Storage Keys:**
- `adorable-leads` - Lead prospects, consultations, agreements, queue members
- `adorable-contracts` - Contract records with status, resident assignments, signatures
- `adorable-residents` - Resident demographics, contact info, care level
- `adorable-diagnoses` - Medical diagnoses with ICD/SSK codes, dates
- `adorable-vitals-log` - Blood pressure, temperature, weight, BMI records
- `adorable-vaccinations` - Vaccination records with dates and notes
- `adorable-assessments-doctor` - Doctor examination forms
- `adorable-assessments-nurse` - Nurse assessment data
- `adorable-assessments-psych` - Psychiatrist evaluation forms
- `adorable-assessments-physio` - Physiotherapy assessment data
- `adorable-risk-morse` - Morse fall risk scale scores
- `adorable-risk-braden` - Braden pressure ulcer risk scale
- `adorable-risk-barthel` - Barthel activities of daily living index
- `adorable-technical-aids` - Mobility aids and equipment assignments
- `adorable-inventory-bulk` - Bulk inventory items (supplies, medications, equipment)
- `adorable-inventory-resident` - Per-resident inventory allocations
- `adorable-inventory-transfers` - Inventory movement history
- `adorable-inventory-receipts` - Inventory receipt logs
- `adorable-inventory-dispense-log` - Medication/supply dispensing records
- `adorable-rooms` - Room definitions by floor (floors 1-3, rooms 01-05)
- `adorable-beds` - Bed occupancy status (red=occupied, yellow=reserved, green=free)
- `adorable-occupancy-log` - Move-in/move-out history
- `adorable-prescriptions` - Medication prescriptions with dosing schedules
- `adorable-administration-logs` - Dose administration records (given/skipped/adjusted)
- `adorable-group-activities` - Group activities and participant registrations
- `adorable-products` - Care level product catalog (v2 schema with care levels 1-4)
- `adorable-demo-data-version` - Demo data version tracking (v6)

**Storage Notes:**
- All keys prefixed with `adorable-` for namespace isolation
- Products use version tracking (`adorable-products-version`) for schema migrations
- Demo data increments version to trigger refresh on structural changes
- No encryption; data stored as plain JSON
- Total storage: ~50KB+ depending on resident/prescription count

**File Storage:**
- No external file storage (S3, etc.)
- Local filesystem only (not accessible within SPA)
- Contract printing uses browser's print dialog

**Caching:**
- None detected (no service worker, no IndexedDB)
- All data held in memory and localStorage

## Authentication & Identity

**Auth Provider:**
- Custom/None - No authentication system implemented
- Prototype assumes single-user admin environment
- No login required; all routes publicly accessible
- Customer routes `/review/:id` and `/fill/:id` accessible by lead ID only (no token validation)

**Access Control:**
- None implemented
- Prototype stage - assumes trusted environment

## Monitoring & Observability

**Error Tracking:**
- None detected
- localStorage read/write errors logged to console only

**Logs:**
- Console.error/console.log used throughout for debugging
- Administration logs stored in `adorable-administration-logs` (prescription dose records)
- Occupancy changes logged to `adorable-occupancy-log`
- Inventory changes logged to transfer and dispense logs
- No centralized logging service

**Performance Monitoring:**
- None detected

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (via gh-pages package)
- Static site deployment at `https://[user].github.io/adorable-prototype/`
- Base path: `/adorable-prototype/`

**CI Pipeline:**
- None configured in codebase
- Manual deploy via `npm run deploy` command
- No GitHub Actions workflows found

**Deployment Process:**
1. `npm run build` → Vite bundles to `dist/`
2. `npm run deploy` → gh-pages publishes `dist/` to gh-pages branch
3. Static files served from GitHub Pages

## Environment Configuration

**Required env vars:**
- None detected
- All configuration hardcoded or in version control

**Secrets location:**
- No secrets required
- No .env files used
- All data client-side, no API keys needed

**Configuration Files:**
- `src/constants/` - Business logic constants (care levels, departments, reasons, units)
- `src/domain/` - Helper functions for validation, calculations, data initialization
- `vite.config.js` - Base path configuration
- `tailwind.config.js` - Styling configuration

## Webhooks & Callbacks

**Incoming:**
- None implemented
- No webhook endpoints

**Outgoing:**
- None implemented
- No external service calls
- Customer survey/fill forms are local forms, no email submission

**Future Integrations** (commented in code):
- Email notification capability exists as placeholder
- Customer form submission workflow ready but no email backend
- Customer review/fill views exist but not wired to external service

## Data Exchange Format

**Serialization:**
- JSON via `JSON.stringify()` and `JSON.parse()`
- Used for localStorage serialization only

**Validation:**
- Custom validation functions in `src/domain/validation.js`
- Type validation in `src/domain/contracts.js` (product schema validation)
- No schema validation library (Zod, Joi, etc.)

## Third-Party Libraries (Non-Framework)

**Runtime:**
- lucide-react - Icon library only, no data exchange
- react-router-dom - Routing only, no external calls

**Build/Dev:**
- @vitejs/plugin-react - Vite integration
- PostCSS/autoprefixer - CSS processing
- Tailwind CSS - Styling
- Vitest/UI - Testing

**Deployment:**
- gh-pages - GitHub Pages publisher

---

*Integration audit: 2026-01-29*
