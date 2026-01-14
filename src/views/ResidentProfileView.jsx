import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Activity, ClipboardList, Stethoscope, Brain,
  Syringe, Pill, HeartPulse, AlertTriangle, AlertCircle,
  Package, Wrench, User, ChevronRight, Plus, Printer, Calendar, CalendarDays, History
} from 'lucide-react';
import PageShell from '../components/PageShell';
import ResidentHeader from '../components/resident/ResidentHeader';
import ProfileSection from '../components/resident/ProfileSection';
import VitalsSection from '../components/resident/VitalsSection';
import DiagnosesSection from '../components/resident/DiagnosesSection';
import DiagnosisModal from '../components/resident/DiagnosisModal';
import VitalsModal from '../components/resident/VitalsModal';
import VaccinationModal from '../components/resident/VaccinationModal';
import DoctorExamModal from '../components/resident/DoctorExamModal';
import PsychiatristExamModal from '../components/resident/PsychiatristExamModal';
import MorseScaleModal from '../components/resident/MorseScaleModal';
import BradenScaleModal from '../components/resident/BradenScaleModal';
import TechnicalAidsModal from '../components/resident/TechnicalAidsModal';
import PrescriptionTable, { PrescriptionCards } from '../components/prescriptions/PrescriptionTable';
import AllergiesAlert from '../components/prescriptions/AllergiesAlert';
import PrescriptionModal from '../components/prescriptions/PrescriptionModal';
import RefusalModal from '../components/prescriptions/RefusalModal';
import CancellationModal from '../components/prescriptions/CancellationModal';
import WeeklyPrescriptionView from '../components/prescriptions/WeeklyPrescriptionView';
import MonthlyPrescriptionView from '../components/prescriptions/MonthlyPrescriptionView';
import HistoryView from '../components/prescriptions/HistoryView';
import ResidentInventoryTable from '../components/inventory/ResidentInventoryTable';
import InventoryAlerts from '../components/inventory/InventoryAlerts';
import { getResidentById } from '../domain/residentHelpers';
import {
  getResidentDiagnoses,
  getLatestVitals,
  getResidentVaccinations,
  getDoctorAssessments,
  getNurseAssessments,
  getPsychiatristAssessments,
  getPhysiotherapistAssessments,
  getLatestMorseScore,
  getLatestBradenScore,
  getLatestBarthelIndex,
  getResidentTechnicalAids,
  getResidentDataSummary,
} from '../domain/residentDataHelpers';
import {
  getActivePrescriptionsForResident,
} from '../domain/prescriptionHelpers';
import {
  getResidentInventory,
  getResidentInventoryAlerts,
  getResidentInventorySummary
} from '../domain/inventoryHelpers';
import { RISK_SCALES } from '../constants/residentConstants';

// Top-level tabs matching Adoro production structure
const MAIN_TABS = [
  { id: 'basic', label: 'Pamatinformācija' },
  { id: 'housing', label: 'Izmitināšana' },
  { id: 'health', label: 'Veselības aprūpe' },
  { id: 'social', label: 'Sociālā aprūpe' },
  { id: 'care', label: 'Aprūpe' },
  { id: 'attachments', label: 'Pielikumi' },
  { id: 'services', label: 'Papildpakalpojumi' },
];

/**
 * ResidentProfileView - Unified resident profile with tabs
 * Combines profile data, prescriptions, and inventory in one view
 */
const ResidentProfileView = ({ residentId, onBack, onPrint }) => {
  // Main tab state (health/prescriptions is default/primary view)
  const [activeMainTab, setActiveMainTab] = useState('health');

  // Profile data state
  const [resident, setResident] = useState(null);
  const [summary, setSummary] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [doctorAssessments, setDoctorAssessments] = useState([]);
  const [nurseAssessments, setNurseAssessments] = useState([]);
  const [psychiatristAssessments, setPsychiatristAssessments] = useState([]);
  const [physioAssessments, setPhysioAssessments] = useState([]);
  const [morseScore, setMorseScore] = useState(null);
  const [bradenScore, setBradenScore] = useState(null);
  const [barthelIndex, setBarthelIndex] = useState(null);
  const [technicalAids, setTechnicalAids] = useState([]);

  // Prescription state
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionViewMode, setPrescriptionViewMode] = useState('today');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [showRefusalModal, setShowRefusalModal] = useState(false);
  const [refusalContext, setRefusalContext] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellingPrescription, setCancellingPrescription] = useState(null);

  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null);

  // Profile modal states
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [showDoctorExamModal, setShowDoctorExamModal] = useState(false);
  const [showPsychiatristExamModal, setShowPsychiatristExamModal] = useState(false);
  const [showMorseModal, setShowMorseModal] = useState(false);
  const [showBradenModal, setShowBradenModal] = useState(false);
  const [showTechnicalAidsModal, setShowTechnicalAidsModal] = useState(false);

  // Load all data
  useEffect(() => {
    if (residentId) {
      const residentData = getResidentById(residentId);
      setResident(residentData);

      if (residentData) {
        // Profile data
        setSummary(getResidentDataSummary(residentId));
        setDiagnoses(getResidentDiagnoses(residentId));
        setVitals(getLatestVitals(residentId));
        setVaccinations(getResidentVaccinations(residentId));
        setDoctorAssessments(getDoctorAssessments(residentId));
        setNurseAssessments(getNurseAssessments(residentId));
        setPsychiatristAssessments(getPsychiatristAssessments(residentId));
        setPhysioAssessments(getPhysiotherapistAssessments(residentId));
        setMorseScore(getLatestMorseScore(residentId));
        setBradenScore(getLatestBradenScore(residentId));
        setBarthelIndex(getLatestBarthelIndex(residentId));
        setTechnicalAids(getResidentTechnicalAids(residentId).filter(a => a.status === 'active'));

        // Prescription data
        setPrescriptions(getActivePrescriptionsForResident(residentId));

        // Inventory data
        setInventory(getResidentInventory(residentId));
        setInventoryAlerts(getResidentInventoryAlerts(residentId));
        setInventorySummary(getResidentInventorySummary(residentId));
      }
    }
  }, [residentId]);

  // Refresh prescriptions
  const refreshPrescriptions = () => {
    if (residentId) {
      setPrescriptions(getActivePrescriptionsForResident(residentId));
    }
  };

  // Refresh inventory
  const refreshInventory = () => {
    if (residentId) {
      setInventory(getResidentInventory(residentId));
      setInventoryAlerts(getResidentInventoryAlerts(residentId));
      setInventorySummary(getResidentInventorySummary(residentId));
    }
  };

  // Refresh profile data
  const refreshProfileData = () => {
    if (residentId) {
      setSummary(getResidentDataSummary(residentId));
      setDiagnoses(getResidentDiagnoses(residentId));
      setVitals(getLatestVitals(residentId));
      setVaccinations(getResidentVaccinations(residentId));
      setDoctorAssessments(getDoctorAssessments(residentId));
      setNurseAssessments(getNurseAssessments(residentId));
      setPsychiatristAssessments(getPsychiatristAssessments(residentId));
      setPhysioAssessments(getPhysiotherapistAssessments(residentId));
      setMorseScore(getLatestMorseScore(residentId));
      setBradenScore(getLatestBradenScore(residentId));
      setBarthelIndex(getLatestBarthelIndex(residentId));
      setTechnicalAids(getResidentTechnicalAids(residentId).filter(a => a.status === 'active'));
    }
  };

  // Profile modal handlers
  const handleAddDiagnosis = () => {
    setEditingDiagnosis(null);
    setShowDiagnosisModal(true);
  };

  const handleDiagnosisSave = () => {
    setShowDiagnosisModal(false);
    setEditingDiagnosis(null);
    refreshProfileData();
  };

  const handleAddVitals = () => {
    setShowVitalsModal(true);
  };

  const handleVitalsSave = () => {
    setShowVitalsModal(false);
    refreshProfileData();
  };

  const handleAddVaccination = () => {
    setEditingVaccination(null);
    setShowVaccinationModal(true);
  };

  const handleVaccinationSave = () => {
    setShowVaccinationModal(false);
    setEditingVaccination(null);
    refreshProfileData();
  };

  const handleAddDoctorExam = () => {
    setShowDoctorExamModal(true);
  };

  const handleDoctorExamSave = () => {
    setShowDoctorExamModal(false);
    refreshProfileData();
  };

  const handleAddPsychiatristExam = () => {
    setShowPsychiatristExamModal(true);
  };

  const handlePsychiatristExamSave = () => {
    setShowPsychiatristExamModal(false);
    refreshProfileData();
  };

  const handleAddMorse = () => {
    setShowMorseModal(true);
  };

  const handleMorseSave = () => {
    setShowMorseModal(false);
    refreshProfileData();
  };

  const handleAddBraden = () => {
    setShowBradenModal(true);
  };

  const handleBradenSave = () => {
    setShowBradenModal(false);
    refreshProfileData();
  };

  const handleAddTechnicalAids = () => {
    setShowTechnicalAidsModal(true);
  };

  const handleTechnicalAidsSave = () => {
    setShowTechnicalAidsModal(false);
    refreshProfileData();
  };

  // Prescription handlers
  const handleCreatePrescription = () => {
    setEditingPrescription(null);
    setShowPrescriptionModal(true);
  };

  const handleRefuse = (prescription, timeSlot) => {
    setRefusalContext({ prescription, timeSlot });
    setShowRefusalModal(true);
  };

  const handlePrescriptionSave = () => {
    setShowPrescriptionModal(false);
    setEditingPrescription(null);
    refreshPrescriptions();
  };

  const handleRefusalSave = () => {
    setShowRefusalModal(false);
    setRefusalContext(null);
    refreshPrescriptions();
    refreshInventory();
  };

  // Cancel prescription (pause or discontinue)
  const handleCancelPrescription = (prescription) => {
    setCancellingPrescription(prescription);
    setShowCancellationModal(true);
  };

  const handleCancellationSave = () => {
    setShowCancellationModal(false);
    setCancellingPrescription(null);
    refreshPrescriptions();
  };

  // Edit prescription
  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  if (!resident) {
    return (
      <PageShell>
        <div className="text-center py-12 text-gray-500">
          <p>Rezidents nav atrasts</p>
          <button
            onClick={onBack}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Atgriezties
          </button>
        </div>
      </PageShell>
    );
  }

  // Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('lv-LV');
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getRiskBadge = (score, scaleType) => {
    if (!score) return null;
    const scale = RISK_SCALES[scaleType];
    const level = scale?.levels.find(l => l.level === score.riskLevel);
    return level ? { label: level.label, color: level.color } : null;
  };

  const age = calculateAge(resident.birthDate);

  return (
    <PageShell>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={onBack} className="hover:text-orange-600">Rezidenti</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{resident.firstName} {resident.lastName}</span>
        </div>

        {/* Resident Header Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {resident.firstName} {resident.lastName}
                  </h1>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-sm font-medium rounded border border-orange-200">
                    {resident.careLevel || 'GI 2'}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  {resident.personalCode || '—'} • {age} gadi • Istaba {resident.roomNumber}
                </div>
              </div>
            </div>
            {onPrint && (
              <button
                onClick={onPrint}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Printer className="w-4 h-4" />
                Drukāt
              </button>
            )}
          </div>
        </div>

        {/* Main Tab Navigation - Adoro style horizontal tabs */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex gap-0 px-6 overflow-x-auto">
              {MAIN_TABS.map(tab => {
                const isActive = activeMainTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMainTab(tab.id)}
                    className={`
                      whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
                      ${isActive
                        ? 'text-orange-600 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700 border-transparent'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {/* PAMATINFORMĀCIJA TAB - Basic profile info */}
            {activeMainTab === 'basic' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personas dati</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vārds, uzvārds</p>
                      <p className="font-medium">{resident.firstName} {resident.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Personas kods</p>
                      <p className="font-medium">{resident.personalCode || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dzimšanas datums</p>
                      <p className="font-medium">{formatDate(resident.birthDate) || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vecums</p>
                      <p className="font-medium">{age} gadi</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Aprūpes līmenis</p>
                      <p className="font-medium">{resident.careLevel || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ģimenes ārsts</p>
                      <p className="font-medium">{resident.familyDoctor || '—'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Deklarētā adrese</p>
                      <p className="font-medium">{resident.declaredAddress || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact persons - prominently displayed for emergency access */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Kontaktpersonas
                    </h3>
                    <button
                      onClick={() => alert('Kontaktpersonu pievienošana - funkcionalitāte tiks pievienota')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Pievienot
                    </button>
                  </div>
                  {(!resident.contactPersons || resident.contactPersons.length === 0) ? (
                    <p className="text-gray-500">Nav pievienotu kontaktpersonu - ārkārtas gadījumos svarīgi!</p>
                  ) : (
                    <div className="space-y-3">
                      {resident.contactPersons.slice(0, 5).map((contact, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.relationship || 'Radinieks'}</p>
                          </div>
                          <a
                            href={`tel:${contact.phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {contact.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IZMITINĀŠANA TAB - Housing info */}
            {activeMainTab === 'housing' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Izmitināšanas informācija</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Istabas numurs</p>
                      <p className="font-medium">{resident.roomNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gultas vieta</p>
                      <p className="font-medium">{resident.bedNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uzņemšanas datums</p>
                      <p className="font-medium">{formatDate(resident.admissionDate) || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Līguma numurs</p>
                      <p className="font-medium">{resident.contractNumber || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VESELĪBAS APRŪPE TAB - Health care with prescriptions */}
            {activeMainTab === 'health' && (
              <div className="space-y-3">
                {/* Diagnoses */}
                <ProfileSection
                  title="Diagnozes"
                  icon={ClipboardList}
                  count={diagnoses.length}
                  onAdd={handleAddDiagnosis}
                  defaultOpen={diagnoses.length > 0}
                >
                  <DiagnosesSection
                    diagnoses={diagnoses}
                    onEdit={(diagnosis) => {
                      setEditingDiagnosis(diagnosis);
                      setShowDiagnosisModal(true);
                    }}
                    onDelete={() => refreshProfileData()}
                  />
                </ProfileSection>

                {/* Vitals */}
                <ProfileSection
                  title="Māsas apskate"
                  icon={Activity}
                  lastUpdate={vitals ? formatDate(vitals.measuredAt) : null}
                  onAdd={handleAddVitals}
                  onHistory={() => {}}
                  defaultOpen={true}
                >
                  <VitalsSection vitals={vitals} onRecordNew={handleAddVitals} />
                </ProfileSection>

                {/* Doctor Assessment */}
                <ProfileSection
                  title="Ārsta apskate"
                  icon={Stethoscope}
                  count={doctorAssessments.length}
                  lastUpdate={doctorAssessments[0] ? formatDate(doctorAssessments[0].assessedAt) : null}
                  onAdd={handleAddDoctorExam}
                  onHistory={() => {}}
                >
                  {doctorAssessments.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nav apskašu ierakstu</p>
                  ) : (
                    <div className="space-y-2">
                      {doctorAssessments.slice(0, 3).map(a => (
                        <div key={a.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="flex justify-between text-gray-500 text-xs mb-1">
                            <span>{formatDate(a.assessedAt)}</span>
                            <span>{a.assessedBy}</span>
                          </div>
                          <p className="text-gray-700">{a.findings || a.notes || 'Nav piezīmju'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ProfileSection>

                {/* Psychiatrist */}
                <ProfileSection
                  title="Psihiatra apskate"
                  icon={Brain}
                  count={psychiatristAssessments.length}
                  lastUpdate={psychiatristAssessments[0] ? formatDate(psychiatristAssessments[0].assessedAt) : null}
                  onAdd={handleAddPsychiatristExam}
                >
                  {psychiatristAssessments.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nav apskašu ierakstu</p>
                  ) : (
                    <div className="space-y-2">
                      {psychiatristAssessments.slice(0, 3).map(a => (
                        <div key={a.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="flex justify-between text-gray-500 text-xs mb-1">
                            <span>{formatDate(a.assessedAt)}</span>
                            <span>{a.assessedBy}</span>
                          </div>
                          <p className="text-gray-700">{a.findings || a.notes || 'Nav piezīmju'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ProfileSection>

                {/* Vaccinations */}
                <ProfileSection
                  title="Vakcinācija"
                  icon={Syringe}
                  count={vaccinations.length}
                  onAdd={handleAddVaccination}
                >
                  {vaccinations.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nav vakcinācijas ierakstu</p>
                  ) : (
                    <div className="space-y-2">
                      {vaccinations.map(v => (
                        <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{v.vaccineName}</p>
                            <p className="text-sm text-gray-500">
                              Sērija: {v.series || '—'} • Datums: {formatDate(v.administeredDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ProfileSection>

                {/* Risk Scales */}
                <ProfileSection
                  title="Kritienu risks (Morsa skala)"
                  icon={AlertTriangle}
                  badge={morseScore ? getRiskBadge(morseScore, 'morse')?.label : null}
                  badgeColor={morseScore ? getRiskBadge(morseScore, 'morse')?.color : 'gray'}
                  lastUpdate={morseScore ? formatDate(morseScore.assessedAt) : null}
                  onAdd={handleAddMorse}
                >
                  {!morseScore ? (
                    <p className="text-center text-gray-500 py-4">Nav novērtējuma</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Punktu skaits</span>
                      <span className="text-2xl font-bold text-gray-900">{morseScore.score}</span>
                    </div>
                  )}
                </ProfileSection>

                <ProfileSection
                  title="Izgulējumu risks (Bradena skala)"
                  icon={AlertCircle}
                  badge={bradenScore ? getRiskBadge(bradenScore, 'braden')?.label : null}
                  badgeColor={bradenScore ? getRiskBadge(bradenScore, 'braden')?.color : 'gray'}
                  lastUpdate={bradenScore ? formatDate(bradenScore.assessedAt) : null}
                  onAdd={handleAddBraden}
                >
                  {!bradenScore ? (
                    <p className="text-center text-gray-500 py-4">Nav novērtējuma</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Punktu skaits</span>
                      <span className="text-2xl font-bold text-gray-900">{bradenScore.score}</span>
                    </div>
                  )}
                </ProfileSection>

                {/* Technical Aids */}
                <ProfileSection
                  title="Tehniskie palīglīdzekļi"
                  icon={Wrench}
                  count={technicalAids.length}
                  onAdd={handleAddTechnicalAids}
                >
                  {technicalAids.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nav piešķirtu palīglīdzekļu</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {technicalAids.map(aid => (
                        <span key={aid.id} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {aid.description || aid.aidType}
                        </span>
                      ))}
                    </div>
                  )}
                </ProfileSection>

                {/* Ordinācijas (Prescriptions) section within health tab */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordinācijas</h3>

                  {/* Allergies alert */}
                {resident.allergies && resident.allergies.length > 0 && (
                  <AllergiesAlert allergies={resident.allergies} />
                )}

                {/* View toggle + Add button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setPrescriptionViewMode('today')}
                      className={`px-3 py-2 text-sm transition-colors ${
                        prescriptionViewMode === 'today'
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Šodien
                    </button>
                    <button
                      onClick={() => setPrescriptionViewMode('week')}
                      className={`px-3 py-2 text-sm flex items-center gap-1 border-l border-gray-300 transition-colors ${
                        prescriptionViewMode === 'week'
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Nedēļa
                    </button>
                    <button
                      onClick={() => setPrescriptionViewMode('month')}
                      className={`px-3 py-2 text-sm flex items-center gap-1 border-l border-gray-300 transition-colors ${
                        prescriptionViewMode === 'month'
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      Mēnesis
                    </button>
                    <button
                      onClick={() => setPrescriptionViewMode('history')}
                      className={`px-3 py-2 text-sm flex items-center gap-1 border-l border-gray-300 transition-colors ${
                        prescriptionViewMode === 'history'
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      Vēsture
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePrescription}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Pievienot
                  </button>
                </div>

                {/* Prescription content */}
                {prescriptionViewMode === 'today' && (
                  <>
                    <div className="hidden md:block">
                      <PrescriptionTable
                        prescriptions={prescriptions}
                        onRefuse={handleRefuse}
                        onEdit={handleEditPrescription}
                        onCancel={handleCancelPrescription}
                      />
                    </div>
                    <div className="block md:hidden">
                      <PrescriptionCards prescriptions={prescriptions} onRefuse={handleRefuse} />
                    </div>
                  </>
                )}

                {prescriptionViewMode === 'week' && (
                  <WeeklyPrescriptionView
                    prescriptions={prescriptions}
                    residentId={resident.id}
                    onDayClick={() => {}}
                  />
                )}

                {prescriptionViewMode === 'month' && (
                  <MonthlyPrescriptionView
                    prescriptions={prescriptions}
                    residentId={resident.id}
                    residentName={`${resident.firstName} ${resident.lastName}`}
                    onDayClick={() => {}}
                  />
                )}

                {prescriptionViewMode === 'history' && (
                  <HistoryView residentId={resident.id} prescriptions={prescriptions} />
                )}
                </div>
              </div>
            )}

            {/* SOCIĀLĀ APRŪPE TAB - Social care */}
            {activeMainTab === 'social' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  <p>Sociālās aprūpes sadaļa tiks pievienota</p>
                </div>
              </div>
            )}

            {/* APRŪPE TAB - General care */}
            {activeMainTab === 'care' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  <p>Aprūpes sadaļa tiks pievienota</p>
                </div>
              </div>
            )}

            {/* PIELIKUMI TAB - Attachments */}
            {activeMainTab === 'attachments' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  <p>Pielikumu sadaļa tiks pievienota</p>
                </div>
              </div>
            )}

            {/* PAPILDPAKALPOJUMI TAB - Additional services including inventory */}
            {activeMainTab === 'services' && (
              <div className="space-y-4">
                {/* Summary cards */}
                {inventorySummary && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Medikamenti</p>
                      <p className="text-xl font-bold text-gray-900">{inventorySummary.totalItems}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">No noliktavas</p>
                      <p className="text-xl font-bold text-orange-600">{inventorySummary.fromBulk}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">No radiniekiem</p>
                      <p className="text-xl font-bold text-blue-600">{inventorySummary.fromRelatives}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Brīdinājumi</p>
                      <p className={`text-xl font-bold ${inventorySummary.alerts > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {inventorySummary.alerts}
                      </p>
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {inventoryAlerts.length > 0 && (
                  <InventoryAlerts alerts={inventoryAlerts} />
                )}

                {/* Inventory table */}
                {inventory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nav pievienotu medikamentu krājumu
                  </div>
                ) : (
                  <ResidentInventoryTable items={inventory} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPrescriptionModal && (
        <PrescriptionModal
          resident={resident}
          prescription={editingPrescription}
          onSave={handlePrescriptionSave}
          onClose={() => {
            setShowPrescriptionModal(false);
            setEditingPrescription(null);
          }}
        />
      )}

      {showRefusalModal && refusalContext && (
        <RefusalModal
          resident={resident}
          prescription={refusalContext.prescription}
          timeSlot={refusalContext.timeSlot}
          onSave={handleRefusalSave}
          onClose={() => {
            setShowRefusalModal(false);
            setRefusalContext(null);
          }}
        />
      )}

      {showCancellationModal && cancellingPrescription && (
        <CancellationModal
          prescription={cancellingPrescription}
          onSave={handleCancellationSave}
          onClose={() => {
            setShowCancellationModal(false);
            setCancellingPrescription(null);
          }}
        />
      )}

      {/* Profile Modals */}
      {showDiagnosisModal && (
        <DiagnosisModal
          resident={resident}
          diagnosis={editingDiagnosis}
          onSave={handleDiagnosisSave}
          onClose={() => {
            setShowDiagnosisModal(false);
            setEditingDiagnosis(null);
          }}
        />
      )}

      {showVitalsModal && (
        <VitalsModal
          resident={resident}
          onSave={handleVitalsSave}
          onClose={() => setShowVitalsModal(false)}
        />
      )}

      {showVaccinationModal && (
        <VaccinationModal
          resident={resident}
          vaccination={editingVaccination}
          onSave={handleVaccinationSave}
          onClose={() => {
            setShowVaccinationModal(false);
            setEditingVaccination(null);
          }}
        />
      )}

      {showDoctorExamModal && (
        <DoctorExamModal
          resident={resident}
          onSave={handleDoctorExamSave}
          onClose={() => setShowDoctorExamModal(false)}
        />
      )}

      {showPsychiatristExamModal && (
        <PsychiatristExamModal
          resident={resident}
          onSave={handlePsychiatristExamSave}
          onClose={() => setShowPsychiatristExamModal(false)}
        />
      )}

      {showMorseModal && (
        <MorseScaleModal
          resident={resident}
          onSave={handleMorseSave}
          onClose={() => setShowMorseModal(false)}
        />
      )}

      {showBradenModal && (
        <BradenScaleModal
          resident={resident}
          onSave={handleBradenSave}
          onClose={() => setShowBradenModal(false)}
        />
      )}

      {showTechnicalAidsModal && (
        <TechnicalAidsModal
          resident={resident}
          onSave={handleTechnicalAidsSave}
          onClose={() => setShowTechnicalAidsModal(false)}
        />
      )}
    </PageShell>
  );
};

export default ResidentProfileView;
