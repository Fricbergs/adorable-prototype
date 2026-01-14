/**
 * Demo Data Initialization
 * Creates sample residents with associated data for testing
 */
import { STORAGE_KEYS as ROOM_STORAGE_KEYS } from '../constants/roomConstants';
import { STORAGE_KEYS as RESIDENT_STORAGE_KEYS } from '../constants/residentConstants';
import { initializeRoomData, bookBed } from './roomHelpers';

// Demo residents - pre-existing residents for testing the profile views
const DEMO_RESIDENTS = [
  {
    id: 'RES-001',
    firstName: 'Anna',
    lastName: 'Bērziņa',
    birthDate: '1942-03-15',
    personalCode: '150342-12345',
    phone: '+371 29123456',
    email: 'anna.berzina@inbox.lv',
    gender: 'female',
    leadId: 'L-2025-001',
    agreementNumber: 'A-2025-001',
    careLevel: '3',
    roomId: 'ROOM-101',
    bedNumber: 1,
    allergies: ['Penicilīns', 'Olas'],
    photo: null,
    status: 'active',
    admissionDate: '2025-06-01',
    dischargeDate: null,
    createdAt: '2025-06-01T10:00:00.000Z',
    contactPersons: [
      { name: 'Māris Bērziņš', phone: '+371 29111222', relationship: 'Dēls' },
      { name: 'Ilze Bērziņa', phone: '+371 26333444', relationship: 'Meita' }
    ],
    familyDoctor: 'Dr. Jānis Ozoliņš',
    declaredAddress: 'Brīvības iela 123, Rīga, LV-1001'
  },
  {
    id: 'RES-002',
    firstName: 'Jānis',
    lastName: 'Kalniņš',
    birthDate: '1938-08-22',
    personalCode: '220838-54321',
    phone: '+371 29654321',
    email: null,
    gender: 'male',
    leadId: 'L-2025-002',
    agreementNumber: 'A-2025-002',
    careLevel: '4',
    roomId: 'ROOM-102',
    bedNumber: 1,
    allergies: [],
    photo: null,
    status: 'active',
    admissionDate: '2025-07-15',
    dischargeDate: null,
    createdAt: '2025-07-15T14:30:00.000Z',
    contactPersons: [
      { name: 'Pēteris Kalniņš', phone: '+371 27555666', relationship: 'Dēls' }
    ],
    familyDoctor: 'Dr. Aija Liepa',
    declaredAddress: 'Raiņa bulvāris 45-12, Rīga, LV-1050'
  },
  {
    id: 'RES-003',
    firstName: 'Marta',
    lastName: 'Liepiņa',
    birthDate: '1945-11-30',
    personalCode: '301145-98765',
    phone: '+371 29987654',
    email: 'marta.liepina@gmail.com',
    gender: 'female',
    leadId: 'L-2025-003',
    agreementNumber: 'A-2025-003',
    careLevel: '2',
    roomId: 'ROOM-201',
    bedNumber: 1,
    allergies: ['Laktoze'],
    photo: null,
    status: 'active',
    admissionDate: '2025-08-01',
    dischargeDate: null,
    createdAt: '2025-08-01T09:00:00.000Z',
    contactPersons: [
      { name: 'Sandra Ozola', phone: '+371 29777888', relationship: 'Meita' },
      { name: 'Andris Liepiņš', phone: '+371 26999000', relationship: 'Brālis' }
    ],
    familyDoctor: 'Dr. Māris Vītoliņš',
    declaredAddress: 'Dzirnavu iela 78-5, Rīga, LV-1010'
  }
];

// Demo diagnoses
const DEMO_DIAGNOSES = [
  // Anna Bērziņa diagnoses
  {
    id: 'DX-001',
    residentId: 'RES-001',
    code: 'I10',
    description: 'Arteriālā hipertensija',
    diagnosedDate: '2020-05-15',
    status: 'active',
    notes: 'Kontrolē ar medikamentiem',
    createdBy: 'Dr. Liepiņš',
    createdAt: '2025-06-01T10:30:00.000Z'
  },
  {
    id: 'DX-002',
    residentId: 'RES-001',
    code: 'E11',
    description: '2. tipa cukura diabēts',
    diagnosedDate: '2018-03-10',
    status: 'active',
    notes: 'Diēta un metformīns',
    createdBy: 'Dr. Liepiņš',
    createdAt: '2025-06-01T10:35:00.000Z'
  },
  // Jānis Kalniņš diagnoses
  {
    id: 'DX-003',
    residentId: 'RES-002',
    code: 'G30.9',
    description: 'Alcheimera slimība',
    diagnosedDate: '2023-01-20',
    status: 'active',
    notes: 'Vidēji smaga pakāpe',
    createdBy: 'Dr. Kalniņš',
    createdAt: '2025-07-15T15:00:00.000Z'
  },
  {
    id: 'DX-004',
    residentId: 'RES-002',
    code: 'M81.0',
    description: 'Osteoporoze',
    diagnosedDate: '2022-06-15',
    status: 'active',
    notes: '',
    createdBy: 'Dr. Kalniņš',
    createdAt: '2025-07-15T15:05:00.000Z'
  },
  // Marta Liepiņa diagnoses
  {
    id: 'DX-005',
    residentId: 'RES-003',
    code: 'I25.9',
    description: 'Hroniska išēmiska sirds slimība',
    diagnosedDate: '2019-08-25',
    status: 'active',
    notes: '',
    createdBy: 'Dr. Ozols',
    createdAt: '2025-08-01T09:30:00.000Z'
  }
];

// Demo vitals
const DEMO_VITALS = [
  // Anna Bērziņa - recent vitals
  {
    id: 'VIT-001',
    residentId: 'RES-001',
    temperature: 36.5,
    bloodPressure: '138/85',
    pulse: 72,
    oxygen: 97,
    weight: 68.5,
    bloodSugar: 6.2,
    measuredAt: '2026-01-07T08:00:00.000Z',
    measuredBy: 'Māsa Irēna',
    notes: ''
  },
  {
    id: 'VIT-002',
    residentId: 'RES-001',
    temperature: 36.4,
    bloodPressure: '142/88',
    pulse: 74,
    oxygen: 96,
    weight: 68.5,
    bloodSugar: 5.8,
    measuredAt: '2026-01-06T08:00:00.000Z',
    measuredBy: 'Māsa Irēna',
    notes: ''
  },
  // Jānis Kalniņš - recent vitals
  {
    id: 'VIT-003',
    residentId: 'RES-002',
    temperature: 36.8,
    bloodPressure: '125/78',
    pulse: 68,
    oxygen: 98,
    weight: 75.2,
    bloodSugar: 5.1,
    measuredAt: '2026-01-07T08:15:00.000Z',
    measuredBy: 'Māsa Irēna',
    notes: ''
  },
  // Marta Liepiņa - recent vitals
  {
    id: 'VIT-004',
    residentId: 'RES-003',
    temperature: 36.6,
    bloodPressure: '145/90',
    pulse: 80,
    oxygen: 95,
    weight: 62.0,
    bloodSugar: 5.5,
    measuredAt: '2026-01-07T08:30:00.000Z',
    measuredBy: 'Māsa Dace',
    notes: 'Nedaudz paaugstināts asinsspiediens'
  }
];

// Demo vaccinations
const DEMO_VACCINATIONS = [
  {
    id: 'VAC-001',
    residentId: 'RES-001',
    vaccineName: 'Comirnaty (Pfizer-BioNTech)',
    vaccineType: 'COVID-19',
    series: 'BNT162b2',
    administeredDate: '2024-10-15',
    expirationDate: '2025-10-15',
    administeredBy: 'Dr. Liepiņš',
    createdAt: '2024-10-15T10:00:00.000Z'
  },
  {
    id: 'VAC-002',
    residentId: 'RES-001',
    vaccineName: 'Influvac Tetra',
    vaccineType: 'Gripa',
    series: 'INF2024',
    administeredDate: '2024-11-01',
    expirationDate: '2025-11-01',
    administeredBy: 'Māsa Irēna',
    createdAt: '2024-11-01T09:00:00.000Z'
  },
  {
    id: 'VAC-003',
    residentId: 'RES-002',
    vaccineName: 'Comirnaty (Pfizer-BioNTech)',
    vaccineType: 'COVID-19',
    series: 'BNT162b2',
    administeredDate: '2024-10-20',
    expirationDate: '2025-10-20',
    administeredBy: 'Dr. Kalniņš',
    createdAt: '2024-10-20T11:00:00.000Z'
  },
  {
    id: 'VAC-004',
    residentId: 'RES-003',
    vaccineName: 'Influvac Tetra',
    vaccineType: 'Gripa',
    series: 'INF2024',
    administeredDate: '2024-11-05',
    expirationDate: '2025-11-05',
    administeredBy: 'Māsa Dace',
    createdAt: '2024-11-05T14:00:00.000Z'
  }
];

// Demo doctor assessments
const DEMO_DOCTOR_ASSESSMENTS = [
  {
    id: 'DOC-001',
    residentId: 'RES-001',
    assessedAt: '2026-01-05T10:00:00.000Z',
    assessedBy: 'Dr. Liepiņš',
    findings: 'Stabils stāvoklis. Turpināt pašreizējo ārstēšanu.',
    recommendations: 'Kontrole pēc 1 mēneša',
    notes: ''
  },
  {
    id: 'DOC-002',
    residentId: 'RES-002',
    assessedAt: '2026-01-03T11:00:00.000Z',
    assessedBy: 'Dr. Kalniņš',
    findings: 'Kognitīvās funkcijas nemainīgas. Izteikta īslaicīgās atmiņas traucējumi.',
    recommendations: 'Turpināt kognitīvo stimulāciju',
    notes: ''
  },
  {
    id: 'DOC-003',
    residentId: 'RES-003',
    assessedAt: '2026-01-04T09:30:00.000Z',
    assessedBy: 'Dr. Ozols',
    findings: 'Sūdzas par aizdusas epizodēm. EKG bez izmaiņām.',
    recommendations: 'Palielināt diurētiķa devu',
    notes: 'Kontrolēt svaru katru dienu'
  }
];

// Demo nurse assessments
const DEMO_NURSE_ASSESSMENTS = [
  {
    id: 'NRS-001',
    residentId: 'RES-001',
    assessedAt: '2026-01-07T07:30:00.000Z',
    assessedBy: 'Māsa Irēna',
    findings: 'Gulējusi labi. Ēstgribu normāla.',
    notes: ''
  },
  {
    id: 'NRS-002',
    residentId: 'RES-002',
    assessedAt: '2026-01-07T07:45:00.000Z',
    assessedBy: 'Māsa Irēna',
    findings: 'Dezorientēts no rīta. Palīdzība vajadzīga ģērbjoties.',
    notes: 'Uzmanīgi sekot aktivitātēm'
  },
  {
    id: 'NRS-003',
    residentId: 'RES-003',
    assessedAt: '2026-01-07T08:00:00.000Z',
    assessedBy: 'Māsa Dace',
    findings: 'Nedaudz nogurusi. Kājas pietūkušas.',
    notes: 'Pacelt kājas gultā'
  }
];

// Demo psychiatrist assessments
const DEMO_PSYCHIATRIST_ASSESSMENTS = [
  {
    id: 'PSY-001',
    residentId: 'RES-002',
    assessedAt: '2025-12-15T14:00:00.000Z',
    assessedBy: 'Dr. Straupe',
    findings: 'MMSE: 18/30. Vidēji smagi kognitīvi traucējumi.',
    recommendations: 'Turpināt donepezilu',
    notes: ''
  }
];

// Demo physiotherapist assessments
const DEMO_PHYSIO_ASSESSMENTS = [
  {
    id: 'PHY-001',
    residentId: 'RES-001',
    assessedAt: '2026-01-02T10:00:00.000Z',
    assessedBy: 'Fiziot. Kalnāja',
    findings: 'Gaita stabila ar rollatoru. Izpilda vingrojumus patstāvīgi.',
    notes: 'Turpināt ikdienas vingrojumus'
  },
  {
    id: 'PHY-002',
    residentId: 'RES-002',
    assessedAt: '2026-01-02T11:00:00.000Z',
    assessedBy: 'Fiziot. Kalnāja',
    findings: 'Nepieciešama palīdzība staigājot. Izmanto rolatoru.',
    notes: 'Uzmanība - kritienu risks'
  }
];

// Demo Morse Fall Risk scores
const DEMO_MORSE_SCORES = [
  {
    id: 'MORSE-001',
    residentId: 'RES-001',
    scaleType: 'morse',
    score: 35,
    riskLevel: 'medium',
    factors: {
      fallHistory: 0,
      secondaryDiagnosis: 15,
      ambulatoryAid: 15,
      ivTherapy: 0,
      gait: 5,
      mentalStatus: 0
    },
    assessedAt: '2026-01-01T10:00:00.000Z',
    assessedBy: 'Māsa Irēna'
  },
  {
    id: 'MORSE-002',
    residentId: 'RES-002',
    scaleType: 'morse',
    score: 55,
    riskLevel: 'high',
    factors: {
      fallHistory: 25,
      secondaryDiagnosis: 15,
      ambulatoryAid: 15,
      ivTherapy: 0,
      gait: 0,
      mentalStatus: 0
    },
    assessedAt: '2026-01-01T10:30:00.000Z',
    assessedBy: 'Māsa Irēna'
  },
  {
    id: 'MORSE-003',
    residentId: 'RES-003',
    scaleType: 'morse',
    score: 25,
    riskLevel: 'low',
    factors: {
      fallHistory: 0,
      secondaryDiagnosis: 15,
      ambulatoryAid: 0,
      ivTherapy: 0,
      gait: 10,
      mentalStatus: 0
    },
    assessedAt: '2026-01-01T11:00:00.000Z',
    assessedBy: 'Māsa Dace'
  }
];

// Demo Braden Pressure Ulcer scores
const DEMO_BRADEN_SCORES = [
  {
    id: 'BRADEN-001',
    residentId: 'RES-001',
    scaleType: 'braden',
    score: 18,
    riskLevel: 'low',
    factors: {
      sensoryPerception: 4,
      moisture: 3,
      activity: 3,
      mobility: 3,
      nutrition: 3,
      frictionShear: 2
    },
    assessedAt: '2026-01-01T10:00:00.000Z',
    assessedBy: 'Māsa Irēna'
  },
  {
    id: 'BRADEN-002',
    residentId: 'RES-002',
    scaleType: 'braden',
    score: 14,
    riskLevel: 'medium',
    factors: {
      sensoryPerception: 3,
      moisture: 3,
      activity: 2,
      mobility: 2,
      nutrition: 2,
      frictionShear: 2
    },
    assessedAt: '2026-01-01T10:30:00.000Z',
    assessedBy: 'Māsa Irēna'
  }
];

// Demo Barthel ADL Index scores
const DEMO_BARTHEL_SCORES = [
  {
    id: 'BARTHEL-001',
    residentId: 'RES-001',
    scaleType: 'barthel',
    score: 75,
    riskLevel: 'medium',
    factors: {
      feeding: 10,
      bathing: 0,
      grooming: 5,
      dressing: 10,
      bowels: 10,
      bladder: 10,
      toiletUse: 10,
      transfers: 10,
      mobility: 10,
      stairs: 0
    },
    assessedAt: '2026-01-01T10:00:00.000Z',
    assessedBy: 'Māsa Irēna'
  },
  {
    id: 'BARTHEL-002',
    residentId: 'RES-002',
    scaleType: 'barthel',
    score: 45,
    riskLevel: 'severe',
    factors: {
      feeding: 5,
      bathing: 0,
      grooming: 0,
      dressing: 5,
      bowels: 5,
      bladder: 5,
      toiletUse: 5,
      transfers: 10,
      mobility: 10,
      stairs: 0
    },
    assessedAt: '2026-01-01T10:30:00.000Z',
    assessedBy: 'Māsa Irēna'
  },
  {
    id: 'BARTHEL-003',
    residentId: 'RES-003',
    scaleType: 'barthel',
    score: 85,
    riskLevel: 'low',
    factors: {
      feeding: 10,
      bathing: 5,
      grooming: 5,
      dressing: 10,
      bowels: 10,
      bladder: 10,
      toiletUse: 10,
      transfers: 10,
      mobility: 15,
      stairs: 0
    },
    assessedAt: '2026-01-01T11:00:00.000Z',
    assessedBy: 'Māsa Dace'
  }
];

// Demo technical aids
const DEMO_TECHNICAL_AIDS = [
  {
    id: 'AID-001',
    residentId: 'RES-001',
    aidType: 'rollator',
    description: 'Rollators ar sēdekli',
    assignedDate: '2025-06-01',
    status: 'active',
    notes: 'Izmanto ikdienā'
  },
  {
    id: 'AID-002',
    residentId: 'RES-002',
    aidType: 'rollator',
    description: 'Rollators',
    assignedDate: '2025-07-15',
    status: 'active',
    notes: ''
  },
  {
    id: 'AID-003',
    residentId: 'RES-002',
    aidType: 'bed_rails',
    description: 'Gultas margalas',
    assignedDate: '2025-07-15',
    status: 'active',
    notes: 'Kritienu profilaksei'
  },
  {
    id: 'AID-004',
    residentId: 'RES-003',
    aidType: 'walking_cane',
    description: 'Spieķis',
    assignedDate: '2025-08-01',
    status: 'active',
    notes: ''
  }
];

/**
 * Check if demo data is already initialized
 */
export const isDemoDataInitialized = () => {
  const residents = localStorage.getItem(RESIDENT_STORAGE_KEYS.RESIDENTS);
  return residents && JSON.parse(residents).length > 0;
};

/**
 * Initialize all demo data
 * Should be called once when the app first loads
 */
export const initializeDemoData = () => {
  // Don't re-initialize if data already exists
  if (isDemoDataInitialized()) {
    console.log('Demo data already initialized');
    return;
  }

  console.log('Initializing demo data...');

  // Initialize rooms first
  initializeRoomData();

  // Book beds for demo residents
  DEMO_RESIDENTS.forEach(resident => {
    bookBed(resident.roomId, resident.bedNumber, resident.id);
  });

  // Save residents
  localStorage.setItem(RESIDENT_STORAGE_KEYS.RESIDENTS, JSON.stringify(DEMO_RESIDENTS));

  // Save diagnoses
  localStorage.setItem(RESIDENT_STORAGE_KEYS.DIAGNOSES, JSON.stringify(DEMO_DIAGNOSES));

  // Save vitals log
  localStorage.setItem(RESIDENT_STORAGE_KEYS.VITALS_LOG, JSON.stringify(DEMO_VITALS));

  // Save vaccinations
  localStorage.setItem(RESIDENT_STORAGE_KEYS.VACCINATIONS, JSON.stringify(DEMO_VACCINATIONS));

  // Save assessments
  localStorage.setItem(RESIDENT_STORAGE_KEYS.DOCTOR_ASSESSMENTS, JSON.stringify(DEMO_DOCTOR_ASSESSMENTS));
  localStorage.setItem(RESIDENT_STORAGE_KEYS.NURSE_ASSESSMENTS, JSON.stringify(DEMO_NURSE_ASSESSMENTS));
  localStorage.setItem(RESIDENT_STORAGE_KEYS.PSYCHIATRIST_ASSESSMENTS, JSON.stringify(DEMO_PSYCHIATRIST_ASSESSMENTS));
  localStorage.setItem(RESIDENT_STORAGE_KEYS.PHYSIO_ASSESSMENTS, JSON.stringify(DEMO_PHYSIO_ASSESSMENTS));

  // Save risk assessments
  localStorage.setItem(RESIDENT_STORAGE_KEYS.RISK_MORSE, JSON.stringify(DEMO_MORSE_SCORES));
  localStorage.setItem(RESIDENT_STORAGE_KEYS.RISK_BRADEN, JSON.stringify(DEMO_BRADEN_SCORES));
  localStorage.setItem(RESIDENT_STORAGE_KEYS.RISK_BARTHEL, JSON.stringify(DEMO_BARTHEL_SCORES));

  // Save technical aids
  localStorage.setItem(RESIDENT_STORAGE_KEYS.TECHNICAL_AIDS, JSON.stringify(DEMO_TECHNICAL_AIDS));

  console.log('Demo data initialized successfully');
};

/**
 * Clear all demo data (for testing)
 */
export const clearDemoData = () => {
  Object.values(RESIDENT_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  Object.values(ROOM_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('Demo data cleared');
};

/**
 * Get demo residents for display
 */
export const getDemoResidents = () => DEMO_RESIDENTS;
