import { useState, useEffect, useRef } from 'react';
import { X, Printer, Save } from 'lucide-react';
import {
  getSafeStorageForResident,
  saveSafeStorageAgreement,
  formatDateLV
} from '../../domain/safeStorageHelpers';

/**
 * SafeStorageAgreement - PN Akts for safe storage of resident belongings
 * Printable A4 document with 3 sections: Documents, Items, Money
 */
export default function SafeStorageAgreement({ resident, onClose }) {
  const printRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    documents: '',
    items: '',
    money: ''
  });

  // Load existing data
  useEffect(() => {
    if (resident?.id) {
      const existing = getSafeStorageForResident(resident.id);
      if (existing) {
        setFormData({
          documents: existing.documents || '',
          items: existing.items || '',
          money: existing.money || ''
        });
      }
    }
  }, [resident?.id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      saveSafeStorageAgreement({
        residentId: resident.id,
        residentName: `${resident.firstName} ${resident.lastName}`,
        documents: formData.documents,
        items: formData.items,
        money: formData.money
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    // Save before printing
    handleSave();
    window.print();
  };

  const today = formatDateLV(new Date().toISOString());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - hidden in print */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 print:hidden">
          <h2 className="text-lg font-semibold text-gray-900">
            Pieņemšanas-nodošanas akts (Seifa glabāšana)
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              Saglabāt
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Drukāt
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document content */}
        <div ref={printRef} className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible">
          <div className="max-w-3xl mx-auto print:max-w-none">
            {/* Document header */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold mb-2">
                PIEŅEMŠANAS-NODOŠANAS AKTS
              </h1>
              <p className="text-gray-600">
                Par mantu, dokumentu un naudas līdzekļu nodošanu glabāšanā
              </p>
            </div>

            {/* Date and location */}
            <div className="flex justify-between mb-6 text-sm">
              <div>
                <span className="text-gray-500">Datums: </span>
                <span className="font-medium">{today}</span>
              </div>
              <div>
                <span className="text-gray-500">Vieta: </span>
                <span className="font-medium">SIA "Melodija", Rīga</span>
              </div>
            </div>

            {/* Resident info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 print:bg-white print:border-gray-300">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Rezidents: </span>
                  <span className="font-semibold">{resident.firstName} {resident.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Personas kods: </span>
                  <span className="font-medium">{resident.personalCode || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Istaba: </span>
                  <span className="font-medium">{resident.roomNumber || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Ierašanās datums: </span>
                  <span className="font-medium">{formatDateLV(resident.moveInDate) || '—'}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Documents */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                1. Dokumenti
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Norādiet nodoto dokumentu sarakstu (pases, apliecības, izraksti u.c.)
              </p>
              <textarea
                value={formData.documents}
                onChange={(e) => handleChange('documents', e.target.value)}
                placeholder="Piemēram: Personu apliecinoša dokumenta kopija, veselības karte..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm print:border-gray-400 print:resize-none"
              />
            </div>

            {/* Section 2: Items */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                2. Mantas un vērtīgas lietas
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Norādiet nodoto mantu sarakstu (rotas, tehnika, apģērbs u.c.)
              </p>
              <textarea
                value={formData.items}
                onChange={(e) => handleChange('items', e.target.value)}
                placeholder="Piemēram: Zelta gredzens, pulkstenis, mobilais telefons..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm print:border-gray-400 print:resize-none"
              />
            </div>

            {/* Section 3: Money */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                3. Naudas līdzekļi
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Norādiet nodoto naudas summu (valūta un daudzums)
              </p>
              <textarea
                value={formData.money}
                onChange={(e) => handleChange('money', e.target.value)}
                placeholder="Piemēram: EUR 150.00 skaidrā naudā..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm print:border-gray-400 print:resize-none"
              />
            </div>

            {/* Legal text */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 print:bg-white print:border-gray-300">
              <p className="mb-2">
                Ar šo apliecinu, ka augstāk minētās mantas, dokumenti un naudas līdzekļi ir nodoti
                SIA "Melodija" glabāšanā. Iestāde apņemas nodrošināt to drošu uzglabāšanu un
                atdot tos rezidentam vai viņa pilnvarotai personai pēc pieprasījuma.
              </p>
              <p>
                Rezidents vai viņa pārstāvis apliecina, ka saraksts ir pilnīgs un pareizs.
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">Rezidents / Pārstāvis:</p>
                <div className="border-b border-gray-400 mb-2 h-8"></div>
                <p className="text-xs text-gray-500">(paraksts, datums)</p>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Vārds, uzvārds:</p>
                  <div className="border-b border-gray-300 mt-1 h-6"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">Iestādes pārstāvis:</p>
                <div className="border-b border-gray-400 mb-2 h-8"></div>
                <p className="text-xs text-gray-500">(paraksts, datums)</p>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Vārds, uzvārds, amats:</p>
                  <div className="border-b border-gray-300 mt-1 h-6"></div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-8 text-center text-xs text-gray-400 print:text-gray-500">
              <p>Dokuments sagatavots 2 eksemplāros — viens rezidentam, viens iestādei</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0 {
            position: absolute;
            background: white;
          }
          .fixed.inset-0,
          .fixed.inset-0 * {
            visibility: visible;
          }
          .fixed.inset-0 > div {
            width: 100%;
            max-width: 100%;
            height: auto;
            max-height: none;
            border-radius: 0;
            box-shadow: none;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
