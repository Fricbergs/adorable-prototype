/**
 * Resident Data Helpers
 * CRUD operations for resident medical data:
 * - Diagnoses
 * - Vitals
 * - Vaccinations
 * - Assessments (Doctor, Nurse, Psychiatrist, Physiotherapy)
 * - Risk Scales (Morse, Braden, Barthel)
 * - Technical Aids
 */

import { STORAGE_KEYS, RISK_SCALES } from '../constants/residentConstants';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================
// DIAGNOSES
// ============================================

export function getResidentDiagnoses(residentId) {
  const all = getFromStorage(STORAGE_KEYS.DIAGNOSES);
  return all
    .filter(d => d.residentId === residentId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addDiagnosis(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.DIAGNOSES);

  const newDiagnosis = {
    id: generateId('DX'),
    residentId,
    code: data.code || '',
    description: data.description || '',
    diagnosedDate: data.diagnosedDate || new Date().toISOString().split('T')[0],
    status: data.status || 'active',
    notes: data.notes || '',
    createdBy: data.createdBy || 'Lietotājs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  all.push(newDiagnosis);
  saveToStorage(STORAGE_KEYS.DIAGNOSES, all);

  return newDiagnosis;
}

export function updateDiagnosis(diagnosisId, updates) {
  const all = getFromStorage(STORAGE_KEYS.DIAGNOSES);
  const index = all.findIndex(d => d.id === diagnosisId);

  if (index === -1) throw new Error('Diagnoze nav atrasta');

  all[index] = {
    ...all[index],
    ...updates,
    id: all[index].id,
    residentId: all[index].residentId,
    updatedAt: new Date().toISOString()
  };

  saveToStorage(STORAGE_KEYS.DIAGNOSES, all);
  return all[index];
}

export function deleteDiagnosis(diagnosisId) {
  const all = getFromStorage(STORAGE_KEYS.DIAGNOSES);
  const filtered = all.filter(d => d.id !== diagnosisId);
  saveToStorage(STORAGE_KEYS.DIAGNOSES, filtered);
  return true;
}

// ============================================
// VITALS
// ============================================

export function getLatestVitals(residentId) {
  const all = getFromStorage(STORAGE_KEYS.VITALS_LOG);
  const residentVitals = all.filter(v => v.residentId === residentId);

  if (residentVitals.length === 0) return null;

  return residentVitals.sort((a, b) =>
    new Date(b.measuredAt) - new Date(a.measuredAt)
  )[0];
}

export function getVitalsHistory(residentId, limit = 50) {
  const all = getFromStorage(STORAGE_KEYS.VITALS_LOG);
  return all
    .filter(v => v.residentId === residentId)
    .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))
    .slice(0, limit);
}

export function recordVitals(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.VITALS_LOG);

  const newVitals = {
    id: generateId('VIT'),
    residentId,
    temperature: data.temperature || null,
    bloodPressure: data.bloodPressure || '',
    pulse: data.pulse || null,
    oxygen: data.oxygen || null,
    weight: data.weight || null,
    bloodSugar: data.bloodSugar || null,
    measuredAt: data.measuredAt || new Date().toISOString(),
    measuredBy: data.measuredBy || 'Lietotājs',
    notes: data.notes || ''
  };

  all.push(newVitals);
  saveToStorage(STORAGE_KEYS.VITALS_LOG, all);

  return newVitals;
}

// ============================================
// VACCINATIONS
// ============================================

export function getResidentVaccinations(residentId) {
  const all = getFromStorage(STORAGE_KEYS.VACCINATIONS);
  return all
    .filter(v => v.residentId === residentId)
    .sort((a, b) => new Date(b.administeredDate) - new Date(a.administeredDate));
}

export function addVaccination(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.VACCINATIONS);

  const newVaccination = {
    id: generateId('VAC'),
    residentId,
    vaccineName: data.vaccineName || '',
    vaccineType: data.vaccineType || 'other',
    series: data.series || '',
    administeredDate: data.administeredDate || new Date().toISOString().split('T')[0],
    expirationDate: data.expirationDate || null,
    administeredBy: data.administeredBy || 'Lietotājs',
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };

  all.push(newVaccination);
  saveToStorage(STORAGE_KEYS.VACCINATIONS, all);

  return newVaccination;
}

export function updateVaccination(vaccinationId, updates) {
  const all = getFromStorage(STORAGE_KEYS.VACCINATIONS);
  const index = all.findIndex(v => v.id === vaccinationId);

  if (index === -1) throw new Error('Vakcinācija nav atrasta');

  all[index] = {
    ...all[index],
    ...updates,
    id: all[index].id,
    residentId: all[index].residentId
  };

  saveToStorage(STORAGE_KEYS.VACCINATIONS, all);
  return all[index];
}

export function deleteVaccination(vaccinationId) {
  const all = getFromStorage(STORAGE_KEYS.VACCINATIONS);
  const filtered = all.filter(v => v.id !== vaccinationId);
  saveToStorage(STORAGE_KEYS.VACCINATIONS, filtered);
  return true;
}

// ============================================
// ASSESSMENTS - Generic Helper
// ============================================

function getAssessments(storageKey, residentId) {
  const all = getFromStorage(storageKey);
  return all
    .filter(a => a.residentId === residentId)
    .sort((a, b) => new Date(b.assessedAt) - new Date(a.assessedAt));
}

function addAssessment(storageKey, prefix, residentId, data) {
  const all = getFromStorage(storageKey);

  const newAssessment = {
    id: generateId(prefix),
    residentId,
    assessedAt: data.assessedAt || new Date().toISOString(),
    assessedBy: data.assessedBy || 'Lietotājs',
    notes: data.notes || '',
    findings: data.findings || '',
    recommendations: data.recommendations || '',
    ...data,
    createdAt: new Date().toISOString()
  };

  all.push(newAssessment);
  saveToStorage(storageKey, all);

  return newAssessment;
}

// ============================================
// DOCTOR ASSESSMENTS
// ============================================

export function getDoctorAssessments(residentId) {
  return getAssessments(STORAGE_KEYS.ASSESSMENTS_DOCTOR, residentId);
}

export function addDoctorAssessment(residentId, data) {
  return addAssessment(STORAGE_KEYS.ASSESSMENTS_DOCTOR, 'DOC', residentId, data);
}

// ============================================
// NURSE ASSESSMENTS
// ============================================

export function getNurseAssessments(residentId) {
  return getAssessments(STORAGE_KEYS.ASSESSMENTS_NURSE, residentId);
}

export function addNurseAssessment(residentId, data) {
  return addAssessment(STORAGE_KEYS.ASSESSMENTS_NURSE, 'NRS', residentId, data);
}

// ============================================
// PSYCHIATRIST ASSESSMENTS
// ============================================

export function getPsychiatristAssessments(residentId) {
  return getAssessments(STORAGE_KEYS.ASSESSMENTS_PSYCH, residentId);
}

export function addPsychiatristAssessment(residentId, data) {
  return addAssessment(STORAGE_KEYS.ASSESSMENTS_PSYCH, 'PSY', residentId, data);
}

// ============================================
// PHYSIOTHERAPIST ASSESSMENTS
// ============================================

export function getPhysiotherapistAssessments(residentId) {
  return getAssessments(STORAGE_KEYS.ASSESSMENTS_PHYSIO, residentId);
}

export function addPhysiotherapistAssessment(residentId, data) {
  return addAssessment(STORAGE_KEYS.ASSESSMENTS_PHYSIO, 'PHY', residentId, data);
}

// ============================================
// RISK SCALES - MORSE (Fall Risk)
// ============================================

export function getMorseAssessments(residentId) {
  const all = getFromStorage(STORAGE_KEYS.RISK_MORSE);
  return all
    .filter(a => a.residentId === residentId)
    .sort((a, b) => new Date(b.assessedAt) - new Date(a.assessedAt));
}

export function getLatestMorseScore(residentId) {
  const assessments = getMorseAssessments(residentId);
  return assessments.length > 0 ? assessments[0] : null;
}

export function recordMorseAssessment(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.RISK_MORSE);

  // Calculate total score from factors
  const factors = data.factors || {};
  const score = (factors.fallHistory || 0) +
                (factors.secondaryDiagnosis || 0) +
                (factors.ambulatoryAid || 0) +
                (factors.ivTherapy || 0) +
                (factors.gait || 0) +
                (factors.mentalStatus || 0);

  // Determine risk level
  let riskLevel = 'low';
  if (score >= 51) riskLevel = 'high';
  else if (score >= 25) riskLevel = 'medium';

  const newAssessment = {
    id: generateId('MORSE'),
    residentId,
    scaleType: 'morse',
    score,
    riskLevel,
    factors,
    assessedAt: data.assessedAt || new Date().toISOString(),
    assessedBy: data.assessedBy || 'Lietotājs',
    notes: data.notes || ''
  };

  all.push(newAssessment);
  saveToStorage(STORAGE_KEYS.RISK_MORSE, all);

  return newAssessment;
}

// ============================================
// RISK SCALES - BRADEN (Pressure Ulcer Risk)
// ============================================

export function getBradenAssessments(residentId) {
  const all = getFromStorage(STORAGE_KEYS.RISK_BRADEN);
  return all
    .filter(a => a.residentId === residentId)
    .sort((a, b) => new Date(b.assessedAt) - new Date(a.assessedAt));
}

export function getLatestBradenScore(residentId) {
  const assessments = getBradenAssessments(residentId);
  return assessments.length > 0 ? assessments[0] : null;
}

export function recordBradenAssessment(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.RISK_BRADEN);

  // Calculate total score from factors (higher is better for Braden)
  const factors = data.factors || {};
  const score = (factors.sensoryPerception || 0) +
                (factors.moisture || 0) +
                (factors.activity || 0) +
                (factors.mobility || 0) +
                (factors.nutrition || 0) +
                (factors.frictionShear || 0);

  // Determine risk level (lower score = higher risk)
  let riskLevel = 'low';
  if (score <= 12) riskLevel = 'very_high';
  else if (score <= 14) riskLevel = 'high';
  else if (score <= 18) riskLevel = 'medium';

  const newAssessment = {
    id: generateId('BRADEN'),
    residentId,
    scaleType: 'braden',
    score,
    riskLevel,
    factors,
    assessedAt: data.assessedAt || new Date().toISOString(),
    assessedBy: data.assessedBy || 'Lietotājs',
    notes: data.notes || ''
  };

  all.push(newAssessment);
  saveToStorage(STORAGE_KEYS.RISK_BRADEN, all);

  return newAssessment;
}

// ============================================
// RISK SCALES - BARTHEL (ADL Index)
// ============================================

export function getBarthelAssessments(residentId) {
  const all = getFromStorage(STORAGE_KEYS.RISK_BARTHEL);
  return all
    .filter(a => a.residentId === residentId)
    .sort((a, b) => new Date(b.assessedAt) - new Date(a.assessedAt));
}

export function getLatestBarthelIndex(residentId) {
  const assessments = getBarthelAssessments(residentId);
  return assessments.length > 0 ? assessments[0] : null;
}

export function recordBarthelAssessment(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.RISK_BARTHEL);

  // Calculate total score from factors
  const factors = data.factors || {};
  const score = (factors.feeding || 0) +
                (factors.bathing || 0) +
                (factors.grooming || 0) +
                (factors.dressing || 0) +
                (factors.bowels || 0) +
                (factors.bladder || 0) +
                (factors.toiletUse || 0) +
                (factors.transfers || 0) +
                (factors.mobility || 0) +
                (factors.stairs || 0);

  // Determine dependency level
  let riskLevel = 'independent';
  if (score <= 20) riskLevel = 'total';
  else if (score <= 60) riskLevel = 'severe';
  else if (score <= 90) riskLevel = 'moderate';
  else if (score <= 99) riskLevel = 'slight';

  const newAssessment = {
    id: generateId('BARTHEL'),
    residentId,
    scaleType: 'barthel',
    score,
    riskLevel,
    factors,
    assessedAt: data.assessedAt || new Date().toISOString(),
    assessedBy: data.assessedBy || 'Lietotājs',
    notes: data.notes || ''
  };

  all.push(newAssessment);
  saveToStorage(STORAGE_KEYS.RISK_BARTHEL, all);

  return newAssessment;
}

// ============================================
// TECHNICAL AIDS
// ============================================

export function getResidentTechnicalAids(residentId) {
  const all = getFromStorage(STORAGE_KEYS.TECHNICAL_AIDS);
  return all
    .filter(a => a.residentId === residentId)
    .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
}

export function addTechnicalAid(residentId, data) {
  const all = getFromStorage(STORAGE_KEYS.TECHNICAL_AIDS);

  const newAid = {
    id: generateId('AID'),
    residentId,
    category: data.category || 'other',
    aidType: data.aidType || '',
    description: data.description || '',
    assignedAt: data.assignedAt || new Date().toISOString(),
    assignedBy: data.assignedBy || 'Lietotājs',
    notes: data.notes || '',
    status: data.status || 'active'
  };

  all.push(newAid);
  saveToStorage(STORAGE_KEYS.TECHNICAL_AIDS, all);

  return newAid;
}

export function updateTechnicalAid(aidId, updates) {
  const all = getFromStorage(STORAGE_KEYS.TECHNICAL_AIDS);
  const index = all.findIndex(a => a.id === aidId);

  if (index === -1) throw new Error('Palīglīdzeklis nav atrasts');

  all[index] = {
    ...all[index],
    ...updates,
    id: all[index].id,
    residentId: all[index].residentId
  };

  saveToStorage(STORAGE_KEYS.TECHNICAL_AIDS, all);
  return all[index];
}

export function removeTechnicalAid(aidId) {
  const all = getFromStorage(STORAGE_KEYS.TECHNICAL_AIDS);
  const index = all.findIndex(a => a.id === aidId);

  if (index !== -1) {
    all[index].status = 'removed';
    all[index].removedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.TECHNICAL_AIDS, all);
  }

  return true;
}

// ============================================
// RISK LEVEL HELPERS
// ============================================

export function getRiskLevelConfig(scaleType, riskLevel) {
  const scale = RISK_SCALES[scaleType];
  if (!scale) return null;

  const level = scale.levels.find(l => l.level === riskLevel);
  return level || null;
}

export function getRiskLevelColor(scaleType, riskLevel) {
  const config = getRiskLevelConfig(scaleType, riskLevel);
  if (!config) return 'gray';
  return config.color;
}

// ============================================
// DATA SUMMARY FOR PROFILE
// ============================================

export function getResidentDataSummary(residentId) {
  return {
    diagnoses: getResidentDiagnoses(residentId).length,
    vitals: getLatestVitals(residentId),
    vaccinations: getResidentVaccinations(residentId).length,
    doctorAssessments: getDoctorAssessments(residentId).length,
    nurseAssessments: getNurseAssessments(residentId).length,
    psychiatristAssessments: getPsychiatristAssessments(residentId).length,
    physiotherapistAssessments: getPhysiotherapistAssessments(residentId).length,
    morseScore: getLatestMorseScore(residentId),
    bradenScore: getLatestBradenScore(residentId),
    barthelIndex: getLatestBarthelIndex(residentId),
    technicalAids: getResidentTechnicalAids(residentId).filter(a => a.status === 'active').length
  };
}
