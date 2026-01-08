# Ordinācijas (Prescriptions)

**ClickUp Task:** AD-17 (Ordinācijas plāns - plānošana)
**Status:** To Do (parent in ClickUp, but largely built in prototype)

---

## Overview

Medication scheduling and administration tracking for residents.

---

## Current Prototype Features

### Views

#### 1. Šodien (Today View)
- Current day's medication schedule
- Time slots: Rīts (Morning), Diena (Noon), Vakars (Evening), Nakts (Night)
- Per-resident medication list
- Administration status (given/refused/pending)

#### 2. Nedēļa (Weekly View)
- 7-day medication schedule
- Day-by-day status overview
- Quick navigation between days

#### 3. Vēsture (History View)
- Administration records log
- Filtering by date range
- Filtering by medication
- Filtering by status (Iedota/Atteikums)

### Administration Actions

| Action | Latvian | Description |
|--------|---------|-------------|
| Given | Iedota | Medication administered |
| Refusal | Atteikums | Resident refused medication |

### Refusal Workflow
- Visible X button (red cross on white background)
- Refusal reason required
- Logged in history

---

## Prototype Components

### Views
- ResidentPrescriptionsView.jsx - Main prescriptions view
- PrescriptionPrintView.jsx - Print layout

### Components (src/components/prescriptions/)
- PrescriptionTable.jsx - Main table layout
- PrescriptionRow.jsx - Individual prescription row
- TimeSlotCell.jsx - Time slot administration
- DayStatusCell.jsx - Daily status indicator
- WeeklyPrescriptionView.jsx - Week view
- HistoryView.jsx - History with filters
- HistoryFilters.jsx - Filter controls
- PrescriptionModal.jsx - Add/edit prescription
- RefusalModal.jsx - Refusal reason entry
- AllergiesAlert.jsx - Allergy warnings
- ResidentVitalsCard.jsx - Vital signs display

---

## What's Missing (from ClickUp)

### AD-67: Printing Capability
```
Noskaidrot - vai Ordinācijas plāns ir jāspēj printēt
```

**Question:** Should prescription plan be printable?

**Status:** PrescriptionPrintView.jsx exists but needs validation

### AD-68: Measurement Units
```
Noskaidrot - nepieciešamās zāļu ordinēšanas mērvienības (mg, g, gab., ...)
```

**Question:** What medication units are needed?

**Current:** Not standardized in prototype

---

## Integration Points

### With Zāļu noliktava (Medication Inventory)
From AD-69:
```
Ilgtermiņā - Ordinācijas plāns mijiedarbosies ar zāļu noliktavu,
jo pēc Ordinācijas plāna izpildes ir jāsamazina zāļu noliktavas atlikumi.
```

**Future:** Prescription execution should:
1. Decrease resident's medication inventory
2. Log consumption for reporting
3. Trigger low-stock alerts

### With Atskaites (Reports)
Reports requiring prescription data:
- Ordinācijas (Prescriptions report)
- Medications (Medication usage report)
- Preparātu piegāde (Medicine delivery report)

---

## Data Model

### Prescription
```
- Resident ID
- Medication name
- Dosage
- Unit (mg, g, gab., ml, etc.)
- Frequency (time slots)
- Start date
- End date (optional)
- Prescribing doctor
- Notes
```

### Administration Log
```
- Prescription ID
- Date
- Time slot
- Status (given/refused)
- Administered by (user)
- Refusal reason (if refused)
- Notes
```

---

## localStorage Keys (Prototype)

- `adorable-prescription-residents`
- `adorable-prescriptions`
- `adorable-administration-logs`

---

## Open Questions

1. **AD-67:** Is printing required for prescriptions?
2. **AD-68:** What measurement units to support?
3. Integration timeline with inventory system?

---

*Source: ClickUp AD-17 and CLAUDE.md documentation*
