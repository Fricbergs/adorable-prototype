# Adorable Client Intake Prototype - Bugbot Configuration

## Project Overview
Client intake management system for elderly care facilities (Adoro Melodija & Sampeteris). **Frontend-only React prototype** with localStorage persistence.

## Tech Stack
- **Framework**: React 18.3.1 (no backend/API)
- **Build Tool**: Vite 6.0.1
- **Styling**: Tailwind CSS 3.4.15
- **Icons**: Lucide React 0.454.0
- **Testing**: Vitest 4.0.16
- **State**: React useState + localStorage
- **Future**: Will integrate with Optima ERP / backend

## Critical Areas

### Data Validation (Frontend)
- ✅ **Email validation**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- ✅ **Phone validation**: `/^[\+]?[0-9\s\(\)\-\.]{7,20}$/` (supports +371 format)
- ✅ **Required fields**: firstName, lastName, email, phone
- ⚠️ **No XSS protection yet** - add sanitization before backend integration

### Null Safety
- Always check `savedLead` before accessing consultation data
- Use optional chaining: `savedLead?.consultation?.price`
- Personal codes, dates can be null in data structure
- Default values for checkboxes: `hasDementia || false`

### Permission Checks
- Currently single-user (Admin badge hardcoded)
- TODO: Add role-based access when backend is integrated
- Consider: view-only vs edit permissions per user

## Latvian-specific Formatting

### Data Formats
- **Phone**: +371 XXXXXXXX (validated by regex)
- **Dates**: ISO format in state (YYYY-MM-DD), displayed as needed
- **Time**: Latvian format via `toLocaleTimeString('lv-LV')`
- **Personal codes**: Not yet implemented (format: XXXXXX-XXXXX)
- **Currency**: EUR (€) always, formatted as "XX €"

### UI Language
- All UI text in Latvian
- Code in English (variables, functions, comments)
- Form labels and errors in Latvian

## Architecture

### File Structure
```
src/
├── App.jsx                 # Main orchestrator (211 lines)
├── domain/                 # Business logic (pure functions, TESTABLE)
│   ├── pricing.js         # Pricing calculations
│   ├── validation.js      # Form validation with regex
│   └── leadHelpers.js     # Lead lifecycle management
├── components/            # Reusable UI components
│   ├── FormInput.jsx      # Enhanced input with validation feedback
│   ├── EditLeadModal.jsx  # Modal for editing contact info
│   ├── EditConsultationModal.jsx # Modal for editing consultation
│   ├── LeadAvatar.jsx     # Avatar with initials
│   ├── StatusBadge.jsx    # Status indicators
│   ├── InfoNotice.jsx     # Colored info boxes
│   ├── BackButton.jsx     # Navigation
│   ├── PageShell.jsx      # Layout wrapper
│   └── ProgressBar.jsx    # Multi-step progress indicator
├── views/                 # Page-level components
│   ├── NewLeadForm.jsx
│   ├── LeadDetailsView.jsx
│   ├── ConsultationStep.jsx
│   ├── WaitingForDecision.jsx
│   ├── AgreementSuccess.jsx
│   ├── QueueSuccess.jsx
│   └── AllLeadsView.jsx
├── hooks/
│   └── useLocalStorage.js # Persistence hooks
└── constants/
    └── steps.js           # STEPS and STATUS constants
```

### Design Patterns

1. **State Management**: Single source of truth in App.jsx
2. **Separation of Concerns**: Domain logic separate from UI
3. **Pure Functions**: All domain logic testable without React
4. **Composition**: Small, reusable components
5. **Controlled Components**: All form inputs controlled by React state

## Data Flow & State

### Lead Lifecycle
```
prospect → lead → agreement/queue
```

1. **prospect**: Form submitted, basic info saved
2. **lead**: Consultation completed, waiting for decision
3. **agreement/queue**: Final decision made

### State Shape (Important for Null Safety)
```javascript
{
  id: 'L-YYYY-XXX',           // Generated, never null
  firstName: string,          // Required, never null
  lastName: string,           // Required, never null
  email: string,              // Required, validated
  phone: string,              // Required, validated
  comment: string,            // Optional, can be empty
  status: 'prospect' | 'lead' | 'agreement' | 'queue',
  createdDate: string,        // ISO format, generated
  createdTime: string,        // HH:MM format, generated
  source: 'manual',           // Always 'manual' in prototype
  assignedTo: string,         // Default: 'Kristens Blūms'
  consultation?: {            // ⚠️ Can be undefined! Always check
    facility: 'melodija' | 'sampeteris',
    careLevel: '1' | '2' | '3' | '4',
    duration: 'long' | 'short',
    roomType: 'single' | 'double',
    notes: string,            // Optional, can be empty
    contactSource: 'resident' | 'relative',
    hasDementia: boolean,     // Default: false
    price: number             // Calculated, never null when consultation exists
  }
}
```

## Code Patterns to Watch

### ✅ Good Patterns

```javascript
// Null-safe consultation access
const price = savedLead?.consultation?.price;
if (savedLead && savedLead.consultation) {
  // Safe to access
}

// Validation before state update
const errors = validateLeadForm(formData);
if (isValidForm(errors)) {
  // Proceed
}

// Pure function pricing
const price = calculatePrice({ facility, careLevel, duration, roomType });

// Proper modal pattern
{showModal && <Modal onClose={() => setShowModal(false)} />}
```

### ❌ Anti-Patterns to Avoid

```javascript
// BAD: Direct access without null check
const price = savedLead.consultation.price; // Can crash!

// BAD: Mutating state directly
savedLead.consultation.price = 100; // Never do this

// BAD: Setting state in render
if (condition) setState(newValue); // Use useEffect

// BAD: Missing default for checkboxes
checked={consultation.hasDementia} // Should be || false
```

## High-Risk Operations

Since this is a prototype without backend, risks are limited, but consider:

1. **localStorage Overflow**: Browser limits ~5-10MB
2. **Data Loss**: User clears browser data
3. **No Encryption**: Sensitive data in plain localStorage
4. **No Backup**: No server-side persistence yet

### Before Production (Backend Integration)
- [ ] Add authentication/authorization
- [ ] Encrypt sensitive data in transit (HTTPS)
- [ ] Sanitize all inputs (XSS protection)
- [ ] Add audit trail for data changes
- [ ] Implement proper error handling
- [ ] Add data export/backup functionality
- [ ] Personal code validation (XXXXXX-XXXXX)

## Testing

### Run Tests
```bash
npm test          # Watch mode
npm run test:ui   # Visual UI
npm run test:run  # CI mode
```

### Coverage
- ✅ 44 tests passing
- ✅ Full domain logic coverage (pricing, validation, leadHelpers)
- ⚠️ No component tests yet (consider React Testing Library)
- ⚠️ No E2E tests yet (consider Playwright)

### Test Patterns
```javascript
// Domain logic tests (existing)
expect(calculatePrice({...})).toBe(65);
expect(validateLeadForm({...})).toEqual({});

// TODO: Component tests
render(<NewLeadForm {...props} />);
expect(screen.getByRole('button')).toBeInTheDocument();
```

## Common Tasks

### Add New Validation Rule
1. Update `src/domain/validation.js` with pure function
2. Add test in `validation.test.js`
3. Update `FormInput` component display logic
4. Update BUGBOT.md with new rule

### Add New View/Screen
1. Create in `src/views/YourView.jsx`
2. Import in `App.jsx`
3. Add to step constants if needed
4. Update ProgressBar logic if affects flow
5. Add tests for any domain logic

### Modify Pricing Structure
1. Update `PRICING_TABLE` in `src/domain/pricing.js`
2. Update tests in `pricing.test.js` (REQUIRED)
3. Update documentation if logic changes
4. Verify price display in all views

### Add New Checkbox/Flag
1. Add to consultation state initialization in `App.jsx`
2. Add to `ConsultationStep.jsx` UI
3. Add to `EditConsultationModal.jsx`
4. Add indicator to `WaitingForDecision.jsx`
5. Update state shape documentation above

## Special Considerations

### Progress Bar Logic (CRITICAL)
- **Status 'prospect'**: Step 1 active (orange), others gray
- **Status 'lead'**: Steps 1-2 complete (green with checkmarks!), Step 3 active (orange)
- **Status 'agreement/queue'**: All steps show complete

### Contact Source & Dementia Flags
- **contactSource**: Blue badge when 'relative', hidden when 'resident'
- **hasDementia**: Yellow badge with brain icon, indicates special room needs
- Both must persist through edits
- Both show in consultation summary

### localStorage Persistence
- Auto-saves on every lead create/update
- Key: `'adorable-leads'`
- Survives page refresh
- No migration strategy yet (TODO)

## Color Palette (Tailwind)
- **Primary/CTA**: orange-500 (#f97316)
- **Success/Complete**: green-500/600
- **Info**: blue-500/600
- **Warning**: yellow-500/600
- **Error**: red-500/600
- **Neutral**: gray-50 to gray-900

## Known Issues / TODOs

- [ ] No backend integration yet
- [ ] No user authentication
- [ ] No data encryption
- [ ] localStorage has size limits
- [ ] No personal code validation
- [ ] No date picker (uses text input)
- [ ] No file upload for documents
- [ ] No print/PDF functionality
- [ ] No email notifications
- [ ] No calendar integration for appointments

## Integration Notes (Future)

When integrating with backend/Optima ERP:
- Replace `usePersistedLeads` with API calls
- Add authentication layer
- Implement proper error handling (network errors)
- Add loading states
- Consider optimistic updates
- Add data sync conflict resolution
- Migrate localStorage data to backend
- Add webhook support for real-time updates

## Build & Deploy

```bash
npm run dev      # Development server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm test         # Run tests
```

## Documentation Files
- `REFACTORING_SUMMARY.md` - Phase 1 architecture details
- `PHASE2_ENHANCEMENTS.md` - Phase 2 features & enhancements
- `README.md` - Project setup and overview (if exists)

## Git Workflow
- **Branch naming**: `feature/`, `bugfix/`, `refactor/`
- **Commits**: Descriptive, present tense, include tests
- **PRs**: Summary + test plan + screenshots
- **Always include**: Updated tests for logic changes

---

**Project Type**: Frontend Prototype (React SPA)
**Last Updated**: December 22, 2025
**Version**: 1.0.0
**Status**: Production-ready prototype (localStorage)
**Next Phase**: Backend integration with Optima ERP
