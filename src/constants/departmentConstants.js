/**
 * Department constants for care facility organization
 * Dementia department requires special rooms with additional security measures
 */

export const DEPARTMENTS = {
  regular: {
    value: 'regular',
    label: 'Parastā nodaļa',
    description: 'Standarta aprūpes nodaļa'
  },
  dementia: {
    value: 'dementia',
    label: 'Demences nodaļa',
    description: 'Nodaļa ar papildu drošības pasākumiem'
  }
};

// Default department assignment by floor
// Floor 3 = dementia department, others = regular
export const FLOOR_DEPARTMENT_MAP = {
  1: 'regular',
  2: 'regular',
  3: 'dementia'
};

// Get department for a room based on floor
export function getDepartmentForFloor(floor) {
  return FLOOR_DEPARTMENT_MAP[floor] || 'regular';
}

// Department filter options for UI
export const DEPARTMENT_FILTER_OPTIONS = [
  { value: 'all', label: 'Visas nodaļas' },
  { value: 'regular', label: 'Parastā nodaļa' },
  { value: 'dementia', label: 'Demences nodaļa' }
];
