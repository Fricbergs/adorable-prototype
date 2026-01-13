/**
 * Discount Constants
 * Defines available discounts during contract creation
 * Per 2026-01-12: Only 10% discount with 2 possible reasons
 */

export const DISCOUNT_PERCENT = 10;

export const DISCOUNT_REASONS = {
  doctor_family: {
    value: 'doctor_family',
    label: 'Ārsta ģimenes loceklis',
    description: 'Atlaide daktera ģimenei vai pašiem darbiniekiem'
  },
  second_person: {
    value: 'second_person',
    label: 'Otrā persona no ģimenes',
    description: 'Atlaide otrajam cilvēkam, kas slēdz līgumu (vīrs/sieva, māsa/brālis u.c.)'
  }
};

// Discount reason options for dropdown
export const DISCOUNT_REASON_OPTIONS = Object.values(DISCOUNT_REASONS);

/**
 * Calculate discounted price
 * @param {number} basePrice - Original daily rate
 * @returns {number} Discounted price
 */
export function calculateDiscountedPrice(basePrice) {
  return basePrice * (1 - DISCOUNT_PERCENT / 100);
}

/**
 * Get discount label
 * @param {string} reasonValue - Discount reason value
 * @returns {string} Human-readable label
 */
export function getDiscountReasonLabel(reasonValue) {
  return DISCOUNT_REASONS[reasonValue]?.label || reasonValue;
}
