import { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { PrescriptionTableStatic } from '../components/prescriptions/PrescriptionTable';
import { AllergiesAlertCompact } from '../components/prescriptions/AllergiesAlert';
import { ResidentVitalsInline } from '../components/prescriptions/ResidentVitalsCard';
import { getActivePrescriptionsForResident } from '../domain/prescriptionHelpers';

/**
 * PrescriptionPrintView - Print-optimized prescription sheet for hospital emergencies
 */
export default function PrescriptionPrintView({ resident, onBack }) {
  const prescriptions = resident
    ? getActivePrescriptionsForResident(resident.id)
    : [];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('lv-LV');
  };

  // Format current date/time
  const formatNow = () => {
    return new Date().toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return '—';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Auto-focus print button on mount
  useEffect(() => {
    // Small delay to ensure the view is rendered
    const timer = setTimeout(() => {
      // Could auto-trigger print dialog here if desired
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!resident) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nav izvēlēts rezidents
      </div>
    );
  }

  return (
    <>
      {/* Print controls - hidden when printing */}
      <div className="print:hidden bg-gray-100 border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atpakaļ
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Printēt
          </button>
        </div>
      </div>

      {/* Printable content */}
      <div className="max-w-4xl mx-auto p-8 print:p-4 print:max-w-none bg-white">
        {/* Header with logo placeholder and title */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ORDINĀCIJAS PLĀNS</h1>
              <p className="text-gray-600 mt-1">Neatliekamās medicīniskās palīdzības vajadzībām</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Izdrukāts: {formatNow()}</div>
              <div className="font-semibold text-gray-900 mt-1">ADORO Rezidence</div>
            </div>
          </div>
        </div>

        {/* Resident info section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 print:bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Rezidents</div>
              <div className="text-xl font-bold text-gray-900">
                {resident.firstName} {resident.lastName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Personas kods</div>
              <div className="text-lg font-mono font-semibold">
                {resident.personalCode || '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-500">Dzimšanas datums</div>
              <div className="font-medium">{formatDate(resident.birthDate)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Vecums</div>
              <div className="font-medium">{calculateAge(resident.birthDate)} gadi</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Istaba</div>
              <div className="font-medium">{resident.roomNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Aprūpes līmenis</div>
              <div className="font-medium">{resident.careLevel}</div>
            </div>
          </div>
        </div>

        {/* ALLERGIES - Prominently displayed */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-red-600">⚠</span> ALERĢIJAS
          </h2>
          <AllergiesAlertCompact allergies={resident.allergies} />
        </div>

        {/* Vitals section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 print:bg-white">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            PĒDĒJIE VITĀLIE RĀDĪTĀJI
            {resident.vitals?.measuredAt && (
              <span className="font-normal text-gray-500 ml-2">
                ({formatDate(resident.vitals.measuredAt)})
              </span>
            )}
          </h2>
          <ResidentVitalsInline vitals={resident.vitals} />
        </div>

        {/* Prescriptions table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">AKTĪVĀS ORDINĀCIJAS</h2>
          <PrescriptionTableStatic prescriptions={prescriptions} />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-500 print:mt-4">
          <div className="flex justify-between">
            <div>
              Kopā aktīvas ordinācijas: <strong>{prescriptions.length}</strong>
            </div>
            <div>
              Dokuments ģenerēts automātiski no ADORO sistēmas
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:p-4 {
            padding: 1rem !important;
          }

          .print\\:max-w-none {
            max-width: none !important;
          }

          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:mt-4 {
            margin-top: 1rem !important;
          }

          @page {
            size: A4;
            margin: 1cm;
          }

          /* Ensure table doesn't break across pages */
          table {
            page-break-inside: avoid;
          }

          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
