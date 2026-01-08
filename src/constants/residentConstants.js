/**
 * Resident Constants
 * Defines storage keys, status types, and configuration for resident management
 */

// localStorage keys for resident data
export const STORAGE_KEYS = {
  RESIDENTS: 'adorable-residents',
  DIAGNOSES: 'adorable-diagnoses',
  VITALS_LOG: 'adorable-vitals-log',
  VACCINATIONS: 'adorable-vaccinations',
  ASSESSMENTS_DOCTOR: 'adorable-assessments-doctor',
  ASSESSMENTS_NURSE: 'adorable-assessments-nurse',
  ASSESSMENTS_PSYCH: 'adorable-assessments-psych',
  ASSESSMENTS_PHYSIO: 'adorable-assessments-physio',
  RISK_MORSE: 'adorable-risk-morse',
  RISK_BRADEN: 'adorable-risk-braden',
  RISK_BARTHEL: 'adorable-risk-barthel',
  TECHNICAL_AIDS: 'adorable-technical-aids'
};

// Resident status types
export const RESIDENT_STATUS = {
  active: {
    value: 'active',
    label: 'Aktīvs',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  discharged: {
    value: 'discharged',
    label: 'Izrakstīts',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  },
  deceased: {
    value: 'deceased',
    label: 'Miris',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500'
  }
};

// Care levels (GIR scale used in France, adapted for Latvia)
export const CARE_LEVELS = {
  GIR1: {
    value: 'GIR1',
    label: 'GIR 1 - Ļoti augsta atkarība',
    description: 'Pilnībā atkarīgs, nepieciešama pastāvīga palīdzība',
    level: 1
  },
  GIR2: {
    value: 'GIR2',
    label: 'GIR 2 - Augsta atkarība',
    description: 'Nepieciešama ievērojama palīdzība ikdienas aktivitātēs',
    level: 2
  },
  GIR3: {
    value: 'GIR3',
    label: 'GIR 3 - Vidēja atkarība',
    description: 'Saglabāta daļēja neatkarība, nepieciešama regulāra palīdzība',
    level: 3
  },
  GIR4: {
    value: 'GIR4',
    label: 'GIR 4 - Zema atkarība',
    description: 'Lielākoties neatkarīgs, nepieciešama neliela palīdzība',
    level: 4
  },
  GIR5: {
    value: 'GIR5',
    label: 'GIR 5 - Minimāla atkarība',
    description: 'Neatkarīgs ikdienas aktivitātēs, periodiski nepieciešama uzraudzība',
    level: 5
  },
  GIR6: {
    value: 'GIR6',
    label: 'GIR 6 - Neatkarīgs',
    description: 'Pilnībā neatkarīgs, nav nepieciešama palīdzība',
    level: 6
  }
};

// Diagnosis status
export const DIAGNOSIS_STATUS = {
  active: {
    value: 'active',
    label: 'Aktīva',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  resolved: {
    value: 'resolved',
    label: 'Atrisināta',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500'
  },
  chronic: {
    value: 'chronic',
    label: 'Hroniska',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  }
};

// Risk scales
export const RISK_SCALES = {
  morse: {
    value: 'morse',
    label: 'Morsa skala',
    fullName: 'Kritienu riska novērtējums pēc Morsa skalas',
    description: 'Krituma riska novērtējums',
    maxScore: 125,
    levels: [
      { min: 0, max: 24, level: 'low', label: 'Zems risks', color: 'green' },
      { min: 25, max: 50, level: 'medium', label: 'Vidējs risks', color: 'yellow' },
      { min: 51, max: 125, level: 'high', label: 'Augsts risks', color: 'red' }
    ]
  },
  braden: {
    value: 'braden',
    label: 'Bradena skala',
    fullName: 'Izgulējumu riska noteikšana pēc Bradena skalas',
    description: 'Spiediena čūlas riska novērtējums',
    maxScore: 23,
    levels: [
      { min: 19, max: 23, level: 'low', label: 'Zems risks', color: 'green' },
      { min: 15, max: 18, level: 'medium', label: 'Vidējs risks', color: 'yellow' },
      { min: 13, max: 14, level: 'high', label: 'Augsts risks', color: 'orange' },
      { min: 6, max: 12, level: 'very_high', label: 'Ļoti augsts risks', color: 'red' }
    ]
  },
  barthel: {
    value: 'barthel',
    label: 'Bartela indekss',
    fullName: 'Personu pašaprūpes un mobilitātes spēju novērtējums pēc Bartela indeksa',
    description: 'Ikdienas aktivitāšu novērtējums',
    maxScore: 100,
    levels: [
      { min: 0, max: 20, level: 'total', label: 'Pilnīga atkarība', color: 'red' },
      { min: 21, max: 60, level: 'severe', label: 'Smaga atkarība', color: 'orange' },
      { min: 61, max: 90, level: 'moderate', label: 'Vidēja atkarība', color: 'yellow' },
      { min: 91, max: 99, level: 'slight', label: 'Neliela atkarība', color: 'blue' },
      { min: 100, max: 100, level: 'independent', label: 'Neatkarīgs', color: 'green' }
    ]
  }
};

// Vaccination types
export const VACCINATION_TYPES = [
  { value: 'covid19', label: 'COVID-19' },
  { value: 'flu', label: 'Gripa' },
  { value: 'pneumococcal', label: 'Pneimokoku' },
  { value: 'tetanus', label: 'Stingumkrampji' },
  { value: 'hepatitis_b', label: 'B hepatīts' },
  { value: 'shingles', label: 'Jostas roze' },
  { value: 'other', label: 'Cita' }
];

// Technical aids categories
export const TECHNICAL_AIDS = {
  mobility: {
    value: 'mobility',
    label: 'Pārvietošanās palīglīdzekļi',
    items: [
      { value: 'wheelchair', label: 'Ratiņkrēsls' },
      { value: 'walker', label: 'Staigulītis' },
      { value: 'cane', label: 'Spieķis' },
      { value: 'crutches', label: 'Kruķi' }
    ]
  },
  hygiene: {
    value: 'hygiene',
    label: 'Higiēnas palīglīdzekļi',
    items: [
      { value: 'shower_chair', label: 'Dušas krēsls' },
      { value: 'raised_toilet', label: 'Paaugstināts tualetes sēdeklis' },
      { value: 'bed_pan', label: 'Gultas poda' }
    ]
  },
  bed: {
    value: 'bed',
    label: 'Gultas aprīkojums',
    items: [
      { value: 'hospital_bed', label: 'Funkcionālā gulta' },
      { value: 'mattress', label: 'Pretizgulējumu matracis' },
      { value: 'bed_rails', label: 'Gultas margas' }
    ]
  },
  other: {
    value: 'other',
    label: 'Citi palīglīdzekļi',
    items: [
      { value: 'hearing_aid', label: 'Dzirdes aparāts' },
      { value: 'glasses', label: 'Brilles' },
      { value: 'oxygen', label: 'Skābekļa aparāts' }
    ]
  }
};

// Vitals normal ranges
export const VITALS_RANGES = {
  temperature: { min: 35.5, max: 37.5, unit: '°C' },
  bloodPressureSystolic: { min: 90, max: 140, unit: 'mmHg' },
  bloodPressureDiastolic: { min: 60, max: 90, unit: 'mmHg' },
  pulse: { min: 60, max: 100, unit: 'sitieni/min' },
  oxygen: { min: 95, max: 100, unit: '%' },
  bloodSugar: { min: 4.0, max: 7.0, unit: 'mmol/L' }
};

// Profile sections for accordion
export const PROFILE_SECTIONS = [
  { id: 'diagnoses', label: 'Diagnozes', icon: 'ClipboardList' },
  { id: 'vitals', label: 'Māsas apskate', icon: 'Activity' },
  { id: 'doctor', label: 'Ārsta apskate', icon: 'Stethoscope' },
  { id: 'psychiatrist', label: 'Psihiatra apskate', icon: 'Brain' },
  { id: 'vaccinations', label: 'Vakcinācija', icon: 'Syringe' },
  { id: 'prescriptions', label: 'Ordinācijas plāns', icon: 'Pill' },
  { id: 'physiotherapy', label: 'Fizioterapeita apskate', icon: 'HeartPulse' },
  { id: 'risk_morse', label: 'Kritienu risks (Morsa)', icon: 'AlertTriangle' },
  { id: 'risk_braden', label: 'Izgulējumu risks (Bradena)', icon: 'AlertCircle' },
  { id: 'risk_barthel', label: 'Pašaprūpes spējas (Bartela)', icon: 'Activity' },
  { id: 'technical_aids', label: 'Tehniskie palīglīdzekļi', icon: 'Wrench' },
  { id: 'inventory', label: 'Rezidenta noliktava', icon: 'Package' }
];
