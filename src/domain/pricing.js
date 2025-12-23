// Pricing data from Excel (EUR per day)
export const PRICING_TABLE = {
  melodija: {
    long: {
      double: { 1: 48, 2: 51, 3: 58, 4: 63 },
      single: { 1: 65, 2: 70, 3: 77, 4: 87 }
    },
    short: {
      double: { 1: 51, 2: 55, 3: 63, 4: 67 },
      single: { 1: 69, 2: 74, 3: 82, 4: 95 }
    }
  },
  sampeteris: {
    long: {
      double: { 1: 51, 2: 55, 3: 62, 4: 67 },
      single: { 1: 69, 2: 74, 3: 82, 4: 94 }
    },
    short: {
      double: { 1: 55, 2: 58, 3: 67, 4: 71 },
      single: { 1: 73, 2: 80, 3: 88, 4: 101 }
    }
  }
};

/**
 * Calculate price based on consultation parameters
 * Hardcoded to Adoro Šampēteris pricing
 * @param {Object} params - Consultation parameters
 * @param {string} params.careLevel - Care level ('1', '2', '3', or '4')
 * @param {string} params.duration - Duration ('long' or 'short')
 * @param {string} params.roomType - Room type ('single' or 'double')
 * @returns {number|null} Price per day in EUR, or null if parameters incomplete
 */
export const calculatePrice = ({ careLevel, duration, roomType }) => {
  if (!careLevel || !duration || !roomType) {
    return null;
  }

  // Hardcoded to Šampēteris facility
  const facility = 'sampeteris';
  return PRICING_TABLE[facility]?.[duration]?.[roomType]?.[careLevel] ?? null;
};
