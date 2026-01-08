# Gultu fonds (Bed Fund / Room Management)

**ClickUp Task:** AD-60 (Sadaļa "Gultu fonds")
**Status:** To Do

---

## Overview

Section for managing bed capacity, room inventory, and occupancy across care facilities.

### Main Tasks (from ClickUp)
1. Gultas vietu / istabu datubāzes izveidošana
2. Sadaļa "Gultu fonds" UI izveide

---

## Subsections

### 1. Gultas vietu datubāzes izveidošana (Bed Database)
**ClickUp ID:** AD-61 | **Status:** To Do

Database structure for rooms and beds.

### 2. UI sadaļai "Gultu fonds"
**ClickUp ID:** AD-62 | **Status:** To Do

User interface for bed fund section.

**Subtask:**
- AD-63: Dizains - validēt ar Adoro dizainu | To Do

---

## Data Structure

### Residences
- Melodija
- Šampēteris

### Room Attributes
- Room number
- Floor / Care sector
- Room type (single, shared)
- Bed count
- Pricing tier

### Bed Attributes
- Bed number within room
- Occupancy status (available, occupied, reserved, maintenance)
- Current resident (if occupied)
- Reservation details (if reserved)

---

## Prototype Status

### Built
- RoomManagementView.jsx - Room overview with cards
- RoomCard.jsx - Individual room display
- RoomStatusBadge.jsx - Occupancy status indicator
- RoomEditModal.jsx - Room editing
- BedBookingView.jsx - Bed reservation during onboarding

### Features in Prototype
- Room grid view by floor
- Bed availability visualization
- Room type filtering
- Occupancy status badges

### Missing from Prototype
- Full bed database management
- Room/bed pricing configuration
- Bed maintenance scheduling
- Historical occupancy tracking
- Capacity reporting

---

## Related Tasks

| Task ID | Name | Status |
|---------|------|--------|
| AD-59 | Gultas vietu datubāzes izveide | To Do |
| AD-61 | Gultas vietu datubāzes izveidošana | To Do |
| AD-62 | UI sadaļai "Gultu fonds" | To Do |
| AD-63 | Dizains: validēt ar Adoro | To Do |

---

## Attachments (from ClickUp)

- **Adoro istabu pagaidu saraksts.csv** - Temporary room list
- **Cenrādis 2026 Adorable.xlsx** - 2026 pricing

---

## Integration Points

1. **Administrācija** - Bed selection during onboarding
2. **Rezidenti** - Izmitināšana (Accommodation) tab
3. **Atskaites** - Room report, Resident days report

---

*Source: ClickUp AD-60 and subtasks*
