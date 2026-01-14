// Prescription form validation for Ordinācijas Plāns

export function validatePrescription(data) {
  const errors = {};

  // Medication name is required
  if (!data.medicationName || data.medicationName.trim() === '') {
    errors.medicationName = 'Medikamenta nosaukums ir obligāts';
  }

  // At least one time slot must be enabled (unless conditional/as_needed)
  if (data.frequency !== 'as_needed') {
    const hasEnabledSlot = Object.values(data.schedule || {}).some(slot => slot?.enabled);
    if (!hasEnabledSlot) {
      errors.schedule = 'Jānorāda vismaz viens lietošanas laiks';
    }
  }

  // Validate enabled time slots have dose and unit
  if (data.schedule) {
    Object.entries(data.schedule).forEach(([slotKey, slot]) => {
      if (slot?.enabled) {
        if (!slot.dose || slot.dose.trim() === '') {
          errors[`schedule.${slotKey}.dose`] = 'Deva ir obligāta';
        } else if (isNaN(parseFloat(slot.dose))) {
          errors[`schedule.${slotKey}.dose`] = 'Devai jābūt skaitlim';
        }

        if (!slot.unit || slot.unit.trim() === '') {
          errors[`schedule.${slotKey}.unit`] = 'Mērvienība ir obligāta';
        }

        if (!slot.time || slot.time.trim() === '') {
          errors[`schedule.${slotKey}.time`] = 'Laiks ir obligāts';
        }
      }
    });
  }

  // Prescribed by is required
  if (!data.prescribedBy || data.prescribedBy.trim() === '') {
    errors.prescribedBy = 'Ārsta vārds ir obligāts';
  }

  // Prescribed date is required
  if (!data.prescribedDate) {
    errors.prescribedDate = 'Ordinēšanas datums ir obligāts';
  }

  // If specific_days frequency, at least one day must be selected
  if (data.frequency === 'specific_days') {
    if (!data.specificDays || data.specificDays.length === 0) {
      errors.specificDays = 'Jānorāda vismaz viena diena';
    }
  }

  // If conditional, condition text is required
  if (data.conditional && (!data.conditionText || data.conditionText.trim() === '')) {
    errors.conditionText = 'Nosacījuma teksts ir obligāts';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateRefusal(data) {
  const errors = {};

  if (!data.refusalReason || data.refusalReason.trim() === '') {
    errors.refusalReason = 'Atteikuma iemesls ir obligāts';
  }

  if (!data.administeredBy || data.administeredBy.trim() === '') {
    errors.administeredBy = 'Jānorāda, kas atzīmēja atteikumu';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateDoseAction(data) {
  const errors = {};

  // Action type is required
  if (!data.actionType) {
    errors.actionType = 'Jānorāda darbības veids';
  }

  // For increased/decreased, new dose is required
  if (data.actionType === 'increased' || data.actionType === 'decreased') {
    if (!data.actualDose || data.actualDose.trim() === '') {
      errors.actualDose = 'Jaunā deva ir obligāta';
    } else if (isNaN(parseFloat(data.actualDose))) {
      errors.actualDose = 'Devai jābūt skaitlim';
    } else if (parseFloat(data.actualDose) <= 0) {
      errors.actualDose = 'Devai jābūt lielākai par 0';
    }
  }

  // Reason is required for all actions
  if (!data.reason || data.reason.trim() === '') {
    errors.reason = 'Iemesls ir obligāts';
  }

  // Administered by is required
  if (!data.administeredBy || data.administeredBy.trim() === '') {
    errors.administeredBy = 'Jānorāda, kas veica darbību';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Field-level validation helpers
export function isValidDose(dose) {
  if (!dose || dose.trim() === '') return false;
  const num = parseFloat(dose);
  return !isNaN(num) && num > 0;
}

export function isValidTime(time) {
  if (!time) return false;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function isValidDate(date) {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

// Form state helpers
export function getEmptyPrescriptionForm(residentId) {
  return {
    residentId,
    medicationName: '',
    activeIngredient: '',
    form: 'tabletes',
    prescribedDate: new Date().toISOString().split('T')[0],
    prescribedBy: 'Dakteris Gints',
    validUntil: '',
    schedule: {
      morning: { time: '08:00', dose: '', unit: 'mg', enabled: false },
      noon: { time: '12:00', dose: '', unit: 'mg', enabled: false },
      evening: { time: '18:00', dose: '', unit: 'mg', enabled: false },
      night: { time: '21:00', dose: '', unit: 'mg', enabled: false }
    },
    instructions: '',
    conditional: false,
    conditionText: '',
    frequency: 'daily',
    specificDays: [],
    notes: ''
  };
}

export function prescriptionToForm(prescription) {
  return {
    ...prescription,
    validUntil: prescription.validUntil || '',
    instructions: prescription.instructions || '',
    conditionText: prescription.conditionText || '',
    notes: prescription.notes || ''
  };
}
