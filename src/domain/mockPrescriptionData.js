// Mock data for Ordinācijas Plāns prototype
// Matches the screenshot design and adoro data patterns

// Sample residents
export const mockResidents = [
  {
    id: 'R-001',
    firstName: 'Jānis',
    lastName: 'Bērziņš',
    birthDate: '1945-03-15',
    personalCode: '150345-12345',
    roomNumber: '205',
    careLevel: '3',
    photo: null,
    allergies: ['Penicilīns', 'Aspirīns'],
    vitals: {
      temperature: 36.5,
      bloodPressure: '120/80',
      pulse: 72,
      oxygen: 98,
      weight: 75.5,
      bloodSugar: 5.8,
      measuredAt: '2025-01-07T08:30:00'
    }
  },
  {
    id: 'R-002',
    firstName: 'Anna',
    lastName: 'Kalniņa',
    birthDate: '1938-08-22',
    personalCode: '220838-23456',
    roomNumber: '103',
    careLevel: '2',
    photo: null,
    allergies: ['Ibuprofēns'],
    vitals: {
      temperature: 36.8,
      bloodPressure: '135/85',
      pulse: 78,
      oxygen: 96,
      weight: 62.0,
      bloodSugar: 6.2,
      measuredAt: '2025-01-07T08:15:00'
    }
  },
  {
    id: 'R-003',
    firstName: 'Pēteris',
    lastName: 'Ozols',
    birthDate: '1942-11-05',
    personalCode: '051142-34567',
    roomNumber: '312',
    careLevel: '4',
    photo: null,
    allergies: [],
    vitals: {
      temperature: 36.4,
      bloodPressure: '128/82',
      pulse: 68,
      oxygen: 97,
      weight: 82.3,
      bloodSugar: 5.4,
      measuredAt: '2025-01-07T07:45:00'
    }
  }
];

// Sample prescriptions (matching screenshot format)
export const mockPrescriptions = [
  // Resident R-001 prescriptions
  {
    id: 'P-001',
    residentId: 'R-001',
    medicationName: 'L-Thyroxin Berlin-Chemie 50 mikrogramu tabletes',
    activeIngredient: 'Levothyroxinum natricum',
    form: 'tabletes',
    prescribedDate: '2022-05-16',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: '07:30', dose: '50.0', unit: 'mcg', enabled: true },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: null,
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-002',
    residentId: 'R-001',
    medicationName: 'Somnols 7,5 mg apvalkotās tabletes',
    activeIngredient: 'Zopiclonum',
    form: 'tabletes',
    prescribedDate: '2022-05-16',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: '21:00', dose: '3.75', unit: 'mg', enabled: true }
    },
    instructions: '1/2 tab.',
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-003',
    residentId: 'R-001',
    medicationName: 'Nateo D3 vit.cap 4000 SV',
    activeIngredient: 'Cholecalciferolum',
    form: 'kapsulas',
    prescribedDate: '2022-05-16',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: '12:30', dose: '1.0', unit: 'piece', enabled: true },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: 'Pievienot Omega-3; Perfectil.',
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-004',
    residentId: 'R-001',
    medicationName: 'Verospiron 25 mg tabletes',
    activeIngredient: 'Spironolactonum',
    form: 'tabletes',
    prescribedDate: '2023-03-23',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: '08:30', dose: '25.0', unit: 'mg', enabled: true },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: null,
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-005',
    residentId: 'R-001',
    medicationName: 'NovoMix 30 FlexPen',
    activeIngredient: 'Insulinum aspartum',
    form: 'injekcijas',
    prescribedDate: '2023-07-15',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: '08:30', dose: '8.0', unit: 'U', enabled: true },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: '18:00', dose: '6.0', unit: 'U', enabled: true },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: null,
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-006',
    residentId: 'R-001',
    medicationName: 'Paracetamol Accord 500 mg tabletes',
    activeIngredient: 'Paracetamolum',
    form: 'tabletes',
    prescribedDate: '2023-12-04',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: 'pie sāpēm vai ja t>37,5C',
    conditional: true,
    conditionText: 'pie sāpēm vai ja t>37,5C',
    frequency: 'as_needed',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-007',
    residentId: 'R-001',
    medicationName: 'Torasemid HEXAL 50 mg tabletes',
    activeIngredient: 'Torasemidum',
    form: 'tabletes',
    prescribedDate: '2022-05-16',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: '08:00', dose: '50.0', unit: 'mg', enabled: true },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: '1/2 tab. lietot otrdien un sestdien, bet ceturtdien 50mg. No 16.09. pa 50 mg 3x nedēļā.',
    conditional: false,
    conditionText: null,
    frequency: 'specific_days',
    specificDays: ['tuesday', 'thursday', 'saturday'],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-008',
    residentId: 'R-001',
    medicationName: 'Regulax Picosulphate 7,23 mg/ml pilieni iekšķīgai lietošanai, šķīdums',
    activeIngredient: 'Natrii picosulfas',
    form: 'pilieni',
    prescribedDate: '2024-03-18',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: '08:30', dose: '5.0', unit: 'ml', enabled: true },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: 'pa 5 pil 3x nedēļā- pirmd., trešd., piektdien.',
    conditional: false,
    conditionText: null,
    frequency: 'specific_days',
    specificDays: ['monday', 'wednesday', 'friday'],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-009',
    residentId: 'R-001',
    medicationName: 'Olanzapine Accord 5 mg apvalkotās tabletes',
    activeIngredient: 'Olanzapinum',
    form: 'tabletes',
    prescribedDate: '2022-05-16',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: '20:30', dose: '2.5', unit: 'mg', enabled: true }
    },
    instructions: 'no 15.05.2023. - 2.5mg. No 16.09.2023 5 mg (Korole).No 01.09.2024 pa 2.5 mg uz nakti (Korole)',
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },

  // Resident R-002 prescriptions
  {
    id: 'P-010',
    residentId: 'R-002',
    medicationName: 'Metformin Accord 500 mg tabletes',
    activeIngredient: 'Metforminum',
    form: 'tabletes',
    prescribedDate: '2023-01-10',
    prescribedBy: 'Dr. Liepiņš',
    validUntil: null,
    schedule: {
      morning: { time: '08:00', dose: '500', unit: 'mg', enabled: true },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: '18:00', dose: '500', unit: 'mg', enabled: true },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: 'Lietot kopā ar ēdienu',
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },
  {
    id: 'P-011',
    residentId: 'R-002',
    medicationName: 'Lisinopril Actavis 10 mg tabletes',
    activeIngredient: 'Lisinoprilum',
    form: 'tabletes',
    prescribedDate: '2023-01-10',
    prescribedBy: 'Dr. Liepiņš',
    validUntil: null,
    schedule: {
      morning: { time: '08:00', dose: '10', unit: 'mg', enabled: true },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: null,
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  },

  // Resident R-003 prescriptions
  {
    id: 'P-012',
    residentId: 'R-003',
    medicationName: 'Atorvastatin Teva 20 mg tabletes',
    activeIngredient: 'Atorvastatinum',
    form: 'tabletes',
    prescribedDate: '2024-06-01',
    prescribedBy: 'Dr. Kalniņa',
    validUntil: null,
    schedule: {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: '21:00', dose: '20', unit: 'mg', enabled: true }
    },
    instructions: null,
    conditional: false,
    conditionText: null,
    frequency: 'daily',
    specificDays: [],
    status: 'active',
    notes: ''
  }
];

// Generate administration logs for the past 14 days
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

// Staff members for variety
const staffMembers = ['Māsa Ilze', 'Māsa Anna', 'Gints Fricbergs', 'Māsa Līga'];

// Refusal reasons
const refusalReasons = [
  'Rezidents atteicās bez paskaidrojuma',
  'Rezidents gulēja',
  'Rezidents nejutās labi',
  'Rezidents atstāja telpas'
];

// Generate date string for N days ago
function getDateNDaysAgo(n) {
  const date = new Date(today);
  date.setDate(date.getDate() - n);
  return date.toISOString().split('T')[0];
}

// Get day of week for a date string (0 = Sunday, 6 = Saturday)
function getDayOfWeek(dateStr) {
  return new Date(dateStr).getDay();
}

// Check if prescription should be administered on given date
function shouldAdminister(prescription, dateStr) {
  if (prescription.frequency === 'daily') return true;
  if (prescription.frequency === 'as_needed') return false;
  if (prescription.frequency === 'specific_days') {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = getDayOfWeek(dateStr);
    return prescription.specificDays.includes(dayNames[dayOfWeek]);
  }
  return true;
}

// Generate historical logs
function generateHistoricalLogs() {
  const logs = [];
  let logId = 1;

  // Generate logs for past 14 days (not including today)
  for (let daysAgo = 13; daysAgo >= 1; daysAgo--) {
    const dateStr = getDateNDaysAgo(daysAgo);

    // R-001 prescriptions
    mockPrescriptions.filter(p => p.residentId === 'R-001' && p.status === 'active').forEach(p => {
      if (!shouldAdminister(p, dateStr)) return;

      ['morning', 'noon', 'evening', 'night'].forEach(slot => {
        if (p.schedule[slot]?.enabled) {
          // Random chance of refusal (5%)
          const isRefused = Math.random() < 0.05;
          const staff = staffMembers[Math.floor(Math.random() * staffMembers.length)];

          logs.push({
            id: `MA-HIST-${logId++}`,
            prescriptionId: p.id,
            residentId: 'R-001',
            date: dateStr,
            timeSlot: slot,
            status: isRefused ? 'refused' : 'given',
            refusalReason: isRefused ? refusalReasons[Math.floor(Math.random() * refusalReasons.length)] : null,
            administeredBy: staff,
            administeredAt: `${dateStr}T${p.schedule[slot].time}:00`,
            notes: isRefused ? 'Mēģināsim vēlāk' : ''
          });
        }
      });
    });

    // R-002 prescriptions
    mockPrescriptions.filter(p => p.residentId === 'R-002' && p.status === 'active').forEach(p => {
      if (!shouldAdminister(p, dateStr)) return;

      ['morning', 'noon', 'evening', 'night'].forEach(slot => {
        if (p.schedule[slot]?.enabled) {
          const isRefused = Math.random() < 0.03; // Lower refusal rate
          const staff = staffMembers[Math.floor(Math.random() * staffMembers.length)];

          logs.push({
            id: `MA-HIST-${logId++}`,
            prescriptionId: p.id,
            residentId: 'R-002',
            date: dateStr,
            timeSlot: slot,
            status: isRefused ? 'refused' : 'given',
            refusalReason: isRefused ? refusalReasons[Math.floor(Math.random() * refusalReasons.length)] : null,
            administeredBy: staff,
            administeredAt: `${dateStr}T${p.schedule[slot].time}:00`,
            notes: ''
          });
        }
      });
    });

    // R-003 prescriptions
    mockPrescriptions.filter(p => p.residentId === 'R-003' && p.status === 'active').forEach(p => {
      if (!shouldAdminister(p, dateStr)) return;

      ['morning', 'noon', 'evening', 'night'].forEach(slot => {
        if (p.schedule[slot]?.enabled) {
          const staff = staffMembers[Math.floor(Math.random() * staffMembers.length)];

          logs.push({
            id: `MA-HIST-${logId++}`,
            prescriptionId: p.id,
            residentId: 'R-003',
            date: dateStr,
            timeSlot: slot,
            status: 'given',
            refusalReason: null,
            administeredBy: staff,
            administeredAt: `${dateStr}T${p.schedule[slot].time}:00`,
            notes: ''
          });
        }
      });
    });
  }

  // Add today's logs
  const todayLogs = [
    {
      id: `MA-TODAY-1`,
      prescriptionId: 'P-001',
      residentId: 'R-001',
      date: todayStr,
      timeSlot: 'morning',
      status: 'given',
      refusalReason: null,
      administeredBy: 'Gints Fricbergs',
      administeredAt: `${todayStr}T07:35:00`,
      notes: ''
    },
    {
      id: `MA-TODAY-2`,
      prescriptionId: 'P-004',
      residentId: 'R-001',
      date: todayStr,
      timeSlot: 'morning',
      status: 'given',
      refusalReason: null,
      administeredBy: 'Gints Fricbergs',
      administeredAt: `${todayStr}T08:32:00`,
      notes: ''
    },
    {
      id: `MA-TODAY-3`,
      prescriptionId: 'P-005',
      residentId: 'R-001',
      date: todayStr,
      timeSlot: 'morning',
      status: 'given',
      refusalReason: null,
      administeredBy: 'Gints Fricbergs',
      administeredAt: `${todayStr}T08:35:00`,
      notes: ''
    },
    {
      id: `MA-TODAY-4`,
      prescriptionId: 'P-008',
      residentId: 'R-001',
      date: todayStr,
      timeSlot: 'morning',
      status: 'refused',
      refusalReason: 'Rezidents atteicās bez paskaidrojuma',
      administeredBy: 'Gints Fricbergs',
      administeredAt: `${todayStr}T08:40:00`,
      notes: 'Mēģināsim vēlreiz pusdienās'
    },
    {
      id: `MA-TODAY-5`,
      prescriptionId: 'P-010',
      residentId: 'R-002',
      date: todayStr,
      timeSlot: 'morning',
      status: 'given',
      refusalReason: null,
      administeredBy: 'Māsa Anna',
      administeredAt: `${todayStr}T08:05:00`,
      notes: ''
    },
    {
      id: `MA-TODAY-6`,
      prescriptionId: 'P-011',
      residentId: 'R-002',
      date: todayStr,
      timeSlot: 'morning',
      status: 'given',
      refusalReason: null,
      administeredBy: 'Māsa Anna',
      administeredAt: `${todayStr}T08:05:00`,
      notes: ''
    }
  ];

  return [...logs, ...todayLogs];
}

export const mockAdministrationLogs = generateHistoricalLogs();

// Helper to get all data
export function getMockData() {
  return {
    residents: mockResidents,
    prescriptions: mockPrescriptions,
    administrationLogs: mockAdministrationLogs
  };
}

// Helper to get resident by ID
export function getMockResident(residentId) {
  return mockResidents.find(r => r.id === residentId) || null;
}

// Helper to get prescriptions for a resident
export function getMockPrescriptionsForResident(residentId) {
  return mockPrescriptions.filter(p => p.residentId === residentId && p.status === 'active');
}

// Helper to get administration logs for a resident on a specific date
export function getMockAdministrationLogs(residentId, date = todayStr) {
  return mockAdministrationLogs.filter(log => log.residentId === residentId && log.date === date);
}
