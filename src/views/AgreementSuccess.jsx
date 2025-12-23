import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Users, ArrowLeft, FileText, Printer, Download, Eye, EyeOff } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import AgreementTemplate from '../components/AgreementTemplate';

/**
 * Agreement success view
 * Displayed after creating an agreement
 */
const AgreementSuccess = ({ savedLead, onBack, onViewList, onAddNew }) => {
  const [showAgreement, setShowAgreement] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageShell maxWidth="max-w-4xl">
      <BackButton onClick={onBack} />

      {/* Success Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Līgums izveidots!</h2>
              <p className="text-green-100 mt-1 text-sm sm:text-base">Process veiksmīgi uzsākts</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jauns līgums</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Līguma numurs</span>
                <span className="font-mono font-semibold text-gray-900">{savedLead.agreementNumber || 'RSD-__-2025'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rezidents</span>
                <span className="font-medium text-gray-900">
                  {savedLead.firstName} {savedLead.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
                  Gaida parakstu
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Izveidots</span>
                <span className="font-medium text-gray-900">
                  {new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Nākamie soļi</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Līguma dokuments ģenerēts</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Nosūtīt līgumu klientam parakstīšanai</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Rezervēt gultas vietu</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Pēc parakstīšanas - aktivizēt līgumu</span>
              </div>
            </div>
          </div>

          {/* Agreement Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Līguma dokuments</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setShowAgreement(!showAgreement)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
              >
                {showAgreement ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAgreement ? 'Paslēpt' : 'Skatīt'}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Drukāt
              </button>
              <button
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
                disabled
                title="Funkcionalitāte tiks pievienota"
              >
                <Download className="w-4 h-4" />
                Lejupielādēt
              </button>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <button
              onClick={onViewList}
              className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Skatīt visus pieteikumus
            </button>
            <button
              onClick={onAddNew}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Pievienot jaunu klientu
            </button>
          </div>
        </div>
      </div>

      {/* Agreement Template Display */}
      {showAgreement && (
        <div className="mt-6 print:mt-0">
          <AgreementTemplate lead={savedLead} />
        </div>
      )}
    </PageShell>
  );
};

export default AgreementSuccess;
