import React, { useState } from 'react';
import { ListChecks, Send, Eye, XCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import PageShell from '../components/PageShell';
import LeadAvatar from '../components/LeadAvatar';
import CancelModal from '../components/CancelModal';
import { calculateQueuePosition, calculateDaysInQueue } from '../domain/leadHelpers';
import { STATUS } from '../constants/steps';

/**
 * Queue List View
 * Shows all leads in queue, ordered by FIFO (date added)
 * Allows sending offers and accepting from queue
 */
const QueueListView = ({
  allLeads,
  onSendOffer,
  onAcceptFromQueue,
  onViewLead,
  onCancelLead
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Get queue leads sorted by date (FIFO)
  const queueLeads = allLeads
    .filter(lead => lead.status === STATUS.QUEUE)
    .sort((a, b) => {
      const dateA = a.queuedDate || a.createdDate;
      const dateB = b.queuedDate || b.createdDate;
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      const timeA = a.queuedTime || a.createdTime || '00:00';
      const timeB = b.queuedTime || b.createdTime || '00:00';
      return timeA.localeCompare(timeB);
    });

  const handleCancelClick = (lead) => {
    setSelectedLead(lead);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = (cancelData) => {
    onCancelLead(selectedLead.id, cancelData);
    setShowCancelModal(false);
    setSelectedLead(null);
  };

  const getRoomTypeLabel = (roomType) => {
    switch (roomType) {
      case 'single': return 'Vienvietīga';
      case 'double': return 'Divvietīga';
      case 'triple': return 'Trīsvietīga';
      default: return roomType;
    }
  };

  return (
    <PageShell maxWidth="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gaidīšanas rinda</h1>
            <p className="text-sm text-gray-600">
              {queueLeads.length} {queueLeads.length === 1 ? 'klients gaida' : 'klienti gaida'}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {queueLeads.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <ListChecks className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Rinda ir tukša</h3>
          <p className="text-gray-600">
            Šobrīd neviens negaida rindā. Klienti tiek pievienoti rindai, kad nav brīvu vietu.
          </p>
        </div>
      )}

      {/* Queue List */}
      <div className="space-y-3">
        {queueLeads.map((lead, index) => {
          const position = index + 1;
          const daysWaiting = calculateDaysInQueue(lead);
          const offerSent = lead.queueOfferSent;

          return (
            <div
              key={lead.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              {/* Lead Info Row */}
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Position Badge */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-bold">#{position}</span>
                </div>

                {/* Avatar */}
                <LeadAvatar
                  firstName={lead.firstName}
                  lastName={lead.lastName}
                  size="md"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <p className="text-xs text-gray-500">{lead.id}</p>
                    </div>

                    {/* Offer Sent Badge */}
                    {offerSent && (
                      <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Nosūtīts
                      </span>
                    )}
                  </div>

                  {/* Care Info */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">
                      {lead.consultation?.careLevel}. līm.
                    </span>
                    <span className="text-gray-600">
                      {getRoomTypeLabel(lead.consultation?.roomType)}
                    </span>
                    {lead.consultation?.hasDementia && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                        Demence
                      </span>
                    )}
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysWaiting} {daysWaiting === 1 ? 'diena' : 'dienas'} rindā
                    </span>
                    <span>
                      Pievienots: {lead.queuedDate || lead.createdDate}
                    </span>
                  </div>

                  {/* Offer Sent Info */}
                  {offerSent && lead.queueOfferSentDate && (
                    <p className="mt-1 text-xs text-green-600">
                      Piedāvājums nosūtīts: {lead.queueOfferSentDate} {lead.queueOfferSentTime}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-lg font-bold text-green-600">
                    {lead.consultation?.price} €
                  </p>
                  <p className="text-xs text-gray-500">dienā</p>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {!offerSent ? (
                  // Primary action: Send Offer
                  <button
                    onClick={() => onSendOffer(lead)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Nosūtīt piedāvājumu
                  </button>
                ) : (
                  // After offer sent: Accept or Resend
                  <>
                    <button
                      onClick={() => onAcceptFromQueue(lead)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Apstiprināt līgumu
                    </button>
                    <button
                      onClick={() => onSendOffer(lead)}
                      className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Nosūtīt vēlreiz
                    </button>
                  </>
                )}

                <button
                  onClick={() => onViewLead(lead)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Skatīt</span>
                </button>

                <button
                  onClick={() => handleCancelClick(lead)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Izņemt</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedLead && (
        <CancelModal
          lead={selectedLead}
          onConfirm={handleCancelConfirm}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedLead(null);
          }}
        />
      )}
    </PageShell>
  );
};

export default QueueListView;
