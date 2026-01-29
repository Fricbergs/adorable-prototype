# Adorable Prototype — Inventory Expansion

## What This Is

A care facility management system for Latvian elderly care homes (single facility: Melodija). This milestone expands the medical supply inventory system to support multiple suppliers, relative-brought items, and foreign medications not in the national database. The prototype runs client-side with localStorage — no backend.

## Core Value

Staff can track every medical supply item regardless of its source — bulk suppliers, relatives, or foreign imports — with clear attribution of where each item came from and whether it's billable.

## Requirements

### Validated

Existing capabilities confirmed from codebase:

- ✓ Resident management with floor/department filters — existing
- ✓ Prescription management with Today/Weekly/Monthly/History views — existing
- ✓ Dose action workflow (given/increased/decreased/skipped) — existing
- ✓ Storage A (bulk warehouse) with single-supplier inventory — existing
- ✓ Storage B (per-resident) with item assignment from A — existing
- ✓ Inventory transfer from A → B — existing
- ✓ Auto-dispense on medication administration — existing
- ✓ Low stock alerts — existing
- ✓ Inventory reports view — existing
- ✓ Bed fund with occupancy statistics — existing
- ✓ Contract management (create/edit/activate/terminate) — existing
- ✓ Lead intake pipeline (prospect → consultation → survey → agreement → resident) — existing
- ✓ Group activities with participant registration — existing
- ✓ ICD-10 diagnosis code search — existing

### Active

Storage A — Multi-Supplier Support:
- [ ] Support multiple suppliers in Storage A (currently hardcoded to one)
- [ ] Supplier 1: UI mockup for XML catalog import flow (daily catalog update)
- [ ] Supplier 1: UI mockup for XML invoice import flow (stock receipt)
- [ ] Supplier 2: Different catalog format with manual entry support
- [ ] Supplier 2: Paper invoice manual entry (item names, quantities, prices)
- [ ] Supplier selection when receiving/viewing items
- [ ] Per-supplier item tracking (which supplier provided which item)

Storage B — Expanded Item Sources:
- [ ] Relative-brought items: register items brought by family (zero cost, not invoiced)
- [ ] Foreign medications: manual free-text entry for items not in any catalog
- [ ] Item entry: pick from existing catalog first, free-text if not found
- [ ] Clear source attribution per item (facility-purchased vs relative-brought vs foreign)
- [ ] Source-aware display in resident inventory view

Demo & Integration:
- [ ] Full demo flow: receive from Supplier 1 → A, receive from Supplier 2 → A, transfer A → B
- [ ] Full demo flow: relative brings item → B, foreign med entry → B
- [ ] Demo data for multi-supplier scenarios

### Out of Scope

- Actual XML parsing in browser — prototype uses UI mockups only, real parsing is backend work
- Backend/API integration — stays on localStorage
- Real supplier API connections — no live data feeds
- Invoice generation or financial reporting — tracking only, not accounting
- Barcode/QR scanning — hardware integration deferred
- Multi-facility support — single facility (Melodija) only

## Context

- UI is entirely in Latvian
- Two physical storage types: A (centralized bulk warehouse) and B (per-resident bedside/cabinet)
- Supplier 1 provides XML catalog (updated daily) and XML invoices — automated in production, UI mockup in prototype
- Supplier 2 has a different catalog format and sometimes delivers with paper invoices that staff must enter manually
- Supplier 2 items go to both A and B storage
- Relatives can bring personal medical items directly for a resident — tracked but not billed
- Foreign medications from abroad aren't in the national (Latvian) medication database, so they can't be looked up — must be added by hand
- Existing inventory domain logic lives in `src/domain/inventoryHelpers.js` with validation in `inventoryValidation.js`
- Existing inventory components in `src/components/inventory/`
- Existing views: `InventoryDashboardView.jsx` (A), `ResidentInventoryView.jsx` (B)

## Constraints

- **Tech stack**: React 18 + Vite + Tailwind CSS + localStorage — no changes to stack
- **Prototype**: UI mockups for import flows, not actual XML parsing
- **Data**: All data in localStorage with `adorable-` prefixed keys
- **Demo-ready**: Must support full walkthrough for stakeholder demos
- **Language**: All UI labels and messages in Latvian

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| UI mockup for XML imports (not real parsing) | Prototype stage — real parsing needs backend | — Pending |
| Multi-supplier in A, all sources tracked in B | Matches physical reality of how care homes operate | — Pending |
| Pick-from-catalog + free-text for manual entry | Staff need speed (pick known items) and flexibility (add unknown items) | — Pending |
| Relative-brought items tracked at zero cost | Items exist physically but aren't on facility invoices | — Pending |

---
*Last updated: 2026-01-29 after initialization*
