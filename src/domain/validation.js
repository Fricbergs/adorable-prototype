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

/**
 * Validate agreement data completeness
 * Checks if all required fields are present before creating an agreement
 * @param {Object} lead - Lead object with consultation and survey data
 * @returns {Object} { isValid, missingFields: { consultation: [], resident: [], caregiver: [] } }
 */
export const validateAgreementData = (lead) => {
  const consultation = lead?.consultation || {};
  const survey = lead?.survey || {};
  const missingFields = {
    consultation: [],
    resident: [],
    caregiver: []
  };

  // Validate consultation data
  if (!consultation.careLevel) {
    missingFields.consultation.push({ field: 'careLevel', label: 'Aprūpes līmenis' });
  }
  if (!consultation.duration) {
    missingFields.consultation.push({ field: 'duration', label: 'Uzturēšanās tips (ilglaicīgs/īslaicīgs)' });
  }
  if (!consultation.roomType) {
    missingFields.consultation.push({ field: 'roomType', label: 'Istabas tips (vienvietīga/divvietīga/trīsvietīga)' });
  }
  if (!consultation.price) {
    missingFields.consultation.push({ field: 'price', label: 'Cena' });
  }

  // Validate resident data
  if (!survey.firstName?.trim()) {
    missingFields.resident.push({ field: 'firstName', label: 'Vārds' });
  }
  if (!survey.lastName?.trim()) {
    missingFields.resident.push({ field: 'lastName', label: 'Uzvārds' });
  }
  if (!survey.phone?.trim()) {
    missingFields.resident.push({ field: 'phone', label: 'Tālrunis' });
  }
  if (!survey.birthDate) {
    missingFields.resident.push({ field: 'birthDate', label: 'Dzimšanas datums' });
  }
  if (!survey.personalCode?.trim()) {
    missingFields.resident.push({ field: 'personalCode', label: 'Personas kods' });
  }
  if (!survey.gender) {
    missingFields.resident.push({ field: 'gender', label: 'Dzimums' });
  }
  if (!survey.street?.trim()) {
    missingFields.resident.push({ field: 'street', label: 'Iela' });
  }
  if (!survey.city?.trim()) {
    missingFields.resident.push({ field: 'city', label: 'Pilsēta' });
  }
  if (!survey.postalCode?.trim()) {
    missingFields.resident.push({ field: 'postalCode', label: 'Pasta indekss' });
  }
  if (!survey.stayDateFrom) {
    missingFields.resident.push({ field: 'stayDateFrom', label: 'Uzturēšanās sākuma datums' });
  }

  // Validate caregiver data (only if signing scenario is 'relative')
  if (survey.signerScenario === 'relative') {
    if (!survey.clientFirstName?.trim()) {
      missingFields.caregiver.push({ field: 'clientFirstName', label: 'Apgādnieka vārds' });
    }
    if (!survey.clientLastName?.trim()) {
      missingFields.caregiver.push({ field: 'clientLastName', label: 'Apgādnieka uzvārds' });
    }
    if (!survey.relationship) {
      missingFields.caregiver.push({ field: 'relationship', label: 'Radniecība / Statuss' });
    }
    if (!survey.clientPhone?.trim()) {
      missingFields.caregiver.push({ field: 'clientPhone', label: 'Apgādnieka tālrunis' });
    }
    if (!survey.clientEmail?.trim()) {
      missingFields.caregiver.push({ field: 'clientEmail', label: 'Apgādnieka e-pasts' });
    }
    if (!survey.clientPersonalCode?.trim()) {
      missingFields.caregiver.push({ field: 'clientPersonalCode', label: 'Apgādnieka personas kods' });
    }
    if (!survey.clientStreet?.trim()) {
      missingFields.caregiver.push({ field: 'clientStreet', label: 'Apgādnieka iela' });
    }
    if (!survey.clientCity?.trim()) {
      missingFields.caregiver.push({ field: 'clientCity', label: 'Apgādnieka pilsēta' });
    }
    if (!survey.clientPostalCode?.trim()) {
      missingFields.caregiver.push({ field: 'clientPostalCode', label: 'Apgādnieka pasta indekss' });
    }
  }

  // Check if validation passed
  const isValid =
    missingFields.consultation.length === 0 &&
    missingFields.resident.length === 0 &&
    missingFields.caregiver.length === 0;

  return {
    isValid,
    missingFields
  };
};
