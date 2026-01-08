# Zāļu noliktava (Medication Inventory)

**ClickUp Task:** AD-69 (Sadaļa "Zāļu noliktava")
**Status:** To Do

---

## Overview

Medication inventory management system for tracking purchased and delivered medications - types, quantities, and costs.

### Medication Sources
1. **Adoro pasūtījums** - Adoro orders medications
2. **Klienta atnestās** - Client brings medications for resident

### Resident Medication Mix
- Only Adoro-ordered
- Only client-provided
- Mix of both sources

---

## Business Rules

### Billing Model (Current)
```
Adoro bills by PURCHASE, not by consumption.

When medications are purchased for a resident:
- Full purchase cost is added to monthly invoice
- Regardless of actual consumption
- If resident leaves: remaining medications returned to client
- If resident dies: medications returned to client OR kept by residence
```

### Future Model
Adoro wants to transition to billing by consumption (not implemented yet).

---

## Subsections

### 1. XML rēķinu apstrāde (XML Invoice Processing)
**ClickUp ID:** AD-70 | **Status:** To Do

Processing of pharmacy XML invoices to import medication data.

### 2. Manuāla zāļu ievade (Manual Medication Entry)
**ClickUp ID:** AD-71 | **Status:** To Do

Manual entry of medications (e.g., client-provided).

---

## Integration Points

### With Ordinācijas plāns (Prescriptions)
From AD-69 description:
```
Ilgtermiņā - Ordinācijas plāns mijiedarbosies ar zāļu noliktavu,
jo pēc Ordinācijas plāna izpildes (rezidents pieņēma / nepieņēma zāles)
ir jāsamazina zāļu noliktavas atlikumi.
```

Long-term: Prescription execution (given/refused) should decrease inventory.

### With Billing
```
Atkarībā no zāļu piegādes veida, zāļu izmaksas ir/nav jāpievieno rēķinam.
Rēķinos tiek iekļautas: Adoro pasūtītas zāles, pilnā apmērā pēc pasūtījuma
```

Only Adoro-ordered medications are billed to client.

---

## Prototype Status

### Built
- InventoryDashboardView.jsx - Bulk inventory overview
- ResidentInventoryView.jsx - Per-resident inventory
- BulkInventoryTable.jsx - Bulk inventory table
- ResidentInventoryTable.jsx - Resident inventory table
- XmlImportModal.jsx - XML import functionality
- ExternalReceiptModal.jsx - External receipt entry
- TransferModal.jsx - Transfer between bulk and resident
- InventoryAlerts.jsx - Low stock alerts
- InventoryStatusBadge.jsx - Status indicators

### Features in Prototype
- Bulk inventory management
- Per-resident inventory tracking
- XML import for pharmacy invoices
- Manual medication entry
- Transfer from bulk to resident
- Low stock alerts
- Inventory status badges

### Missing from Prototype
- Automatic inventory decrease on prescription execution
- Full billing integration
- Medication return tracking
- Cost accounting
- Supplier management

---

## Data Model

### Bulk Inventory Item
```
- Medication name
- Quantity
- Unit (mg, g, gab., ml)
- Cost per unit
- Supplier
- Batch number
- Expiry date
```

### Resident Inventory Item
```
- Medication name
- Quantity assigned
- Source (Adoro / Client)
- Link to bulk item (if Adoro)
- Prescription reference
```

---

## Open Questions

From AD-17 subtasks:
- **AD-67:** Vai Ordinācijas plāns ir jāspēj printēt?
- **AD-68:** Nepieciešamās zāļu mērvienības (mg, g, gab., ...)

---

*Source: ClickUp AD-69 and subtasks*
