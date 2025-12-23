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
  QUEUE: 'queue',
  LIST: 'list'
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
 */
export const STATUS = {
  PROSPECT: 'prospect',              // Pieteikums - saved application
  CONSULTATION: 'consultation',      // Konsultācija - consultation completed
  SURVEY_FILLED: 'survey_filled',    // Anketa aizpildīta - survey filled
  AGREEMENT: 'agreement',            // Līgums - agreement created
  QUEUE: 'queue'                     // Rinda - in queue
};
