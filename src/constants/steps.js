/**
 * Step constants for navigation
 */
export const STEPS = {
  FORM: 'form',
  LEAD_VIEW: 'lead-view',
  CONSULTATION: 'consultation',
  WAITING: 'waiting',
  SURVEY: 'survey',                  // Admin fills survey data (all legal/personal details)
  OFFER_CUSTOMER: 'offer-customer',  // Customer-facing offer form (mock email view) - FUTURE USE
  OFFER_REVIEW: 'offer-review',      // Admin reviews filled survey data
  AGREEMENT: 'agreement',
  QUEUE: 'queue',                    // Queue success view (after adding to queue)
  QUEUE_LIST: 'queue-list',          // Queue management list view
  LIST: 'list',
  // Prescription (Ordinācijas) steps
  RESIDENT_LIST: 'resident-list',           // Resident selection list
  RESIDENT_PRESCRIPTIONS: 'resident-prescriptions', // Resident prescription view
  PRESCRIPTION_PRINT: 'prescription-print',  // Print-optimized prescription view
  // Inventory (Noliktava) steps
  INVENTORY_DASHBOARD: 'inventory-dashboard',      // Bulk warehouse (A) view
  RESIDENT_INVENTORY_LIST: 'resident-inventory-list', // Resident selection for inventory
  RESIDENT_INVENTORY: 'resident-inventory',        // Resident inventory (B) view
  INVENTORY_REPORTS: 'inventory-reports'           // Inventory reports
};

/**
 * Status constants for leads
 *
 * Flow:
 * 1. prospect - Jauns pieteikums (saved application, waiting for consultation)
 * 2. consultation - Konsultācija pabeigta (consultation completed, may include sent offer email)
 * 3. survey_filled - Anketa aizpildīta (survey filled, ready for agreement)
 * 4. agreement - Līgums (agreement created)
 * 5. queue - Rinda (in queue)
 * 6. cancelled - Atcelts (cancelled/rejected application)
 */
export const STATUS = {
  PROSPECT: 'prospect',              // Pieteikums - saved application
  CONSULTATION: 'consultation',      // Konsultācija - consultation completed
  SURVEY_FILLED: 'survey_filled',    // Anketa aizpildīta - survey filled
  AGREEMENT: 'agreement',            // Līgums - agreement created
  QUEUE: 'queue',                    // Rinda - in queue
  CANCELLED: 'cancelled'             // Atcelts - cancelled/rejected
};
