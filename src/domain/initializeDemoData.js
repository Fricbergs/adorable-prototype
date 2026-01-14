/**
 * Demo Data Initialization
 * Creates sample residents with associated data for testing
 */
import { STORAGE_KEYS as ROOM_STORAGE_KEYS } from '../constants/roomConstants';
import { STORAGE_KEYS as RESIDENT_STORAGE_KEYS } from '../constants/residentConstants';
import { initializeRoomData, bookBed } from './roomHelpers';

// Increment this when demo data structure changes to force refresh
const DEMO_DATA_VERSION = 3;
const VERSION_KEY = 'adorable-demo-data-version';

// Latvian name lists for generating residents
const FEMALE_FIRST_NAMES = [
  'Anna', 'Marta', 'Līga', 'Ilze', 'Inga', 'Dace', 'Baiba', 'Inese', 'Aija', 'Vija',
  'Zenta', 'Mirdza', 'Ausma', 'Rasma', 'Biruta', 'Dzintra', 'Gaida', 'Helēna', 'Irēna', 'Janīna',
  'Kristīne', 'Laima', 'Maija', 'Natālija', 'Olga', 'Paula', 'Ruta', 'Sandra', 'Tamāra', 'Valija',
  'Vera', 'Zelma', 'Alma', 'Elvīra', 'Emīlija', 'Gertrūde', 'Hermīne', 'Lidija', 'Milda', 'Silvija',
  'Tekla', 'Veronika', 'Zinaīda', 'Antonija', 'Broņislava', 'Elfrīda', 'Leontīne', 'Marija', 'Otīlija', 'Stefānija'
];

const MALE_FIRST_NAMES = [
  'Jānis', 'Pēteris', 'Andris', 'Māris', 'Kārlis', 'Juris', 'Valdis', 'Aivars', 'Gunārs', 'Imants',
  'Edgars', 'Raimonds', 'Viktors', 'Aleksandrs', 'Arvīds', 'Bruno', 'Dāvis', 'Elmārs', 'Fricis', 'Guntis',
  'Harijs', 'Ivars', 'Jēkabs', 'Konstantīns', 'Leons', 'Mihails', 'Nikolajs', 'Oskars', 'Paulis', 'Roberts',
  'Staņislavs', 'Teodors', 'Uldis', 'Vilhelms', 'Zigfrīds', 'Ādolfs', 'Bernhards', 'Eduards', 'Gothards', 'Herberts',
  'Jāzeps', 'Krišjānis', 'Ludvigs', 'Markuss', 'Normunds', 'Oļegs', 'Pāvils', 'Reinis', 'Sergejs', 'Voldemārs'
];

const LAST_NAMES_MALE = [
  'Bērziņš', 'Kalniņš', 'Ozoliņš', 'Jansons', 'Liepiņš', 'Krūmiņš', 'Balodis', 'Eglītis', 'Zariņš', 'Vanags',
  'Vītols', 'Āboliņš', 'Celmiņš', 'Dūmiņš', 'Feldmanis', 'Grundulis', 'Hofmanis', 'Ivankovs', 'Jurēvics', 'Kļaviņš',
  'Lagzdiņš', 'Mednis', 'Niedra', 'Osis', 'Petrovs', 'Rudzītis', 'Siliņš', 'Tīrums', 'Upenieks', 'Vēveris',
  'Zaķis', 'Ābols', 'Blumbergs', 'Cīrulis', 'Dreimanis', 'Ezernieks', 'Freibergs', 'Gailis', 'Hermanis', 'Ivanovs'
];

const LAST_NAMES_FEMALE = [
  'Bērziņa', 'Kalniņa', 'Ozoliņa', 'Jansone', 'Liepiņa', 'Krūmiņa', 'Balode', 'Eglīte', 'Zariņa', 'Vanaga',
  'Vītola', 'Āboliņa', 'Celmiņa', 'Dūmiņa', 'Feldmane', 'Grundule', 'Hofmane', 'Ivankova', 'Jurēvica', 'Kļaviņa',
  'Lagzdiņa', 'Medne', 'Niedre', 'Ose', 'Petrova', 'Rudzīte', 'Siliņa', 'Tīruma', 'Upeniece', 'Vēvere',
  'Zaķe', 'Ābola', 'Blumberga', 'Cīrule', 'Dreimane', 'Ezerniece', 'Freiberga', 'Gaile', 'Hermane', 'Ivanova'
];

const RELATIONSHIPS = ['Dēls', 'Meita', 'Mazdēls', 'Mazmeita', 'Brālis', 'Māsa', 'Brāļadēls', 'Māsasmeita', 'Draugs', 'Draudzene'];
const ALLERGIES = ['Penicilīns', 'Olas', 'Laktoze', 'Glutēns', 'Rieksti', 'Zivs', 'Soja', 'Aspirīns', 'Ibuprofēns', 'Sulfāti'];
const STREETS = ['Brīvības iela', 'Raiņa bulvāris', 'Dzirnavu iela', 'Čaka iela', 'Blaumaņa iela', 'Stabu iela', 'Tērbatas iela', 'Barona iela', 'Valdemāra iela', 'Elizabetes iela'];
const DOCTORS = ['Dr. Jānis Ozoliņš', 'Dr. Aija Liepa', 'Dr. Māris Vītoliņš', 'Dr. Inga Bērziņa', 'Dr. Pēteris Kalniņš', 'Dr. Dace Eglīte', 'Dr. Gunārs Zariņš', 'Dr. Ilze Balode'];

// Seeded random for consistent generation
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate 200 residents
const generateDemoResidents = () => {
  const residents = [];

  for (let i = 1; i <= 200; i++) {
    const seed = i * 13.37;
    const isFemale = seededRandom(seed) > 0.45; // Slightly more women (typical for care homes)
    const firstName = isFemale
      ? FEMALE_FIRST_NAMES[Math.floor(seededRandom(seed + 1) * FEMALE_FIRST_NAMES.length)]
      : MALE_FIRST_NAMES[Math.floor(seededRandom(seed + 1) * MALE_FIRST_NAMES.length)];
    const lastName = isFemale
      ? LAST_NAMES_FEMALE[Math.floor(seededRandom(seed + 2) * LAST_NAMES_FEMALE.length)]
      : LAST_NAMES_MALE[Math.floor(seededRandom(seed + 2) * LAST_NAMES_MALE.length)];

    // Birth year between 1930-1955 (ages 71-96)
    const birthYear = 1930 + Math.floor(seededRandom(seed + 3) * 25);
    const birthMonth = 1 + Math.floor(seededRandom(seed + 4) * 12);
    const birthDay = 1 + Math.floor(seededRandom(seed + 5) * 28);
    const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    // Room assignment: floors 1-4, rooms 01-15, beds 1-2
    const floor = 1 + Math.floor(seededRandom(seed + 6) * 4);
    const roomNum = 1 + Math.floor(seededRandom(seed + 7) * 15);
    const bedNum = 1 + Math.floor(seededRandom(seed + 8) * 2);
    const roomId = `ROOM-${floor}${String(roomNum).padStart(2, '0')}`;

    // Care level 1-4
    const careLevel = String(1 + Math.floor(seededRandom(seed + 9) * 4));

    // Allergies (30% have allergies)
    const hasAllergies = seededRandom(seed + 10) < 0.3;
    const numAllergies = hasAllergies ? 1 + Math.floor(seededRandom(seed + 11) * 2) : 0;
    const allergies = [];
    for (let a = 0; a < numAllergies; a++) {
      const allergy = ALLERGIES[Math.floor(seededRandom(seed + 12 + a) * ALLERGIES.length)];
      if (!allergies.includes(allergy)) allergies.push(allergy);
    }

    // Contact persons (1-2)
    const numContacts = 1 + Math.floor(seededRandom(seed + 15) * 2);
    const contactPersons = [];
    for (let c = 0; c < numContacts; c++) {
      const contactIsFemale = seededRandom(seed + 16 + c) > 0.5;
      const contactFirstName = contactIsFemale
        ? FEMALE_FIRST_NAMES[Math.floor(seededRandom(seed + 17 + c) * FEMALE_FIRST_NAMES.length)]
        : MALE_FIRST_NAMES[Math.floor(seededRandom(seed + 17 + c) * MALE_FIRST_NAMES.length)];
      const contactLastName = contactIsFemale
        ? LAST_NAMES_FEMALE[Math.floor(seededRandom(seed + 18 + c) * LAST_NAMES_FEMALE.length)]
        : LAST_NAMES_MALE[Math.floor(seededRandom(seed + 18 + c) * LAST_NAMES_MALE.length)];
      const phone = `+371 2${Math.floor(seededRandom(seed + 19 + c) * 9000000 + 1000000)}`;
      const relationship = RELATIONSHIPS[Math.floor(seededRandom(seed + 20 + c) * RELATIONSHIPS.length)];
      contactPersons.push({ name: `${contactFirstName} ${contactLastName}`, phone, relationship });
    }

    // Photo URL using UI Avatars service with initials
    const photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&size=128&background=${isFemale ? 'f8b4c4' : '87ceeb'}&color=333&bold=true`;

    // Admission date in 2024-2025
    const admYear = 2024 + Math.floor(seededRandom(seed + 25) * 2);
    const admMonth = 1 + Math.floor(seededRandom(seed + 26) * 12);
    const admDay = 1 + Math.floor(seededRandom(seed + 27) * 28);
    const admissionDate = `${admYear}-${String(admMonth).padStart(2, '0')}-${String(admDay).padStart(2, '0')}`;

    residents.push({
      id: `RES-${String(i).padStart(3, '0')}`,
      firstName,
      lastName,
      birthDate,
      personalCode: `${String(birthDay).padStart(2, '0')}${String(birthMonth).padStart(2, '0')}${String(birthYear).slice(2)}-${10000 + Math.floor(seededRandom(seed + 28) * 89999)}`,
      phone: seededRandom(seed + 29) > 0.7 ? `+371 2${Math.floor(seededRandom(seed + 30) * 9000000 + 1000000)}` : null,
      email: seededRandom(seed + 31) > 0.8 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@inbox.lv` : null,
      gender: isFemale ? 'female' : 'male',
      leadId: `L-2025-${String(i).padStart(3, '0')}`,
      agreementNumber: `A-2025-${String(i).padStart(3, '0')}`,
      careLevel,
      roomId,
      roomNumber: `${floor}${String(roomNum).padStart(2, '0')}`,
      bedNumber: bedNum,
      allergies,
      photo: photoUrl,
      status: 'active',
      admissionDate,
      dischargeDate: null,
      createdAt: `${admissionDate}T10:00:00.000Z`,
      contactPersons,
      familyDoctor: DOCTORS[Math.floor(seededRandom(seed + 32) * DOCTORS.length)],
      declaredAddress: `${STREETS[Math.floor(seededRandom(seed + 33) * STREETS.length)]} ${1 + Math.floor(seededRandom(seed + 34) * 150)}, Rīga, LV-10${10 + Math.floor(seededRandom(seed + 35) * 90)}`
    });
  }

  return residents;
};

const DEMO_RESIDENTS = generateDemoResidents();

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
 * Clear all demo data (for testing or version refresh)
 */
export const clearDemoData = () => {
  Object.values(RESIDENT_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  Object.values(ROOM_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem(VERSION_KEY);
  console.log('Demo data cleared');
};

/**
 * Check if demo data is already initialized with current version
 */
export const isDemoDataInitialized = () => {
  const version = localStorage.getItem(VERSION_KEY);
  const residents = localStorage.getItem(RESIDENT_STORAGE_KEYS.RESIDENTS);

  // If version mismatch, clear old data
  if (version !== String(DEMO_DATA_VERSION)) {
    console.log(`Demo data version mismatch (${version} vs ${DEMO_DATA_VERSION}), refreshing...`);
    clearDemoData();
    return false;
  }

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

  // Save version
  localStorage.setItem(VERSION_KEY, String(DEMO_DATA_VERSION));

  console.log('Demo data initialized successfully');
};

/**
 * Get demo residents for display
 */
export const getDemoResidents = () => DEMO_RESIDENTS;
