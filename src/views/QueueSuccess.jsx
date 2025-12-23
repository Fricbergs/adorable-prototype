import React, { useState } from 'react';
import { ListChecks, CheckCircle, Clock, AlertCircle, Users, ArrowLeft, XCircle } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import InfoNotice from '../components/InfoNotice';
import CancelModal from '../components/CancelModal';

/**
 * Queue success view
 * Displayed after adding to queue
 */
const QueueSuccess = ({ savedLead, onBack, onViewList, onAddNew, onCancelLead }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <PageShell maxWidth="max-w-2xl">
      <BackButton onClick={onBack} />

      {/* Success Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 text-white">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ListChecks className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Pievienots rindai!</h2>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                Klients tiks informēts, kad vieta kļūst pieejama
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gaidīšanas saraksts</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Klients</span>
                <span className="font-medium text-gray-900">
                  {savedLead.firstName} {savedLead.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pozīcija rindā</span>
                <span className="font-mono font-semibold text-blue-600">#7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                  Gaidīšanas rindā
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pievienots</span>
                <span className="font-medium text-gray-900">
                  {new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Current Queue Status */}
          <InfoNotice variant="blue" title="Pašreizējā situācija" icon="info">
            <p>
              Abās rezidencēs pašlaik ir pilns aizpildījums. Vidējais gaidīšanas laiks ir 2-4 mēneši.
              Klients tiks informēts, tiklīdz vieta kļūst pieejama.
            </p>
          </InfoNotice>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Nākamie soļi</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Klients pievienots gaidīšanas rindai</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Uzturēt regulāru kontaktu ar klientu</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Informēt, kad vieta kļūst pieejama</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Pēc apstiprinājuma - izveidot līgumu</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <button
              onClick={onViewList}
              className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center gap-2"
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
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full px-4 py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Izņemt no rindas
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          lead={savedLead}
          onConfirm={onCancelLead}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </PageShell>
  );
};

export default QueueSuccess;
