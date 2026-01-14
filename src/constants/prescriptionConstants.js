// Prescription Constants for Ordinācijas Plāns

// Time slots for medication administration
export const TIME_SLOTS = {
  morning: { key: 'morning', label: 'Rīts', defaultTime: '08:00', order: 1 },
  noon: { key: 'noon', label: 'Diena', defaultTime: '12:00', order: 2 },
  evening: { key: 'evening', label: 'Vakars', defaultTime: '18:00', order: 3 },
  night: { key: 'night', label: 'Nakts', defaultTime: '21:00', order: 4 }
};

export const TIME_SLOT_KEYS = ['morning', 'noon', 'evening', 'night'];

// Medication units
export const MEDICATION_UNITS = [
  { value: 'mg', label: 'mg' },
  { value: 'mcg', label: 'mcg' },
  { value: 'ml', label: 'ml' },
  { value: 'U', label: 'U (vienības)' },
  { value: 'piece', label: 'gab.' },
  { value: 'tab', label: 'tab.' },
  { value: 'caps', label: 'kaps.' },
  { value: 'drops', label: 'pilieni' }
];

// Medication forms
export const MEDICATION_FORMS = [
  { value: 'tabletes', label: 'Tabletes' },
  { value: 'kapsulas', label: 'Kapsulas' },
  { value: 'skidrums', label: 'Šķīdums' },
  { value: 'injekcijas', label: 'Injekcijas' },
  { value: 'pilieni', label: 'Pilieni' },
  { value: 'ziede', label: 'Ziede' },
  { value: 'aerosols', label: 'Aerosols' },
  { value: 'plastiris', label: 'Plākstiris' },
  { value: 'cits', label: 'Cits' }
];

// Prescription frequency
export const FREQUENCIES = [
  { value: 'daily', label: 'Katru dienu' },
  { value: 'specific_days', label: 'Noteiktās dienās' },
  { value: 'as_needed', label: 'Pēc nepieciešamības' }
];

// Days of week (for specific_days frequency)
export const WEEK_DAYS = [
  { value: 'monday', label: 'Pirmdiena', short: 'P' },
  { value: 'tuesday', label: 'Otrdiena', short: 'O' },
  { value: 'wednesday', label: 'Trešdiena', short: 'T' },
  { value: 'thursday', label: 'Ceturtdiena', short: 'C' },
  { value: 'friday', label: 'Piektdiena', short: 'Pk' },
  { value: 'saturday', label: 'Sestdiena', short: 'S' },
  { value: 'sunday', label: 'Svētdiena', short: 'Sv' }
];

// Prescription status
export const PRESCRIPTION_STATUS = {
  active: { value: 'active', label: 'Aktīva', color: 'green' },
  paused: { value: 'paused', label: 'Apturēta', color: 'yellow' },
  discontinued: { value: 'discontinued', label: 'Pārtraukta', color: 'gray' }
};

// Administration status
export const ADMINISTRATION_STATUS = {
  given: { value: 'given', label: 'Iedota', color: 'green' },
  increased: { value: 'increased', label: 'Palielināta', color: 'blue' },
  decreased: { value: 'decreased', label: 'Samazināta', color: 'yellow' },
  refused: { value: 'refused', label: 'Atteicās', color: 'red' },
  skipped: { value: 'skipped', label: 'Izlaista', color: 'gray' },
  pending: { value: 'pending', label: 'Gaida', color: 'blue' }
};

// Care levels (1-4 as per Latvian MK regulations Nr. 138)
export const CARE_LEVELS = [
  { value: '1', label: '1. līmenis - Minimāla atkarība' },
  { value: '2', label: '2. līmenis - Zema atkarība' },
  { value: '3', label: '3. līmenis - Vidēja atkarība' },
  { value: '4', label: '4. līmenis - Augsta atkarība' }
];

// Common refusal reasons
export const REFUSAL_REASONS = [
  'Rezidents atteicās bez paskaidrojuma',
  'Slikta dūša / vemšana',
  'Aizrijās ar zālēm iepriekš',
  'Alerģiska reakcija',
  'Rezidents guļ / nav modināms',
  'Rezidents nav klāt (ārpus iestādes)',
  'Cits iemesls'
];

// Dose action types (for nurse dose adjustments)
export const DOSE_ACTION_TYPES = {
  GIVEN: 'given',           // Parastā deva iedota
  INCREASED: 'increased',   // Palielināta deva iedota
  DECREASED: 'decreased',   // Samazināta deva iedota
  SKIPPED: 'skipped'        // Izlaists (atteikums)
};

// Dose adjustment reasons (for nurse adjustments)
export const DOSE_ADJUSTMENT_REASONS = [
  'Ārsta norādījums',
  'Rezidenta stāvokļa izmaiņas',
  'Rezidents lūdza mazāk',
  'Rezidents lūdza vairāk',
  'Blakusparādības novērotas',
  'Nav pietiekami medikamentu',
  'Cits iemesls'
];

// Prescription navigation steps
export const PRESCRIPTION_STEPS = {
  RESIDENT_LIST: 'resident_list',
  RESIDENT_VIEW: 'resident_prescriptions',
  PRESCRIPTION_FORM: 'prescription_form',
  PRESCRIPTION_PRINT: 'prescription_print'
};
