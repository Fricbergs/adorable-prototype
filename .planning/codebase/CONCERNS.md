# Codebase Concerns

**Analysis Date:** 2026-01-29

## Tech Debt

**Hardcoded User Attribution:**
- Issue: User context is hardcoded throughout the codebase instead of retrieved from authentication
- Files: `src/views/GroupActivitiesView.jsx` (line 237), `src/domain/residentDataHelpers.js`, `src/domain/contracts.js`, `src/components/resident/DiagnosisModal.jsx`
- Impact: Cannot track who performed actions; assumes single hardcoded user (e.g., `createdBy: 'current-user'`, `createdBy: 'admin'`, `createdBy: 'Dakteris Gints'`)
- Fix approach: Implement authentication context (useAuth hook) to retrieve current user from session/token; pass user through all action-logging functions

**Unprotected localStorage Access (45+ instances):**
- Issue: Many localStorage operations lack try-catch protection; JSON.parse can fail silently in some paths
- Files: `src/domain/roomHelpers.js` (line 617 direct access), `src/domain/initializeDemoData.js`, `src/domain/inventoryHelpers.js`
- Impact: App crashes on corrupted localStorage data; no graceful fallback; data loss risk during JSON parse errors
- Fix approach: Wrap all localStorage access in try-catch; create central `src/domain/safeStorageHelpers.js` for all reads/writes; validate data schema before use

**Missing Input Validation:**
- Issue: User form inputs not validated before saving to localStorage (contract numbers, dates, quantities)
- Files: `src/views/ContractCreateView.jsx`, `src/views/GroupActivitiesView.jsx`, multiple modal components
- Impact: Invalid data stored (negative quantities, malformed dates, missing required fields); downstream calculations fail or produce incorrect results
- Fix approach: Create validation schema per entity; validate in form submission before save; show user-friendly error messages

**Pseudo-Unique ID Generation:**
- Issue: IDs generated with `Date.now() + Math.random()` are not guaranteed unique under concurrent operations
- Files: `src/views/GroupActivitiesView.jsx` (line 33), `src/domain/inventoryHelpers.js` (line 80+)
- Impact: Could create duplicate IDs in race conditions; no collision detection
- Fix approach: Use UUID library or implement centralized ID service; validate uniqueness before save

## Known Bugs

**TODO: Resident Termination Check:**
- Location: `src/domain/roomHelpers.js` (line 607)
- Description: Bed availability check does not verify if resident has termination date before target date
- Symptoms: System may show bed as unavailable when resident is actually being discharged before the target date
- Trigger: Booking a bed for a date when another resident has a termination date between now and that date
- Workaround: None; requires implementing termination date check

**Hardcoded Contract Bank Details:**
- Location: `src/views/ContractPrintView.jsx` (lines 44, 51)
- Description: Bank account numbers and registration numbers are hardcoded with placeholder X's
- Symbols: Line 44 `'40103XXXXXX'`, Line 51 `'LVXXSWEDXXXXXXXXXXXXXXX'`
- Impact: Printed contracts contain fake account details
- Fix approach: Load from settings or configuration

## Security Considerations

**No Input Sanitization for Window.location Usage:**
- Risk: `window.location.origin` used directly in URL construction without validation
- Files: `src/domain/emailTemplates.js` (lines 11, 53)
- Current mitigation: URLs are internal; low risk for XSS
- Recommendations: Use process.env.PUBLIC_URL or config-based origin; avoid dynamic window.location construction

**localStorage Not Encrypted:**
- Risk: All resident data (health information, diagnoses, medications) stored in plaintext localStorage
- Impact: Browser developer tools or local file access reveals HIPAA/GDPR-sensitive information
- Current mitigation: None
- Recommendations: Encrypt sensitive fields before storage; use IndexedDB with encryption; implement session timeout

**No Access Control:**
- Risk: No role-based access control (RBAC); no verification that user can access resident data
- Impact: Any authenticated user can access any resident's information
- Recommendations: Implement permission checks; add resident affiliation verification; audit access logs

**Default/Demo Data:**
- Risk: Application starts with demo data (MOCK_RESIDENTS, DEMO_PRESCRIPTIONS) that includes sensitive information
- Files: `src/domain/initializeDemoData.js`, `src/domain/mockInventoryData.js`
- Impact: If accidentally deployed to production, real users see fake patient data
- Recommendations: Separate demo mode; disable demo data initialization in production; feature-flag demo mode

## Performance Bottlenecks

**Repeated localStorage Parsing:**
- Problem: Functions call `JSON.parse()` multiple times on same data within single request
- Example: `getDepartmentOccupancy()` calls `getRoomsFromStorage()` and `getBedsFromStorage()` which each parse independently; callers also parse again
- Files: `src/domain/departmentHelpers.js`, `src/domain/roomHelpers.js`, `src/domain/inventoryHelpers.js`
- Cause: No caching; immature data layer
- Improvement path: Implement data layer cache (useMemo in hooks); batch read operations; lazy-load only needed data

**Large Component Files:**
- Problem: Largest components exceed 1000 lines (ContractCreateView 1024 lines, ResidentProfileView 991 lines)
- Cause: Mixed concerns (form logic, display, validation, state management)
- Impact: Hard to test; difficult to modify; slow to render
- Improvement path: Split into smaller components; extract form logic to custom hook; move validation to separate module

**Full Data Load on Initialization:**
- Problem: `initializeDemoData()` loads entire dataset on app startup (line 68 in `App.jsx`)
- Impact: Blocks first render; scales poorly as data grows
- Improvement path: Lazy-load data on demand; implement pagination; async initialization with loading state

## Fragile Areas

**Contract State Machine:**
- Files: `src/domain/contracts.js`, `src/views/ContractCreateView.jsx`
- Why fragile: Multiple status values (draft, active, terminated) with complex transitions; no validation of state changes
- Safe modification: Add state machine guard function; validate all transitions; document state diagram
- Test coverage: No tests for contract state transitions; missing edge cases (terminate draft, reactivate terminated, etc.)

**Resident-Prescription Relationship:**
- Files: `src/domain/prescriptionHelpers.js`, `src/views/ResidentPrescriptionsView.jsx`
- Why fragile: Deleting resident doesn't clean up related prescriptions; orphaned records possible
- Safe modification: Implement cascade delete or soft-delete with foreign key constraints; add integrity checks
- Test coverage: No tests for data consistency; missing referential integrity validation

**Inventory Dispense-to-Prescription Link:**
- Files: `src/domain/inventoryScheduler.js`, `src/tests/unit/inventoryScheduler.test.js`
- Why fragile: Dispense log can become out of sync with prescriptions; mock inventory may not match actual
- Safe modification: Add reconciliation function; implement transaction-like pattern; validate before/after inventory balances
- Test coverage: Only 1 test file (inventoryScheduler.test.js); integration tests between inventory and prescriptions missing

**GroupActivitiesView Social Care Entry Generation:**
- Files: `src/views/GroupActivitiesView.jsx` (lines 58-84)
- Why fragile: Removes and recreates social care entries on every activity save; no deduplication; orphaned entries if activity ID changes
- Safe modification: Implement idempotent upsert; check for existing entries before creating; add activity ID validation
- Test coverage: No tests; edge cases untested (concurrent activity saves, participant list changes)

## Scaling Limits

**localStorage Size Limit:**
- Current capacity: ~5-10MB depending on browser
- Current usage: Unknown (no size monitoring)
- Limit: Will hit browser limit as resident/prescription count grows; no cleanup strategy
- Scaling path: Migrate to IndexedDB (1GB+); implement data archiving; sync to backend server

**Array .filter() and .map() Chains:**
- Current scale: Works fine with 50-100 residents
- Bottleneck: Department occupancy calculation chains 4-5 filters on beds/rooms; O(n*m) complexity
- When it breaks: 10,000+ residents with 50,000+ beds; pagination not implemented
- Improvement: Implement pagination; use indexed lookups; batch operations

**Demo Data Initialization:**
- Current dataset: ~20 residents, 100+ prescriptions, 50+ inventory items
- Problem: Loaded all at once with JSON.parse in synchronous initialization
- When it breaks: 1000+ residents; blocks UI for seconds
- Improvement: Async initialization with loading screen; pagination; lazy-load features

## Dependencies at Risk

**No Runtime Type Checking:**
- Risk: React component props and function parameters use no validation (no PropTypes, no TypeScript)
- Impact: Silent bugs when wrong data types passed; hard to debug
- Files: Affects all components
- Migration plan: Add JSDoc type comments; consider TypeScript migration; add runtime validation for critical functions

**Browser Compatibility Not Tested:**
- Risk: Uses localStorage, Intl.DateTimeFormat, Array methods that may not work in older browsers
- Files: Throughout codebase
- Migration plan: Add polyfills; test in target browsers; document minimum browser version

**Deprecated Patterns:**
- Issue: Using Date string manipulation instead of Date objects for calculations
- Files: `src/domain/roomHelpers.js` (line 618 `new Date(targetDate)`), multiple modal components
- Risk: Date parsing issues with different formats; timezone problems
- Recommendation: Use date library (date-fns, dayjs) for consistency

## Missing Critical Features

**No Data Backup/Export:**
- Problem: All data in localStorage; no export/import capability
- Blocks: Cannot migrate data; no disaster recovery; no audit trail
- Risk: Refreshing browser clears data if storage corrupted

**No Audit Logging:**
- Problem: Who changed what and when is not tracked
- Blocks: Compliance (GDPR, healthcare regulations); forensic analysis
- Files: Affects `createdBy`/`updatedBy` fields which are hardcoded

**No Data Validation Rules:**
- Problem: No schema validation on incoming data from forms
- Blocks: Cannot enforce business rules (e.g., prescription dose > 0, contract end date > start date)
- Files: All CRUD operations
- Current state: Validation happens only in display (components don't prevent invalid saves)

**No Error Recovery:**
- Problem: If save fails, no retry mechanism; no offline support
- Blocks: Network-dependent operations impossible; data loss on network error

**No Concurrent Conflict Resolution:**
- Problem: If same resident edited in two tabs, last write wins (no conflict detection)
- Blocks: Concurrent editing; multi-user features
- Risk: Data loss if multiple users edit same record

## Test Coverage Gaps

**No Unit Tests for Domain Logic:**
- What's not tested: All helper functions (prescriptionHelpers, roomHelpers, inventoryHelpers, residentHelpers)
- Files: `src/domain/*.js` (only inventoryScheduler has tests)
- Risk: Regressions in business logic undetected; refactoring risky
- Priority: High - these are critical data transformations

**No Component Integration Tests:**
- What's not tested: Modal flows, form submissions, localStorage persistence
- Files: All modals, views, components
- Risk: UI bugs discovered in production; state management issues missed
- Priority: High - users interact with these daily

**No E2E Tests:**
- What's not tested: Complete workflows (create resident → create prescription → administer dose → view history)
- Risk: Breaking changes in integrated features undetected
- Priority: Medium - can catch critical user paths

**No localStorage Data Consistency Tests:**
- What's not tested: Orphaned records, referential integrity, concurrent writes
- Risk: Silent data corruption
- Priority: High - affects data reliability

**No Performance Tests:**
- What's not tested: Rendering with large datasets, localStorage access speed
- Risk: Scaling issues discovered too late
- Priority: Medium

---

*Concerns audit: 2026-01-29*
