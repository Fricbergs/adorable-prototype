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
  refused: { value: 'refused', label: 'Atteicās', color: 'red' },
  skipped: { value: 'skipped', label: 'Izlaista', color: 'gray' },
  pending: { value: 'pending', label: 'Gaida', color: 'blue' }
};

// Care levels (GIR)
export const CARE_LEVELS = [
  { value: 'GIR1', label: 'GIR 1 - Pilnīgi atkarīgs' },
  { value: 'GIR2', label: 'GIR 2 - Ļoti atkarīgs' },
  { value: 'GIR3', label: 'GIR 3 - Vidēji atkarīgs' },
  { value: 'GIR4', label: 'GIR 4 - Daļēji atkarīgs' },
  { value: 'GIR5', label: 'GIR 5 - Nedaudz atkarīgs' },
  { value: 'GIR6', label: 'GIR 6 - Neatkarīgs' }
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

// Prescription navigation steps
export const PRESCRIPTION_STEPS = {
  RESIDENT_LIST: 'resident_list',
  RESIDENT_VIEW: 'resident_prescriptions',
  PRESCRIPTION_FORM: 'prescription_form',
  PRESCRIPTION_PRINT: 'prescription_print'
};
