# Architecture

**Analysis Date:** 2026-01-29

## Pattern Overview

**Overall:** State-based routing with localStorage persistence and layered domain separation

**Key Characteristics:**
- Centralized state management in `App.jsx` (top-level router)
- Unidirectional data flow: state → props → components → callbacks
- Domain logic completely separated from React components
- localStorage as single source of truth for data persistence
- No external state library (Redux, Zustand, etc.)

## Layers

**Presentation Layer (Components):**
- Purpose: Render UI and capture user interactions
- Location: `src/components/`, `src/views/`
- Contains: React components using Tailwind CSS
- Depends on: Domain helpers, constants, custom hooks
- Used by: App.jsx routing handler

**Domain Layer (Business Logic):**
- Purpose: Handle all data operations, calculations, and business rules
- Location: `src/domain/`
- Contains: Pure functions with no React dependencies
- Depends on: localStorage directly, constants
- Used by: Views, components via callbacks from App.jsx

**Constants & Configuration Layer:**
- Purpose: Define shared constants, enums, and lookup data
- Location: `src/constants/`
- Contains: Status enums, time slots, medication data, form fields
- Used by: Domain helpers and components

**Persistence Layer:**
- Purpose: Abstract localStorage access
- Location: Inline in domain helpers + `src/hooks/useLocalStorage.js`
- Contains: `initializeXxxData()` functions, storage key constants
- Strategy: Each domain module manages its own localStorage keys

## Data Flow

**Lead Intake Flow:**

1. User submits new lead form (NewLeadForm)
2. `App.jsx` validates with `validateLeadForm()` from domain
3. Domain function `createProspect()` generates prospect object
4. `usePersistedLeads()` hook writes to localStorage (`adorable-leads`)
5. Navigation updates `currentStep` state
6. Next view (LeadDetailsView) receives `savedLead` prop
7. User completes consultation → domain helper `upgradeToLead()` updates lead object
8. Hook writes updated lead back to localStorage
9. Flow continues through SURVEY → OFFER_REVIEW → AGREEMENT → QUEUE or RESIDENT

**Prescription Flow:**

1. ResidentProfileView loads with `residentId` prop
2. Domain helpers query prescription data:
   - `getActivePrescriptionsForResident(residentId)` from `prescriptionHelpers.js`
   - `getLatestVitals(residentId)` from `residentDataHelpers.js`
3. Component state stores array of prescriptions
4. User adds prescription → PrescriptionModal form
5. `logPrescription()` domain function creates prescription object
6. localStorage key: `adorable-prescriptions` updated synchronously
7. RefusalModal captures dose action (given/increased/decreased/skipped)
8. `logDoseAction()` creates administration log
9. localStorage key: `adorable-administration-logs` updated
10. HistoryView queries logs and displays filtered results

**State Management:**

```
App.jsx (single source of truth)
├── currentStep (navigation state) → STEPS constants
├── leads (via usePersistedLeads hook) → adorable-leads
├── savedLead (current lead being edited)
├── consultation (form state for consultation step)
├── selectedResident (current resident being viewed)
├── contractFromLead (lead object during contract creation)
├── inventory state (selectedInventoryResident, selectedBulkItemForTransfer)
└── callbacks (handleSubmit, handleSelectLead, etc.)
    ↓
Views (props-based, no local data mutations)
├── LeadDetailsView
├── ResidentProfileView
├── ResidentListView
├── ContractCreateView
├── etc.
    ↓
Domain Helpers (pure functions, localStorage I/O)
├── leadHelpers.js (createProspect, upgradeToLead, addToQueue)
├── prescriptionHelpers.js (logPrescription, logDoseAction)
├── residentHelpers.js (createResidentFromLead, getResidentById)
├── roomHelpers.js (bookBed, confirmReservation, releaseBed)
└── etc.
    ↓
localStorage (persisted state)
├── adorable-leads
├── adorable-prescription-residents
├── adorable-prescriptions
├── adorable-administration-logs
├── adorable-contracts
├── adorable-inventory-bulk
├── adorable-inventory-resident
└── adorable-rooms
```

## Key Abstractions

**Lead (prospect → agreement → resident):**
- Purpose: Represents potential or current client through intake journey
- Examples: `src/views/LeadDetailsView.jsx`, `src/domain/leadHelpers.js`
- Pattern: Lead object enriched at each step (consultant adds consultation, survey fills legal data, contract adds bed booking)
- Schema: `{ id, firstName, lastName, status, consultation, survey, contractId, residentId, ... }`

**Resident (person living in facility):**
- Purpose: Person with care plan, prescriptions, medical history
- Examples: `src/views/ResidentProfileView.jsx`, `src/domain/residentHelpers.js`
- Pattern: Created from lead after bed is booked; contains linkage to lead for tracking
- Schema: `{ id, firstName, lastName, leadId, roomId, bedNumber, careLevel, status, diagnoses[], vitals{}, ... }`

**Prescription:**
- Purpose: Medication administration schedule for resident
- Examples: `src/components/prescriptions/PrescriptionTable.jsx`, `src/domain/prescriptionHelpers.js`
- Pattern: Has 4 time slots (morning/noon/evening/night) with optional specific days
- Schema: `{ id, residentId, medicationName, activeIngredient, form, schedule{}, frequency, specificDays[], status, prescribedBy, ... }`

**Administration Log:**
- Purpose: Record of whether medication was given/refused/adjusted
- Pattern: One log per time slot per day per prescription
- Schema: `{ id, prescriptionId, residentId, date, timeSlot, status, doseAction, reason, administeredBy, administeredAt }`

**Room & Bed:**
- Purpose: Physical location where resident lives
- Pattern: Room has multiple beds; beds can be occupied/reserved/free
- Schema: `Room { id, number, floor, bedCount, beds[] }; Bed { number, status, occupiedBy, reservedFor, ... }`

## Entry Points

**App.jsx:**
- Location: `src/App.jsx`
- Triggers: Application startup (all data initialized on render)
- Responsibilities: Top-level routing, state management, orchestration of all workflows

**main.jsx:**
- Location: `src/main.jsx`
- Triggers: Vite/React bootstrap
- Responsibilities: React.StrictMode wrapper, DOM mount point

**initializeDemoData():**
- Location: `src/domain/initializeDemoData.js`
- Triggers: Called at App.jsx module load time (line 62)
- Responsibilities: Populates localStorage with demo data if empty

**ResidentProfileView entry point for prescriptions:**
- Location: `src/views/ResidentProfileView.jsx`
- Data loading: Uses effect hooks to load resident, prescriptions, vitals on residentId change

## Error Handling

**Strategy:** Try-catch in domain functions + localStorage fallback to empty arrays/objects

**Patterns:**

- **Form Validation:** `validateLeadForm()`, `validatePrescription()` in domain layer return error object `{ fieldName: 'error message' }`
- **Data Mutations:** Domain functions throw errors with Latvian messages (e.g., "Nav norādīti līda dati")
- **localStorage Recovery:** Functions like `getAllResidents()` use `JSON.parse(...||'[]')` to default to empty if corrupted
- **Component Error Boundaries:** None currently implemented (prototype stage)

## Cross-Cutting Concerns

**Logging:**
- Approach: `console.log` during development, no structured logging
- Pattern: Domain helpers log when errors occur
- Note: Medication logs are stored to localStorage via `logDoseAction()`

**Validation:**
- Approach: Domain functions validate before persistence
- Files: `src/domain/validation.js`, `src/domain/prescriptionValidation.js`, `src/domain/inventoryValidation.js`
- Pattern: Validation functions return `{ isValid: boolean, errors: {} }`

**Authentication:**
- Approach: Not implemented (prototype assumes single facility admin)
- Note: App is hardcoded to Melodija facility
- Future: Will require login integration

**Data Integrity:**
- Approach: synchronous localStorage writes ensure consistency
- Pattern: After user action, domain function immediately persists, then component state updates
- Risk: No transaction support; lost writes if localStorage quota exceeded

---

*Architecture analysis: 2026-01-29*
