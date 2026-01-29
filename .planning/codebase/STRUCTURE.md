# Codebase Structure

**Analysis Date:** 2026-01-29

## Directory Layout

```
adorable-prototype/
├── src/
│   ├── App.jsx                          # Main router component (state management hub)
│   ├── main.jsx                         # Vite entry point
│   ├── components/                      # Reusable UI components
│   │   ├── Header.jsx                   # Main navigation header with menu
│   │   ├── PageShell.jsx                # Page wrapper (max-w-6xl container)
│   │   ├── Logo.jsx                     # Application logo
│   │   ├── BackButton.jsx               # Generic back navigation button
│   │   ├── StatusBadge.jsx              # Lead status display
│   │   ├── FormInput.jsx                # Text input wrapper
│   │   ├── InfoNotice.jsx               # Information box
│   │   ├── ProgressBar.jsx              # Consultation progress indicator
│   │   ├── LeadAvatar.jsx               # Resident photo/avatar display
│   │   ├── AgreementTemplate.jsx        # Agreement document template
│   │   ├── QueueOfferModal.jsx          # Modal for offering queue position
│   │   ├── EditLeadModal.jsx            # Edit lead contact info
│   │   ├── EditConsultationModal.jsx    # Edit consultation data
│   │   ├── EmailPreviewModal.jsx        # Preview email templates
│   │   ├── CancelModal.jsx              # Cancellation confirmation
│   │   ├── MissingDataModal.jsx         # Collect missing survey fields
│   │   ├── prescriptions/               # Medication management components
│   │   │   ├── PrescriptionTable.jsx    # Desktop table view (Today view)
│   │   │   ├── PrescriptionRow.jsx      # Single prescription row
│   │   │   ├── TimeSlotCell.jsx         # Medication time slot cell
│   │   │   ├── PrescriptionModal.jsx    # Add/edit prescription form
│   │   │   ├── RefusalModal.jsx         # Log dose action (given/refused/adjusted)
│   │   │   ├── CancellationModal.jsx    # Pause/discontinue prescription
│   │   │   ├── AllergiesAlert.jsx       # Allergy warning banner
│   │   │   ├── ResidentVitalsCard.jsx   # Vitals summary display
│   │   │   ├── WeeklyPrescriptionView.jsx   # 7-day schedule grid
│   │   │   ├── MonthlyPrescriptionView.jsx  # 30-day schedule grid
│   │   │   ├── DayStatusCell.jsx        # Day summary (given/refused count)
│   │   │   ├── HistoryView.jsx          # Filterable administration log
│   │   │   └── HistoryFilters.jsx       # Filter controls for history
│   │   ├── resident/                    # Resident profile components
│   │   │   ├── ResidentHeader.jsx       # Resident name + basic info header
│   │   │   ├── ProfileSection.jsx       # Basic demographics display
│   │   │   ├── VitalsSection.jsx        # Height, weight, vitals summary
│   │   │   ├── DiagnosesSection.jsx     # Diagnosis list display
│   │   │   ├── VitalsModal.jsx          # Record weight, height, BP, temp, etc.
│   │   │   ├── DiagnosisModal.jsx       # Add/edit ICD-10 diagnosis with search
│   │   │   ├── DoctorExamModal.jsx      # Doctor examination findings
│   │   │   ├── PsychiatristExamModal.jsx # Psychiatric assessment
│   │   │   ├── MorseScaleModal.jsx      # Fall risk (Morse scale) assessment
│   │   │   ├── BradenScaleModal.jsx     # Pressure ulcer risk (Braden scale)
│   │   │   ├── VaccinationModal.jsx     # Vaccination record
│   │   │   ├── TechnicalAidsModal.jsx   # Mobility aids (walker, cane, etc.)
│   │   │   └── QuarterlyNurseData.jsx   # BMI tracking + weight trends
│   │   ├── inventory/                   # Warehouse inventory components
│   │   │   ├── InventoryTable.jsx       # Bulk inventory display
│   │   │   ├── ResidentInventoryTable.jsx # Per-resident inventory
│   │   │   ├── InventoryAlerts.jsx      # Low stock alerts
│   │   │   ├── InventoryTransferModal.jsx
│   │   │   ├── InventoryFormModal.jsx
│   │   │   ├── InventoryImageModal.jsx
│   │   │   └── InventoryReportsView.jsx
│   │   ├── contract/                    # Contract management components
│   │   │   └── ContractStatusBadge.jsx
│   │   ├── rooms/                       # Room/bed management
│   │   │   ├── RoomGrid.jsx
│   │   │   └── BedSelector.jsx
│   │   └── documents/                   # Document generation
│   │       └── PrintableContract.jsx
│   ├── views/                           # Full-page/route components
│   │   ├── NewLeadForm.jsx              # Create new prospect
│   │   ├── LeadDetailsView.jsx          # View prospect contact info
│   │   ├── ConsultationStep.jsx         # Consultation form (care level, room type, duration)
│   │   ├── WaitingForDecision.jsx       # Waiting for customer response state
│   │   ├── SurveyView.jsx               # Admin fills all legal/personal survey fields
│   │   ├── OfferCustomerView.jsx        # Customer-facing offer form (not used yet)
│   │   ├── OfferReviewView.jsx          # Admin reviews completed survey before agreement
│   │   ├── AgreementSuccess.jsx         # Agreement created, next steps
│   │   ├── QueueSuccess.jsx             # Added to queue confirmation
│   │   ├── QueueListView.jsx            # Queue management interface
│   │   ├── AllLeadsView.jsx             # List all prospects/leads
│   │   ├── ResidentListView.jsx         # List all residents (those with beds)
│   │   ├── ResidentProfileView.jsx      # Unified resident view with tabs (profile, prescriptions, inventory)
│   │   ├── ResidentPrescriptionsView.jsx # Prescriptions tab detail (DEPRECATED - integrated in ResidentProfileView)
│   │   ├── ResidentReportsView.jsx      # Resident statistics (tenure, discharges, etc.)
│   │   ├── PrescriptionPrintView.jsx    # Print-optimized prescription list
│   │   ├── InventoryDashboardView.jsx   # Bulk warehouse (A) view
│   │   ├── ResidentInventoryView.jsx    # Resident inventory (B) view
│   │   ├── RoomManagementView.jsx       # Room/bed configuration
│   │   ├── BedFundView.jsx              # Bed occupancy statistics (Gultu fonds)
│   │   ├── BedBookingView.jsx           # Select room/bed during agreement
│   │   ├── ContractCreateView.jsx       # Create/edit contract (large form)
│   │   ├── ContractListView.jsx         # List all contracts
│   │   ├── ContractPrintView.jsx        # Print contract with signature & move-in
│   │   ├── GroupActivitiesView.jsx      # Group activities management
│   │   ├── SettingsView.jsx             # System settings
│   │   └── CustomerFillView.jsx         # DEPRECATED - old customer form
│   ├── domain/                          # Business logic (no React, pure functions)
│   │   ├── leadHelpers.js               # Lead CRUD: createProspect, upgradeToLead, addToQueue
│   │   ├── residentHelpers.js           # Resident CRUD: createResidentFromLead, getAllResidents
│   │   ├── residentDataHelpers.js       # Resident data queries: diagnoses, vitals, assessments
│   │   ├── prescriptionHelpers.js       # Prescription CRUD: logPrescription, logDoseAction
│   │   ├── prescriptionValidation.js    # Prescription form validation
│   │   ├── roomHelpers.js               # Room/bed operations: bookBed, releaseBed
│   │   ├── departmentHelpers.js         # Department logic (regular/dementia)
│   │   ├── quarterlyDataHelpers.js      # BMI calculation + weight tracking
│   │   ├── inventoryHelpers.js          # Inventory CRUD: transfer, consumption tracking
│   │   ├── inventoryScheduler.js        # Auto-dispense on medication administration
│   │   ├── inventoryValidation.js       # Inventory form validation
│   │   ├── contracts.js                 # Contract business rules
│   │   ├── pricing.js                   # Daily rate calculation from care level/room type/duration
│   │   ├── validation.js                # Lead form validation
│   │   ├── emailTemplates.js            # Email content generators
│   │   ├── products.js                  # Product/medication catalog
│   │   ├── initializeDemoData.js        # Demo data generator
│   │   ├── safeStorageHelpers.js        # localStorage error handling
│   │   ├── mockPrescriptionData.js      # Prescription mock residents/data
│   │   ├── mockInventoryData.js         # Inventory mock data
│   │   ├── mockRoomData.js              # Room/bed mock data
│   │   ├── leadHelpers.test.js          # Lead helper unit tests
│   │   ├── pricing.test.js              # Pricing calculation tests
│   │   └── validation.test.js           # Form validation tests
│   ├── hooks/                           # Custom React hooks
│   │   ├── useLocalStorage.js           # useLocalStorage & usePersistedLeads hooks
│   │   └── useContracts.js              # useContracts for contract CRUD
│   ├── constants/                       # Shared constants & enums
│   │   ├── steps.js                     # STEPS & STATUS constants for routing
│   │   ├── prescriptionConstants.js     # TIME_SLOTS, ADMINISTRATION_STATUS, REFUSAL_REASONS
│   │   ├── residentConstants.js         # CARE_LEVELS, RISK_SCALES, RESIDENT_STATUS
│   │   ├── departmentConstants.js       # Department definitions (regular/dementia)
│   │   ├── roomConstants.js             # Room configurations
│   │   ├── inventoryConstants.js        # Inventory item categories
│   │   ├── discountConstants.js         # Contract discount rules
│   │   ├── medicationCatalog.js         # Common medications
│   │   ├── icd10Codes.js                # ICD-10 diagnosis codes (1MB+ lookup table)
│   │   └── agreementFields.js           # Survey form field definitions
│   ├── tests/
│   │   └── unit/                        # Jest unit tests (if any)
│   └── index.css                        # Global Tailwind imports

├── .planning/codebase/                  # GSD analysis documents
│   ├── ARCHITECTURE.md                  # This file
│   ├── STRUCTURE.md                     # Directory layout guide
│   └── [other analysis docs]
├── .env                                 # Environment variables (if needed)
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── package.json                         # Dependencies & scripts
├── index.html                           # HTML entry point
├── CLAUDE.md                            # Project instructions for Claude
├── ARCHITECTURE.md                      # Outdated - superseded by .planning/codebase/ARCHITECTURE.md
├── CLAUDE.md                            # Project overview & history
└── README.md                            # Basic project description
```

## Directory Purposes

**src/components/**
- Purpose: Reusable UI building blocks
- Contains: React components that don't occupy full page
- Shared across views; receive data via props
- Patterns: Modal dialogs, form inputs, data display cards, tables

**src/views/**
- Purpose: Full-page components representing distinct routes/screens
- Contains: Main layout for each screen user sees
- Always receive navigation callbacks and data from App.jsx
- Coordinate multiple components into page layout

**src/domain/**
- Purpose: Business logic isolated from React
- Contains: Pure functions for CRUD, validation, calculations
- All localStorage I/O happens here
- Testable in isolation without React

**src/hooks/**
- Purpose: Reusable React state/lifecycle logic
- Contains: Custom hooks (usePersistedLeads, useContracts, useLocalStorage)
- Pattern: Hooks manage complex state logic that would be verbose in components

**src/constants/**
- Purpose: Shared configuration, enums, lookup data
- Contains: STATUS enums, form field definitions, medication lists
- Used throughout components and domain helpers

## Key File Locations

**Entry Points:**
- `src/App.jsx`: Application root component with routing state machine
- `src/main.jsx`: Vite bootstrap point, mounts App to DOM
- `src/index.css`: Tailwind directives

**Navigation/Routing:**
- `src/constants/steps.js`: STEPS enum (LIST, FORM, LEAD_VIEW, RESIDENT_LIST, etc.)
- `src/constants/steps.js`: STATUS enum (prospect, consultation, survey_filled, agreement, queue, cancelled)
- `src/components/Header.jsx`: Main menu with navigation handlers

**Lead Intake Flow:**
- `src/views/NewLeadForm.jsx`: Form creation entry point
- `src/views/LeadDetailsView.jsx`: View/edit prospect contact info
- `src/views/ConsultationStep.jsx`: Care level + room selection
- `src/views/SurveyView.jsx`: Admin fills legal/personal details
- `src/views/OfferReviewView.jsx`: Review before agreement
- `src/views/AgreementSuccess.jsx`: Agreement created, next steps (book bed or queue)
- `src/views/QueueListView.jsx`: Queue management
- `src/domain/leadHelpers.js`: All lead operations (createProspect, upgradeToLead, addToQueue)

**Resident Management:**
- `src/views/ResidentListView.jsx`: List all residents
- `src/views/ResidentProfileView.jsx`: Unified profile view (tabs: basic info, health, prescriptions, inventory)
- `src/domain/residentHelpers.js`: Resident CRUD (createResidentFromLead, getAllResidents, getResidentById)

**Prescriptions (Ordinācijas Plāns):**
- `src/views/ResidentProfileView.jsx`: Main entry (health tab)
- `src/components/prescriptions/PrescriptionTable.jsx`: Today view (default)
- `src/components/prescriptions/WeeklyPrescriptionView.jsx`: 7-day grid
- `src/components/prescriptions/MonthlyPrescriptionView.jsx`: 30-day grid
- `src/components/prescriptions/HistoryView.jsx`: Administration logs
- `src/components/prescriptions/PrescriptionModal.jsx`: Add/edit prescription form
- `src/components/prescriptions/RefusalModal.jsx`: Log dose action (given/increased/decreased/skipped)
- `src/components/prescriptions/CancellationModal.jsx`: Pause/discontinue
- `src/domain/prescriptionHelpers.js`: Prescription CRUD (logPrescription, logDoseAction, logAdministration)

**Contracts:**
- `src/views/ContractListView.jsx`: List all contracts
- `src/views/ContractCreateView.jsx`: Create/edit contract form
- `src/views/ContractPrintView.jsx`: Print with signature & move-in option
- `src/domain/contracts.js`: Contract business rules
- `src/hooks/useContracts.js`: Contract localStorage hook

**Rooms & Bed Management:**
- `src/views/BedFundView.jsx`: Statistics (Gultu fonds) - occupancy by department
- `src/views/BedBookingView.jsx`: Room/bed selection modal (used during agreement)
- `src/views/RoomManagementView.jsx`: Room/bed configuration
- `src/domain/roomHelpers.js`: Room/bed operations (bookBed, releaseBed, confirmReservation)

**Inventory (Noliktava):**
- `src/views/InventoryDashboardView.jsx`: Bulk warehouse (A) view
- `src/views/ResidentInventoryView.jsx`: Resident inventory (B) view
- `src/domain/inventoryHelpers.js`: Inventory CRUD and queries
- `src/domain/inventoryScheduler.js`: Auto-dispense medication when given

**Data Models:**
- `src/domain/initializeDemoData.js`: Demo resident/prescription/contract generation

## Naming Conventions

**Files:**
- Components: `PascalCase.jsx` (e.g., `PrescriptionTable.jsx`, `RefusalModal.jsx`)
- Helpers/utilities: `camelCase.js` (e.g., `prescriptionHelpers.js`, `roomHelpers.js`)
- Constants/enums: `camelCase.js` (e.g., `prescriptionConstants.js`, `steps.js`)
- Tests: `same-name.test.js` (e.g., `pricing.test.js`)

**Directories:**
- Feature-based grouping: `src/components/{feature}/` (e.g., `prescriptions/`, `resident/`, `inventory/`)
- All helpers in single `src/domain/` directory (flat structure)
- All constants in single `src/constants/` directory

**React Components:**
- State variables: `camelCase` (e.g., `const [showModal, setShowModal]`)
- Props: `camelCase` (e.g., `onSelectResident`, `residentId`)
- Handler functions: `handle{ActionName}` (e.g., `handleSelectResident`, `handleSaveContract`)
- Conditional display: `show{ComponentName}` (e.g., `showPrescriptionModal`)
- Event handlers: `on{EventName}` props passed to children

**Domain Functions:**
- Read operations: `get{Noun}` (e.g., `getResidentById`, `getAllPrescriptions`)
- Create operations: `create{Noun}` (e.g., `createProspect`, `createResidentFromLead`)
- Update operations: `update{Noun}` or `{verb}{Noun}` (e.g., `addToQueue`, `logDoseAction`)
- Delete operations: `delete{Noun}` (e.g., `deleteLead`)
- Initialize operations: `initialize{Noun}Data` (e.g., `initializePrescriptionData`)

**localStorage Keys:**
- Kebab-case: `adorable-{noun}` (e.g., `adorable-leads`, `adorable-prescriptions`)

## Where to Add New Code

**New Feature (e.g., Health Screening):**
- Primary code: `src/views/HealthScreeningView.jsx`
- Domain logic: `src/domain/healthHelpers.js`
- Constants: Add to `src/constants/healthConstants.js` (new file)
- Storage: Define key in helper, add to `initializeDemoData.js` if mock data needed
- Navigation: Add STEP to `src/constants/steps.js`, add menu item to `Header.jsx`

**New Component (e.g., Medication Search):**
- Implementation: `src/components/{feature}/MedicationSearch.jsx`
- If used across features: `src/components/MedicationSearch.jsx` (root level)
- Props should be: data input + callbacks for selection/changes
- No direct localStorage access; parent view handles persistence

**New Resident Assessment (e.g., Pain Scale):**
- Modal component: `src/components/resident/PainScaleModal.jsx`
- Data helper: Add getter function to `src/domain/residentDataHelpers.js`
- Storage: Assessments stored in resident's `assessments[]` array
- Integration: Add button/section in `ResidentProfileView.jsx` health tab

**Utilities & Helpers:**
- Pure functions: `src/domain/`
- React hooks: `src/hooks/`
- Form inputs: `src/components/` (FormInput, etc.)
- Constants: `src/constants/`

**Modals & Dialogs:**
- Feature-specific: `src/components/{feature}/{ActionName}Modal.jsx`
- Generic: `src/components/{ActionName}Modal.jsx`
- Pattern: Receive `isOpen`, `onClose`, `onConfirm` props; no local state for data

**Tab Content:**
- Location: `src/views/ResidentProfileView.jsx` contains inline tab switching
- Alternative: Extract to `src/components/resident/ProfileTab.jsx` for reuse
- Pattern: Tabs render based on `activeMainTab` state

## Special Directories

**src/domain/test files:**
- Purpose: Jest unit tests for business logic
- Generated: No (checked in)
- Committed: Yes
- Examples: `pricing.test.js`, `validation.test.js`, `leadHelpers.test.js`
- Command: `npm test` to run

**src/tests/unit/:**
- Purpose: Component/integration tests (if any)
- Generated: No (prototype stage, minimal tests)
- Committed: Yes
- Future: Add vitest/React Testing Library tests here as coverage improves

**localStorage conceptual structure:**
```
adorable-leads              # Array of lead objects (intake pipeline)
adorable-prescription-residents # Array of residents (who live here)
adorable-prescriptions      # Array of prescription records
adorable-administration-logs # Array of dose action logs
adorable-contracts          # Array of signed contracts
adorable-inventory-bulk     # Array of bulk warehouse items
adorable-inventory-resident # Array of per-resident items
adorable-rooms              # Array of room definitions (floors, beds)
adorable-group-activities   # Array of group activity records
```

## Typical Task Locations

| Task | Primary Location | Supporting Files |
|------|-----------------|------------------|
| Add field to resident profile | ResidentProfileView + VitalsModal | residentDataHelpers, residentConstants |
| Add new prescription medication | PrescriptionModal | prescriptionHelpers, medicationCatalog |
| Track new inventory category | ResidentInventoryView | inventoryHelpers, inventoryConstants |
| Create new lead filter | AllLeadsView | leadHelpers (add getLeadsByFilter function) |
| Add assessment (Morse, Braden, etc.) | Create new Modal in resident/ | residentDataHelpers (add getter) |
| Change care level pricing | ConsultationStep + pricing.js | pricing.js calculation logic |
| Modify lead status flow | App.jsx navigation + STATUS enum | leadHelpers (business rules) |
| New contract field | ContractCreateView form + contracts.js | contractHelpers or update contracts.js |

---

*Structure analysis: 2026-01-29*
