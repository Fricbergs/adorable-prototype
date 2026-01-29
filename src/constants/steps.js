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
  // Resident steps (unified)
  RESIDENT_LIST: 'resident-list',           // Unified resident selection list
  RESIDENT_PROFILE: 'resident-profile',     // Full resident profile with tabs (Profile, Prescriptions, etc.)
  PRESCRIPTION_PRINT: 'prescription-print', // Print-optimized prescription view
  RESIDENT_REPORTS: 'resident-reports',     // Resident statistics reports (AD-79)
  // Inventory (Noliktava) steps
  INVENTORY_DASHBOARD: 'inventory-dashboard',      // Bulk warehouse (A) view
  RESIDENT_INVENTORY_LIST: 'resident-inventory-list', // Resident selection for inventory
  RESIDENT_INVENTORY: 'resident-inventory',        // Resident inventory (B) view
  INVENTORY_REPORTS: 'inventory-reports',          // Inventory reports
  // Supplier Management
  SUPPLIER_LIST: 'supplier-list',                    // Supplier management list
  SUPPLIER_CATALOG: 'supplier-catalog',              // Supplier product catalog browser
  // Room Management steps
  ROOM_MANAGEMENT: 'room-management',              // Room/bed management dashboard
  // Bed Booking steps (in agreement flow)
  BED_BOOKING: 'bed-booking',                      // Bed selection during agreement
  // Contract steps
  CONTRACT_LIST: 'contract-list',                  // Contract management list
  CONTRACT_CREATE: 'contract-create',              // Create new contract
  CONTRACT_VIEW: 'contract-view',                  // View contract details
  CONTRACT_PRINT: 'contract-print',                // Print contract document
  // Settings
  SETTINGS: 'settings',                            // System settings
  IMPORT_HISTORY: 'import-history',                // Import history timeline
  // Group Activities
  GROUP_ACTIVITIES: 'group-activities'             // Group activities management
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
