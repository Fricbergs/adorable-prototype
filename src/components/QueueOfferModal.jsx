import React, { useState } from 'react';
import { X, Mail, Copy, Check, Send, ListChecks } from 'lucide-react';
import { generateQueueOfferEmail } from '../domain/emailTemplates';

/**
 * Queue Offer Modal
 * Shows email preview for sending offer to someone in queue
 */
const QueueOfferModal = ({ lead, queuePosition, onClose, onSend }) => {
  const [copied, setCopied] = useState(false);
  const [emailContent] = useState(() => generateQueueOfferEmail(lead, queuePosition));

  const handleCopy = async () => {
    const fullEmail = `Subject: ${emailContent.subject}\n\n${emailContent.body}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSend = () => {
    onSend(lead);
  };

  const getRoomTypeLabel = (roomType) => {
    switch (roomType) {
      case 'single': return 'Vienvietīga istaba';
      case 'double': return 'Divvietīga istaba';
      case 'triple': return 'Trīsvietīga istaba';
      default: return roomType;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <ListChecks className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              Piedāvājums no rindas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pozīcija rindā: #{queuePosition}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lead Summary */}
        <div className="p-4 sm:p-6 bg-blue-50 border-b border-blue-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500 block">Klients</span>
              <span className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Aprūpes līmenis</span>
              <span className="font-semibold text-gray-900">{lead.consultation?.careLevel}. līmenis</span>
            </div>
            <div>
              <span className="text-gray-500 block">Istaba</span>
              <span className="font-semibold text-gray-900">{getRoomTypeLabel(lead.consultation?.roomType)}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Cena</span>
              <span className="font-semibold text-green-600">{lead.consultation?.price} €/d</span>
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Recipient */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Saņēmējs:</div>
            <div className="font-medium text-gray-900">
              {lead.firstName} {lead.lastName} &lt;{lead.email}&gt;
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Temats:</div>
            <div className="font-semibold text-gray-900">{emailContent.subject}</div>
          </div>

          {/* Body */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Ziņojums:</div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {emailContent.body}
              </pre>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-2">
              <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-medium mb-1">Piedāvājums vietas pieejamībai</p>
                <p className="text-green-700">
                  Klients tiks informēts, ka vieta ir pieejama un jāsazinās 3 darba dienu laikā.
                  Pēc nosūtīšanas klients paliks rindā līdz apstiprināsiet līgumu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Atcelt
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 px-6 py-2.5 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Nokopēts!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Kopēt saturu
              </>
            )}
          </button>
          <button
            onClick={handleSend}
            className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Nosūtīt piedāvājumu
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueOfferModal;
