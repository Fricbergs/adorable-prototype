# Coding Conventions

**Analysis Date:** 2026-01-29

## Naming Patterns

**Files:**
- React components: PascalCase with .jsx extension (e.g., `RefusalModal.jsx`, `TimeSlotCell.jsx`)
- Helper/utility files: camelCase with .js extension (e.g., `prescriptionHelpers.js`, `leadHelpers.js`)
- Constants files: camelCase with .js extension (e.g., `prescriptionConstants.js`, `departmentConstants.js`)
- Test files: match source file name with `.test.js` or `.spec.js` suffix (e.g., `validation.test.js`, `inventoryScheduler.test.js`)

**Functions:**
- Exported functions use camelCase (e.g., `validatePrescription`, `getAllResidents`, `generateLeadId`)
- Helper functions that derive data start with verb prefix: `get*`, `validate*`, `create*`, `update*`, `delete*`, `log*` (e.g., `getFloorFromRoom`, `getAllPrescriptions`, `createProspect`)
- Higher-order/HOC functions use camelCase starting with lowercase (e.g., `getEmptyPrescriptionForm`)
- Internal functions (not exported) also use camelCase with descriptive names (e.g., `getReasonText`, `getActualDose`)

**Variables:**
- Local state variables: camelCase (e.g., `searchQuery`, `selectedFloor`, `actionType`, `newDose`, `isSaving`)
- Boolean flags start with `is` or `has`: `isActionTaken`, `isSaving`, `hasEnabledSlot`, `showSuccess`
- Object destructuring preferred over dot notation for cleaner code (e.g., `const { time, dose, unit } = schedule`)
- Constants within functions use UPPER_SNAKE_CASE for immutable values (e.g., `CURRENT_USER`, `EMAIL_REGEX`, `PHONE_REGEX`)

**Types/Objects:**
- Object keys use camelCase (e.g., `medicationName`, `prescribedDate`, `residentId`)
- Status/enum values use lowercase with underscores when multi-word: `as_needed`, `specific_days`, `auto_dispense`
- Computed/derived values in selectors: prefix with derived intention (e.g., `filteredResidents`, `filterOptions`)

**Imports:**
- Destructured imports grouped by type:
  1. React/Framework imports first
  2. Component imports second (relative paths starting with `../`)
  3. Domain/helper imports third
  4. Constants imports last
- Example from `src/views/ResidentListView.jsx`:
  ```javascript
  import { useState, useEffect, useMemo } from 'react';
  import { ArrowLeft, Search, User, ... } from 'lucide-react';
  import PageShell from '../components/PageShell';
  import { getActiveResidents } from '../domain/residentHelpers';
  import { DEPARTMENTS, FLOOR_DEPARTMENT_MAP } from '../constants/departmentConstants';
  ```

## Code Style

**Formatting:**
- Indentation: 2 spaces (implicit from codebase)
- Max line length: No strict limit but prefer readability
- Semicolons: Required at end of statements
- Trailing commas: Used in multi-line objects and arrays

**Linting:**
- No ESLint or Prettier config detected
- Code follows implicit conventions observed across files

## Function Design

**Size:**
- Functions typically 20-50 lines; larger functions (100+ lines) are acceptable for complex workflows
- Use helper functions to break down repetitive logic

**Parameters:**
- Prefer object destructuring for multiple parameters (e.g., `{ resident, prescription, timeSlot, onSave, onClose }`)
- Simple functions with 1-2 params use direct parameters
- Default parameters: used for optional values (e.g., `reason = ''`)

**Return Values:**
- Functions return objects with consistent structure: `{ isValid, errors }` for validation, `null` for "not found" cases
- CRUD operations return the modified object on success or `null` on failure
- Functions that process events return the result object or `null`

## Module Design

**Exports:**
- Export functions that are reused across components
- Helper functions grouped logically within files (e.g., all resident CRUD in one section, prescriptions CRUD in another)
- Constants exported as named exports: `export const CONSTANT_NAME = ...`
- Functions exported as named exports: `export function functionName() {}`

**Barrel Files:**
- Not used in this codebase; imports are direct from source files

**Comments:**
- Inline comments used sparingly; code clarity preferred
- Section separators used: `// ============ SECTION NAME ============`
- Example in `src/domain/prescriptionHelpers.js`:
  ```javascript
  // ============ RESIDENTS ============
  export function getAllResidents() { ... }

  // ============ PRESCRIPTIONS ============
  export function getAllPrescriptions() { ... }
  ```

## JSDoc/Documentation

**Usage:**
- JSDoc blocks used for public/exported functions, especially in helper files
- Multi-line comments for complex logic or special cases
- Format: Standard JSDoc with `@param`, `@returns`, `@example` tags
- Example from `src/domain/prescriptionHelpers.js`:
  ```javascript
  /**
   * Pause a prescription temporarily until a specific date
   * @param {string} prescriptionId - ID of prescription to pause
   * @param {string} untilDate - Date to resume (YYYY-MM-DD format)
   * @param {string} reason - Optional reason for pause
   * @returns {Object|null} Updated prescription or null
   */
  export function pausePrescription(prescriptionId, untilDate, reason = '') { ... }
  ```

## Error Handling

**Patterns:**
- Try/catch used for external service calls or risky operations (e.g., lazy-loading modules)
- Validation returns error objects: `{ isValid: false, errors: { fieldName: 'Error message' } }`
- Null coalescing used for missing data: `data.value || 'default'`
- Optional chaining for nested properties: `data?.value?.nested`
- Guard clauses for early returns: `if (!value) return null;`

**Error Messages:**
- All error messages in Latvian (e.g., `'Vārds ir obligāts'`, `'Niederīgs e-pasta formāts'`)
- Messages are field-specific and actionable

**Example validation from `src/domain/validation.js`:**
```javascript
export const validateLeadForm = (leadData) => {
  const errors = {};

  if (!leadData.firstName?.trim()) {
    errors.firstName = 'Vārds ir obligāts';
  }

  return errors;
};
```

## Logging

**Framework:** No formal logging framework; uses `console.log()` for informational messages

**Patterns:**
- Informational logs use square bracket prefix: `console.log('[ModuleName] Message')`
- Example: `console.log('[PrescriptionHelpers] Inventory scheduler not loaded')`
- Used for debugging external module loading and state changes
- No production logs in components (console calls only in domain/helpers)

## Import Organization

**Order:**
1. React/React-like imports (React, hooks, libraries)
2. Third-party components (lucide-react icons)
3. Local components (relative paths)
4. Domain/helper modules (relative paths)
5. Constants (relative paths)

**Path Aliases:**
- Not used; all imports are relative paths from file location
- Example: `import PageShell from '../components/PageShell'`

## React Component Conventions

**Functional Components:**
- All components are functional components (no class components)
- Named exports preferred: `export default function ComponentName() { ... }`
- Props destructured in parameters when 2+ props

**Hooks:**
- `useState` for local component state
- `useEffect` for side effects with dependency arrays
- `useMemo` for expensive computations with proper dependencies
- `useCallback` rarely used (not detected in codebase)

**Example from `src/components/prescriptions/RefusalModal.jsx`:**
```javascript
export default function RefusalModal({
  resident,
  prescription,
  timeSlot,
  onSave,
  onClose
}) {
  const [actionType, setActionType] = useState('given');
  const [newDose, setNewDose] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scheduleInfo?.unit) {
      setNewUnit(scheduleInfo.unit);
    }
  }, [scheduleInfo]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
}
```

## Constants

**Structure:**
- Grouped by feature/domain (e.g., `prescriptionConstants.js`, `departmentConstants.js`)
- Export as named constants for reusability
- Objects for related values with `value`, `label`, `color` properties

**Example from `src/constants/prescriptionConstants.js`:**
```javascript
export const TIME_SLOTS = {
  morning: { key: 'morning', label: 'Rīts', defaultTime: '08:00', order: 1 },
  noon: { key: 'noon', label: 'Diena', defaultTime: '12:00', order: 2 },
  evening: { key: 'evening', label: 'Vakars', defaultTime: '18:00', order: 3 },
  night: { key: 'night', label: 'Nakts', defaultTime: '21:00', order: 4 }
};

export const ADMINISTRATION_STATUS = {
  given: { value: 'given', label: 'Iedota', color: 'green' },
  increased: { value: 'increased', label: 'Palielināta', color: 'blue' },
  refused: { value: 'refused', label: 'Atteicās', color: 'red' }
};
```

---

*Convention analysis: 2026-01-29*
