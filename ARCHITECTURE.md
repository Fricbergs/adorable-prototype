# Architecture Documentation

## Overview

Adorable Prototype is a care facility management system with two main modules:

1. **Lead/Client Intake** - Managing prospective residents from first contact to agreement
2. **Prescriptions (Ordinācijas)** - Managing medications for current residents

## Application Structure

```
src/
├── App.jsx              # Main component with routing and state
├── main.jsx             # React entry point
├── components/          # Reusable UI components
│   ├── prescriptions/   # Prescription-specific components
│   └── queue/           # Queue management components
├── views/               # Page-level components (screens)
├── domain/              # Business logic (no UI)
├── constants/           # Shared constants
└── hooks/               # Custom React hooks
```

## Routing

The app uses a simple state-based router in `App.jsx`. Navigation is controlled by `currentStep` state matching values from `constants/steps.js`:

```
STEPS = {
  // Lead Intake Flow
  LIST            → All leads list
  FORM            → New lead form
  LEAD_VIEW       → Lead details
  CONSULTATION    → Consultation form
  WAITING         → Waiting for decision
  SURVEY          → Survey form
  OFFER_REVIEW    → Review before agreement
  AGREEMENT       → Agreement success
  QUEUE           → Queue success
  QUEUE_LIST      → Queue management

  // Prescription Flow
  RESIDENT_LIST          → Resident selection
  RESIDENT_PRESCRIPTIONS → Prescription management
  PRESCRIPTION_PRINT     → Print view
}
```

## Data Flow

### State Management

All state lives in `App.jsx` and flows down via props. No external state library.

```
App.jsx (state owner)
    ├── leads (via usePersistedLeads hook)
    ├── currentStep (navigation)
    ├── savedLead (current lead being edited)
    ├── consultation (form data)
    └── selectedResident (for prescriptions)
```

### Data Persistence

All data stored in localStorage with these keys:

| Key | Description | Module |
|-----|-------------|--------|
| `adorable-leads` | Lead/prospect data | Intake |
| `adorable-prescription-residents` | Resident records | Prescriptions |
| `adorable-prescriptions` | Prescription records | Prescriptions |
| `adorable-administration-logs` | Medication logs | Prescriptions |

## Module 1: Lead Intake

### Status Flow

```
prospect → consultation → survey_filled → agreement
                      ↘                ↗
                        queue ────────→
```

Each status maps to specific views and actions:

| Status | Latvian | View | Next Actions |
|--------|---------|------|--------------|
| prospect | Pieteikums | LeadDetailsView | Start consultation |
| consultation | Konsultācija | WaitingForDecision | Fill survey, Add to queue |
| survey_filled | Anketa aizpildīta | OfferReviewView | Create agreement, Add to queue |
| agreement | Līgums | AgreementSuccess | Done |
| queue | Rinda | QueueSuccess | Send offer, Accept |
| cancelled | Atcelts | (read-only in list) | None |

### Key Domain Files

- `domain/leadHelpers.js` - Lead CRUD, queue operations
- `domain/pricing.js` - Price calculation based on care level, room type, duration
- `domain/validation.js` - Form validation
- `domain/emailTemplates.js` - Email content generation

## Module 2: Prescriptions (Ordinācijas)

### Data Model

```javascript
Resident {
  id, firstName, lastName, birthDate, personalCode,
  room, careLevel, allergies[], vitals{}
}

Prescription {
  id, residentId, medicationName, activeIngredient, form,
  schedule: {
    morning:  { enabled, time, dose, unit },
    noon:     { enabled, time, dose, unit },
    evening:  { enabled, time, dose, unit },
    night:    { enabled, time, dose, unit }
  },
  frequency: 'daily' | 'specific_days',
  specificDays: ['monday', 'wednesday', ...],
  status: 'active' | 'discontinued'
}

AdministrationLog {
  id, prescriptionId, residentId, date, timeSlot,
  status: 'given' | 'refused' | 'skipped',
  refusalReason, administeredBy, administeredAt, notes
}
```

### Views

1. **Today View (Šodien)** - Default. Shows prescription table with 4 time columns
2. **Weekly View (Nedēļa)** - 7-day schedule grid showing daily aggregated status
3. **History View (Vēsture)** - Filterable list of administration records

### Component Hierarchy

```
ResidentPrescriptionsView
├── PrescriptionTable (desktop)
│   └── PrescriptionRow
│       └── TimeSlotCell
├── PrescriptionCards (mobile)
├── WeeklyPrescriptionView
│   └── DayStatusCell
├── HistoryView
│   └── HistoryFilters
├── PrescriptionModal (create/edit)
└── RefusalModal (mark refusal)
```

### Key Domain Files

- `domain/prescriptionHelpers.js` - All prescription CRUD and queries
- `domain/prescriptionValidation.js` - Prescription form validation
- `domain/mockPrescriptionData.js` - Mock data generation
- `constants/prescriptionConstants.js` - Time slots, form types, refusal reasons

## Component Patterns

### View Components (`views/`)

Full-page components that:
- Receive data and callbacks via props
- Handle page-specific UI layout
- Don't directly access localStorage

### UI Components (`components/`)

Reusable pieces that:
- Are stateless or have local-only state
- Receive data via props
- Call parent callbacks for actions

### Domain Functions (`domain/`)

Pure business logic that:
- Handle data transformations
- Interact with localStorage
- Have no React dependencies
- Are testable in isolation

## Styling

- Tailwind CSS for all styling
- Orange (`orange-500`) as primary brand color
- Teal (`teal-500`) for success states
- Cyan (`cyan-500`) for pending/info states
- Red (`red-500`) for errors/refusals

## Testing

Tests located alongside source files:
- `domain/pricing.test.js`
- `domain/validation.test.js`
- `domain/leadHelpers.test.js`

Run with: `npm test`
