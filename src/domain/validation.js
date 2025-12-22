// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports Latvian format and international)
// Accepts: +37120000000, +371 20000000, +1 (555) 123-4567, etc.
const PHONE_REGEX = /^[\+]?[0-9\s\(\)\-\.]{7,20}$/;

/**
 * Validate lead form data
 * @param {Object} leadData - Lead form data
 * @param {string} leadData.firstName - First name
 * @param {string} leadData.lastName - Last name
 * @param {string} leadData.email - Email address
 * @param {string} leadData.phone - Phone number
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateLeadForm = (leadData) => {
  const errors = {};

  // First name validation
  if (!leadData.firstName?.trim()) {
    errors.firstName = 'Vārds ir obligāts';
  }

  // Last name validation
  if (!leadData.lastName?.trim()) {
    errors.lastName = 'Uzvārds ir obligāts';
  }

  // Email validation
  if (!leadData.email?.trim()) {
    errors.email = 'E-pasts ir obligāts';
  } else if (!EMAIL_REGEX.test(leadData.email.trim())) {
    errors.email = 'Nederīgs e-pasta formāts';
  }

  // Phone validation
  if (!leadData.phone?.trim()) {
    errors.phone = 'Telefons ir obligāts';
  } else if (!PHONE_REGEX.test(leadData.phone.trim())) {
    errors.phone = 'Nederīgs tālruņa numurs';
  }

  return errors;
};

/**
 * Check if form validation passed (no errors)
 * @param {Object} errors - Errors object from validateLeadForm
 * @returns {boolean} True if no errors, false otherwise
 */
export const isValidForm = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Validate individual field and return error or null
 * @param {string} fieldName - Name of the field
 * @param {string} value - Value to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value) => {
  const trimmedValue = value?.trim();

  switch (fieldName) {
    case 'firstName':
      return !trimmedValue ? 'Vārds ir obligāts' : null;

    case 'lastName':
      return !trimmedValue ? 'Uzvārds ir obligāts' : null;

    case 'email':
      if (!trimmedValue) {
        return 'E-pasts ir obligāts';
      }
      return !EMAIL_REGEX.test(trimmedValue) ? 'Nederīgs e-pasta formāts' : null;

    case 'phone':
      if (!trimmedValue) {
        return 'Telefons ir obligāts';
      }
      return !PHONE_REGEX.test(trimmedValue) ? 'Nederīgs tālruņa numurs' : null;

    default:
      return null;
  }
};

/**
 * Get validation status for a field
 * @param {string} fieldName - Name of the field
 * @param {string} value - Current value
 * @param {boolean} touched - Whether field has been touched
 * @returns {Object} { isValid, error, showSuccess }
 */
export const getFieldStatus = (fieldName, value, touched = false) => {
  const error = validateField(fieldName, value);
  const isValid = error === null && !!value?.trim();
  const showSuccess = touched && isValid;

  return {
    isValid,
    error,
    showSuccess
  };
};
