# PRD: Grupu pasākumi - dalībnieku reģistrācija (AD-124)

## Introduction

Add a group activities module that allows staff to register group events (e.g., morning exercises, bingo, crafts) and track which residents participated. This serves three purposes:
1. **Reporting** - Track resident participation in social activities
2. **Invoicing** - Activity data feeds into billing (paid vs free activities with pricing)
3. **Social Care Plan** - Automatically creates entries in each participant's social care record

Additionally, this feature requires a **Settings** section where administrators can define available services (activity types) with their pricing and duration.

## Goals

- Allow any staff member to create group activity records
- Track which residents attended each activity
- Support paid and free activities for invoice line items
- Automatically generate social care plan entries for each participant
- Provide a Settings area for managing service definitions (name, price, duration)

## User Stories

### US-001: Add Settings to admin dropdown
**Description:** As an administrator, I want to access Settings from the admin dropdown so that I can configure system options.

**Acceptance Criteria:**
- [ ] Add "Iestatījumi" (Settings) option to admin dropdown (top right corner)
- [ ] Clicking Settings navigates to /settings route
- [ ] Settings page uses PageShell with appropriate title
- [ ] Typecheck passes

### US-002: Manage services list in Settings
**Description:** As an administrator, I want to manage a list of services (activity types) so that staff can select from predefined options when creating activities.

**Acceptance Criteria:**
- [ ] Settings page has "Pakalpojumi" (Services) section
- [ ] Table shows all services: Nosaukums, Ilgums (duration), Cena (price), Bezmaksas (free checkbox)
- [ ] "Pievienot pakalpojumu" button opens add/edit form
- [ ] Service form fields: Name (required), Duration in minutes (required), Price (required if not free), Free checkbox
- [ ] Can edit existing services (pencil icon)
- [ ] Can delete services (trash icon with confirmation)
- [ ] Services saved to localStorage
- [ ] Typecheck passes

### US-003: Create group activity record
**Description:** As a staff member, I want to create a new group activity record so that I can document what activity took place.

**Acceptance Criteria:**
- [ ] New "Grupu pasākumi" menu item in navigation
- [ ] "Jauns pasākums" (New activity) button opens creation form
- [ ] Form fields:
  - Pakalpojums (Service) - dropdown from Services list (required)
  - Datums (Date) - date picker (required)
  - Laiks (Time) - time picker (optional)
  - Duration auto-fills from selected service (editable)
- [ ] Form has Cancel and Save buttons
- [ ] Activity saves to localStorage with service reference, paid/free flag, and price
- [ ] Typecheck passes

### US-004: Select activity participants
**Description:** As a staff member, I want to select which residents attended the activity so that their participation is recorded.

**Acceptance Criteria:**
- [ ] Resident selection shows full list of all residents
- [ ] Checkboxes to select/deselect participants
- [ ] Search/filter to quickly find residents by name
- [ ] Shows count of selected participants
- [ ] Selected residents saved with activity record
- [ ] Typecheck passes

### US-005: View activity list
**Description:** As a staff member, I want to see a list of all group activities so that I can review past activities.

**Acceptance Criteria:**
- [ ] List view shows all activities sorted by date (newest first)
- [ ] Each row shows: Service name, Date, Time, Duration, Dalībnieki (count), Paid/Free indicator
- [ ] Clicking an activity opens edit view
- [ ] Typecheck passes

### US-006: Edit existing activity
**Description:** As a staff member, I want to edit an activity record so that I can correct mistakes or add late participants.

**Acceptance Criteria:**
- [ ] All fields editable: service, date, time, duration, participants
- [ ] Save updates the existing record
- [ ] Delete button removes the activity (with confirmation)
- [ ] Typecheck passes

### US-007: Generate social care plan entries
**Description:** As a system, I want to automatically create social care entries for each participant so that the activity appears in their care record.

**Acceptance Criteria:**
- [ ] When activity is saved, create entry for each participant
- [ ] Entry has: Date (from activity), Description (activity/service name in textarea format)
- [ ] Simple format matching existing "Sociālā darbinieka atskaites" structure
- [ ] If activity is edited, entries are updated accordingly
- [ ] If participant is removed, their entry is removed
- [ ] Typecheck passes

## Functional Requirements

### Settings & Services
- FR-1: Add "Iestatījumi" to admin dropdown menu (top right)
- FR-2: Settings page at `/settings` route
- FR-3: Services CRUD with fields: id, name, durationMinutes, price, isFree
- FR-4: Save services to localStorage key `adorable-services`

### Group Activities
- FR-5: Add "Grupu pasākumi" navigation item (icon: Users)
- FR-6: Activity record stores: id, serviceId, serviceName, date, time, durationMinutes, isFree, price, participants[], createdAt, createdBy
- FR-7: Activity list view with columns: Pakalpojums, Datums, Laiks, Ilgums, Dalībnieki, Maksas/Bezmaksas
- FR-8: Activity form with service dropdown that auto-fills duration and price/free status
- FR-9: Participant selector shows all residents from `adorable-prescription-residents`
- FR-10: Save activities to localStorage key `adorable-group-activities`

### Invoice Integration
- FR-11: Activity record includes `isFree` boolean and `price` (if paid)
- FR-12: Each participant's activity record serves as invoice line item data:
  - Free activity = line item with €0.00
  - Paid activity = line item with service price

### Social Care Plan
- FR-13: Generate entry per participant with date + description text
- FR-14: Store entries in `adorable-social-care-entries`
- FR-15: Entry structure: { id, residentId, date, description, activityId, createdAt }

## Non-Goals

- No recurring activity templates
- No direct invoice generation UI (data prepared for future integration)
- No resident FEED display (noted as future in ClickUp task)
- No floor/department filtering in participant selection
- No attendance statistics or reports UI
- No service categories

## Technical Considerations

### Data Structures

**Service:**
```js
{
  id: string,
  name: string,           // "Rīta vingrošana"
  durationMinutes: number, // 30
  price: number,          // 5.00 (in EUR)
  isFree: boolean         // true = bezmaksas
}
```

**Activity:**
```js
{
  id: string,
  serviceId: string,
  serviceName: string,    // Denormalized for display
  date: string,           // ISO date
  time: string,           // "09:00" or null
  durationMinutes: number,
  isFree: boolean,
  price: number,          // 0 if free
  participants: string[], // Array of resident IDs
  createdAt: string,
  createdBy: string
}
```

**Social Care Entry:**
```js
{
  id: string,
  residentId: string,
  date: string,           // ISO date
  description: string,    // Free text, e.g., "Grupu pasākums: Rīta vingrošana"
  activityId: string,
  createdAt: string
}
```

### localStorage Keys
- `adorable-services` - Service definitions
- `adorable-group-activities` - Activity records
- `adorable-social-care-entries` - Per-resident care entries

## Design Considerations

- Settings accessible from existing admin dropdown (top right corner)
- Follow existing UI patterns (PageShell, tables, modals)
- Participant selection with checkboxes and search filter
- Match Latvian UI terminology from existing views

## Success Metrics

- Staff can create a group activity with 10+ participants in under 2 minutes
- Activity data structure supports invoice line item generation
- Social care entries automatically created for all participants
- Administrators can manage services without developer assistance

## Resolved Questions

| Question | Answer |
|----------|--------|
| Invoice fields needed? | `isFree` boolean + `price` field. Free = €0 line, Paid = price line |
| Time format? | Single time field + duration (from service, editable) |
| Social care entry format? | Simple: date + description textarea (matches existing form) |
