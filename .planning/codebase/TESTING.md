# Testing Patterns

**Analysis Date:** 2026-01-29

## Test Framework

**Runner:**
- Vitest 4.0.16
- Config: `vitest.config.js`

**Assertion Library:**
- Vitest built-in expect() (from Chai)

**Run Commands:**
```bash
npm run test              # Run tests in watch mode
npm run test:ui          # Run with interactive UI
npm run test:run         # Run tests once and exit
```

## Test File Organization

**Location:**
- Co-located with source files or in `src/tests/unit/` subdirectory
- Pattern: `src/domain/*.test.js`, `src/tests/unit/*.test.js`

**Naming:**
- Files follow source filename with `.test.js` suffix (e.g., `validation.test.js`, `leadHelpers.test.js`)
- Test files use `.test.js` or `.spec.js` extensions (`.test.js` is standard)

**Discovery:**
- Config glob: `src/**/*.{test,spec}.{js,jsx}`
- Environment: Node.js (no browser/DOM required for unit tests)

## Test Structure

**Suite Organization:**
```javascript
import { describe, it, expect } from 'vitest';

describe('Module Name', () => {
  describe('Function Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

**Patterns:**
- Top-level `describe()` for the module/file
- Second-level `describe()` for individual functions
- Leaf-level `it()` for specific behaviors
- Each test follows Arrange-Act-Assert (AAA) pattern

**Example from `src/domain/validation.test.js`:**
```javascript
describe('Validation Module', () => {
  describe('validateLeadForm', () => {
    it('should return no errors for valid data', () => {
      const validData = {
        firstName: 'Anna',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(validData);
      expect(errors).toEqual({});
    });

    it('should require first name', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Bērziņa',
        email: 'anna@example.com',
        phone: '+371 20000000'
      };
      const errors = validateLeadForm(invalidData);
      expect(errors).toHaveProperty('firstName');
      expect(errors.firstName).toBe('Vārds ir obligāts');
    });
  });
});
```

## Setup and Teardown

**beforeEach:**
- Used to clear mocks before each test
- Example from `src/tests/unit/inventoryScheduler.test.js`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('inventoryScheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => { ... });
});
```

**No teardown/afterEach detected** - mocks are cleared at start of each test

## Mocking

**Framework:** Vitest built-in `vi` mock utilities

**Mock Functions:**
```javascript
vi.mock('../../domain/inventoryHelpers', () => ({
  getResidentInventory: vi.fn(),
  getInventoryForPrescription: vi.fn(),
  updateResidentInventoryQuantity: vi.fn(),
  createDispenseLog: vi.fn(),
  getResidentInventoryItem: vi.fn(),
  getAllDispenseLogs: vi.fn()
}));
```

**Mock Return Values:**
```javascript
const mockPrescription = {
  id: 'P1',
  medicationName: 'Aspirin',
  schedule: {
    morning: { enabled: true, dose: '2', unit: 'tabletes' }
  }
};

getPrescriptionById.mockReturnValue(mockPrescription);
```

**Mock Assertions:**
```javascript
expect(updateResidentInventoryQuantity).toHaveBeenCalledWith('INV1', -2);
expect(createDispenseLog).toHaveBeenCalledWith(
  expect.objectContaining({
    quantityDispensed: 2,
    type: DISPENSE_TYPES.auto.value
  })
);
expect(updateResidentInventoryQuantity).not.toHaveBeenCalled();
```

**Mock Clearing:**
```javascript
beforeEach(() => {
  vi.clearAllMocks();  // Reset all mock call counts
});
```

**Patterns:**
- Mocks placed at top of file before imports
- Module mocking for external dependencies
- Function-level mocking with vi.fn()
- Return value setup with mockReturnValue()
- Assertion checking with toHaveBeenCalledWith()

## What to Mock

**DO Mock:**
- External modules/dependencies (e.g., inventoryHelpers, prescriptionHelpers)
- Complex data fetches (localStorage operations in tests)
- API calls or async operations

**DO NOT Mock:**
- Pure functions being tested (e.g., calculateDose, formatDate)
- Validation functions
- Data transformation helpers
- Small utility functions

**Example: What NOT to Mock**
```javascript
// DO NOT mock validateLeadForm - test it directly
export const validateLeadForm = (leadData) => {
  const errors = {};
  if (!leadData.firstName?.trim()) {
    errors.firstName = 'Vārds ir obligāts';
  }
  return errors;
};

// Test it directly without mocking
it('should require first name', () => {
  const errors = validateLeadForm({ firstName: '' });
  expect(errors).toHaveProperty('firstName');
});
```

## Fixtures and Test Data

**Test Data Objects:**
- Inline mock objects created in test (not extracted to separate files)
- Pattern: `const mockObjectName = { ... }` within describe block

**Example from `src/tests/unit/inventoryScheduler.test.js`:**
```javascript
const mockPrescription = {
  id: 'P1',
  medicationName: 'Aspirin',
  schedule: {
    morning: { enabled: true, dose: '2', unit: 'tabletes' }
  }
};

const mockInventoryItem = {
  id: 'INV1',
  medicationName: 'Aspirin',
  quantity: 100
};

// Reused across multiple tests in same describe block
getPrescriptionById.mockReturnValue(mockPrescription);
getResidentInventory.mockReturnValue([mockInventoryItem]);
```

**Location:**
- Fixtures defined inside describe blocks for scope
- Reused fixtures defined at top of nested describe for specific test suite

## Test Types

**Unit Tests:**
- Scope: Individual functions in isolation
- Approach: Direct function calls with test data
- Coverage: `src/domain/*.test.js` files
- Example: Testing validation, CRUD helpers, calculations

**Example from `src/domain/validation.test.js`:**
```javascript
describe('validateLeadForm', () => {
  it('should validate email format', () => {
    const invalidData = {
      firstName: 'Anna',
      lastName: 'Bērziņa',
      email: 'invalid-email',  // No @
      phone: '+371 20000000'
    };
    const errors = validateLeadForm(invalidData);
    expect(errors).toHaveProperty('email');
    expect(errors.email).toBe('Nederīgs e-pasta formāts');
  });
});
```

**Integration Tests:**
- Scope: Multiple functions working together
- Approach: Mock external dependencies, test workflows
- Example from `src/tests/unit/inventoryScheduler.test.js`: Testing that `processAdministrationEvent` correctly calls inventory helpers and creates logs

**Example:**
```javascript
describe('processAdministrationEvent', () => {
  describe('medication given (dispense)', () => {
    it('should deduct inventory when medication is given', () => {
      getPrescriptionById.mockReturnValue(mockPrescription);
      getResidentInventory.mockReturnValue([mockInventoryItem]);
      createDispenseLog.mockReturnValue({ id: 'DL1' });

      const result = processAdministrationEvent({
        prescriptionId: 'P1',
        residentId: 'R1',
        status: 'given',
        timeSlot: 'morning',
        id: 'LOG1'
      });

      expect(updateResidentInventoryQuantity).toHaveBeenCalledWith('INV1', -2);
      expect(createDispenseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          quantityDispensed: 2,
          type: DISPENSE_TYPES.auto.value
        })
      );
      expect(result).toEqual({ id: 'DL1' });
    });
  });
});
```

**E2E Tests:**
- Not detected in codebase
- Could be added with Playwright or Cypress for full workflow testing

## Coverage

**Requirements:**
- No coverage targets enforced
- No .nycrc or coverage config detected

**View Coverage:**
```bash
# Not currently configured
# Would require --coverage flag setup in vitest.config.js
```

## Testing Best Practices Used

**Specific Test Cases for Edge Cases:**
- Empty/null inputs: `processAdministrationEvent(null)` returns null
- Insufficient data: Tests check behavior when inventory is low
- Date/time logic: Tests verify same-day vs different-day handling
- State transitions: Tests verify prescription status changes

**Example: Edge case testing from `src/tests/unit/inventoryScheduler.test.js`:**
```javascript
it('should handle insufficient inventory by dispensing what is available', () => {
  const lowInventory = { ...mockInventoryItem, quantity: 1 };
  getPrescriptionById.mockReturnValue(mockPrescription);
  getResidentInventory.mockReturnValue([lowInventory]);
  createDispenseLog.mockReturnValue({ id: 'DL1' });

  processAdministrationEvent({
    prescriptionId: 'P1',
    residentId: 'R1',
    status: 'given',
    timeSlot: 'morning',
    id: 'LOG1'
  });

  // Should only dispense 1 (available), not 2 (dose)
  expect(updateResidentInventoryQuantity).toHaveBeenCalledWith('INV1', -1);
  expect(createDispenseLog).toHaveBeenCalledWith(
    expect.objectContaining({
      quantityDispensed: 1,
      previousQuantity: 1,
      newQuantity: 0
    })
  );
});
```

**Test Data Completeness:**
- All required fields included in test data objects
- Real data patterns used (e.g., actual Latvian names, valid email formats)

**Boundary Testing:**
```javascript
it('should accept valid email formats', () => {
  const validEmails = [
    'test@example.com',
    'user+tag@domain.co.uk',
    'firstname.lastname@company.com'
  ];

  validEmails.forEach(email => {
    const data = { firstName: 'Anna', ... email ... };
    const errors = validateLeadForm(data);
    expect(errors).not.toHaveProperty('email');
  });
});
```

## Test Files Reference

**Core Test Files:**
- `src/domain/validation.test.js` - Form validation tests (200+ lines)
- `src/domain/leadHelpers.test.js` - Lead creation/upgrade tests (155 lines)
- `src/tests/unit/inventoryScheduler.test.js` - Inventory integration tests (393 lines)
- `src/domain/pricing.test.js` - Pricing calculation tests (assumed to exist)

---

*Testing analysis: 2026-01-29*
