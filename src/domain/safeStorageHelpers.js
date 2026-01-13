/**
 * Safe Storage Helpers
 * Manages safe storage agreements for residents (seifa glabāšana)
 */

const STORAGE_KEY = 'adorable-safe-storage';

/**
 * Get all safe storage agreements
 */
export function getSafeStorageAgreements() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading safe storage agreements:', e);
    return [];
  }
}

/**
 * Get safe storage agreement for a specific resident
 */
export function getSafeStorageForResident(residentId) {
  const agreements = getSafeStorageAgreements();
  return agreements.find(a => a.residentId === residentId) || null;
}

/**
 * Save or update a safe storage agreement
 */
export function saveSafeStorageAgreement(agreement) {
  const agreements = getSafeStorageAgreements();
  const existingIndex = agreements.findIndex(a => a.residentId === agreement.residentId);

  const newAgreement = {
    ...agreement,
    updatedAt: new Date().toISOString()
  };

  if (!newAgreement.createdAt) {
    newAgreement.createdAt = new Date().toISOString();
  }

  if (existingIndex >= 0) {
    agreements[existingIndex] = newAgreement;
  } else {
    agreements.push(newAgreement);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(agreements));
  return newAgreement;
}

/**
 * Delete a safe storage agreement
 */
export function deleteSafeStorageAgreement(residentId) {
  const agreements = getSafeStorageAgreements();
  const filtered = agreements.filter(a => a.residentId !== residentId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Format date for display
 */
export function formatDateLV(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('lv-LV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
