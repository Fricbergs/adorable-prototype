import { useState } from 'react';
import { ArrowLeft, Plus, Printer, ChevronRight, Clock, User, Calendar, History, CalendarDays, FileText } from 'lucide-react';
import PageShell from '../components/PageShell';
import PrescriptionTable, { PrescriptionCards } from '../components/prescriptions/PrescriptionTable';
import AllergiesAlert from '../components/prescriptions/AllergiesAlert';
import PrescriptionModal from '../components/prescriptions/PrescriptionModal';
import RefusalModal from '../components/prescriptions/RefusalModal';
import CancellationModal from '../components/prescriptions/CancellationModal';
import SafeStorageAgreement from '../components/documents/SafeStorageAgreement';
import WeeklyPrescriptionView from '../components/prescriptions/WeeklyPrescriptionView';
import MonthlyPrescriptionView from '../components/prescriptions/MonthlyPrescriptionView';
import HistoryView from '../components/prescriptions/HistoryView';
import {
  getActivePrescriptionsForResident,
  getTodaysAdministrationSummary
} from '../domain/prescriptionHelpers';

// Tab definitions
const TABS = [
  { id: 'pamatinfo', label: 'Pamatinformācija', disabled: true },
  { id: 'izmitinasana', label: 'Izmitināšana', disabled: true },
  { id: 'veseliba', label: 'Veselības aprūpe', disabled: false },
  { id: 'sociala', label: 'Sociālā aprūpe', disabled: true },
  { id: 'aprupe', label: 'Aprūpe', disabled: true },
  { id: 'pielikumi', label: 'Pielikumi', disabled: true },
  { id: 'papild', label: 'Papildpakalpojumi', disabled: true },
];

/**
 * ResidentPrescriptionsView - Main view showing resident card and prescriptions
 * Design based on wireframe: Rezidenta atvērums.png
 */
export default function ResidentPrescriptionsView({
  resident,
  onBack,
  onPrint,
  onDataChange
}) {
  const [prescriptions, setPrescriptions] = useState(() =>
    getActivePrescriptionsForResident(resident?.id)
  );
  const [activeTab, setActiveTab] = useState('veseliba');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [showRefusalModal, setShowRefusalModal] = useState(false);
  const [refusalContext, setRefusalContext] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellingPrescription, setCancellingPrescription] = useState(null);
  const [showSafeStorageModal, setShowSafeStorageModal] = useState(false);
  const [prescriptionViewMode, setPrescriptionViewMode] = useState('today'); // 'today' | 'week' | 'month' | 'history'

  // Refresh prescriptions from storage
  const refreshPrescriptions = () => {
    if (resident) {
      setPrescriptions(getActivePrescriptionsForResident(resident.id));
      onDataChange?.();
    }
  };

  // Handle opening prescription modal for edit
  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  // Handle opening prescription modal for create
  const handleCreatePrescription = () => {
    setEditingPrescription(null);
    setShowPrescriptionModal(true);
  };

  // Handle opening refusal modal
  const handleRefuse = (prescription, timeSlot) => {
    setRefusalContext({ prescription, timeSlot });
    setShowRefusalModal(true);
  };

  // Handle prescription save
  const handlePrescriptionSave = () => {
    setShowPrescriptionModal(false);
    setEditingPrescription(null);
    refreshPrescriptions();
  };

  // Handle refusal save
  const handleRefusalSave = () => {
    setShowRefusalModal(false);
    setRefusalContext(null);
    refreshPrescriptions();
  };

  // Handle opening cancellation modal
  const handleCancelPrescription = (prescription) => {
    setCancellingPrescription(prescription);
    setShowCancellationModal(true);
  };

  // Handle cancellation save
  const handleCancellationSave = () => {
    setShowCancellationModal(false);
    setCancellingPrescription(null);
    refreshPrescriptions();
  };

  // Calculate age
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

  if (!resident) {
    return (
      <PageShell>
        <div className="text-center py-12 text-gray-500">
          Nav izvēlēts rezidents
        </div>
      </PageShell>
    );
  }

  const age = calculateAge(resident.birthDate);

  return (
    <PageShell>
      {/* Breadcrumb navigation */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <button onClick={onBack} className="hover:text-gray-900">Rezidenti</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{resident.firstName} {resident.lastName}</span>
      </div>

      {/* Resident card header - matching wireframe */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-4">
            {/* Avatar - orange circle with person icon */}
            <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-orange-500" />
            </div>

            {/* Name and details */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {resident.firstName} {resident.lastName}
                </h1>
                {/* Care level badge */}
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-sm font-medium rounded border border-orange-200">
                  {resident.careLevel || 'GI 2'}
                </span>
              </div>
              <div className="text-gray-600 mt-1">
                {resident.personalCode || '120351-00000'} ({age} gadi)
              </div>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSafeStorageModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              title="Seifa glabāšanas akts"
            >
              <FileText className="w-4 h-4" />
              Seifa akts
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Drukāt
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'text-orange-600 border-orange-500'
                  : tab.disabled
                    ? 'text-gray-400 border-transparent cursor-not-allowed'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Allergies alert - if any */}
      {resident.allergies && resident.allergies.length > 0 && (
        <div className="mb-6">
          <AllergiesAlert allergies={resident.allergies} />
        </div>
      )}

      {/* Content sections - Veselības aprūpe tab */}
      {activeTab === 'veseliba' && (
        <div className="space-y-4">
          {/* Diagnozes section (placeholder) */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Diagnozes</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pēdējais ieraksts: —
                </p>
              </div>
              <button className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              Nav pievienotu diagnožu
            </div>
          </div>

          {/* Māsas apskate section (placeholder) */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Māsas apskate</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pēdējais ieraksts: —
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  Vēsture
                </button>
                <button className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              Nav veikta māsiņas apskate
            </div>
          </div>

          {/* ORDINĀCIJAS PLĀNS - Main section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Ordinācijas plāns</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pēdējais ieraksts: {new Date().toLocaleDateString('lv-LV')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* View toggle buttons */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPrescriptionViewMode('today')}
                    className={`px-3 py-2 text-sm transition-colors ${
                      prescriptionViewMode === 'today'
                        ? 'bg-orange-100 text-orange-700 border-r border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50 border-r border-gray-300'
                    }`}
                  >
                    Šodien
                  </button>
                  <button
                    onClick={() => setPrescriptionViewMode('week')}
                    className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
                      prescriptionViewMode === 'week'
                        ? 'bg-orange-100 text-orange-700 border-r border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50 border-r border-gray-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Nedēļa
                  </button>
                  <button
                    onClick={() => setPrescriptionViewMode('month')}
                    className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
                      prescriptionViewMode === 'month'
                        ? 'bg-orange-100 text-orange-700 border-r border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50 border-r border-gray-300'
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    Mēnesis
                  </button>
                  <button
                    onClick={() => setPrescriptionViewMode('history')}
                    className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
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
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content based on view mode */}
            <div className="p-4">
              {prescriptionViewMode === 'today' && (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block -m-4">
                    <PrescriptionTable
                      prescriptions={prescriptions}
                      onRefuse={handleRefuse}
                      onEdit={handleEditPrescription}
                      onCancel={handleCancelPrescription}
                    />
                  </div>

                  {/* Mobile cards */}
                  <div className="block md:hidden">
                    <PrescriptionCards
                      prescriptions={prescriptions}
                      onRefuse={handleRefuse}
                    />
                  </div>
                </>
              )}

              {prescriptionViewMode === 'week' && (
                <WeeklyPrescriptionView
                  prescriptions={prescriptions}
                  residentId={resident.id}
                  onDayClick={(prescription, date) => {
                    // Could open a detail modal here
                    console.log('Day clicked:', prescription.medicationName, date);
                  }}
                />
              )}

              {prescriptionViewMode === 'month' && (
                <MonthlyPrescriptionView
                  prescriptions={prescriptions}
                  residentId={resident.id}
                  residentName={`${resident.firstName} ${resident.lastName}`}
                  onDayClick={(prescription, date) => {
                    console.log('Day clicked:', prescription.medicationName, date);
                  }}
                />
              )}

              {prescriptionViewMode === 'history' && (
                <HistoryView
                  residentId={resident.id}
                  prescriptions={prescriptions}
                />
              )}
            </div>
          </div>

          {/* Vakcinācija section (placeholder) */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Vakcinācija</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pēdējais ieraksts: —
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  Vēsture
                </button>
                <button className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              Nav pievienotu vakcināciju
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
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

      {/* Refusal Modal */}
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

      {/* Cancellation Modal */}
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

      {/* Safe Storage Agreement Modal */}
      {showSafeStorageModal && (
        <SafeStorageAgreement
          resident={resident}
          onClose={() => setShowSafeStorageModal(false)}
        />
      )}

      {/* Role indicator - fixed bottom left */}
      <div className="fixed bottom-4 left-4 z-30 print:hidden">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Sistēmas loma</div>
            <div className="text-sm font-medium text-gray-800">Medmāsa vai aprūpes māsa</div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
