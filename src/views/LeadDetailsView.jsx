import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Edit2 } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import LeadAvatar from '../components/LeadAvatar';
import StatusBadge from '../components/StatusBadge';
import InfoNotice from '../components/InfoNotice';
import ProgressBar from '../components/ProgressBar';
import EditLeadModal from '../components/EditLeadModal';

/**
 * Lead details view
 * Shows prospect information and allows starting consultation
 */
const LeadDetailsView = ({ savedLead, onBack, onStartConsultation, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveEdit = (updatedData) => {
    onUpdate(updatedData);
  };

  return (
    <PageShell>
      <BackButton onClick={onBack} />

      {/* Progress Bar */}
      <ProgressBar currentStatus={savedLead.status} />

      {/* Main Content - Contact Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        {/* Header with avatar and name */}
        <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-gray-100">
          <LeadAvatar
            firstName={savedLead.firstName}
            lastName={savedLead.lastName}
            size="xl"
          />
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {savedLead.firstName} {savedLead.lastName}
            </h2>
            <StatusBadge status={savedLead.status} />
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Rediģēt kontaktinformāciju"
          >
            <Edit2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contact details */}
        <div className="py-4 space-y-3">
          <a
            href={`mailto:${savedLead.email}`}
            className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-base">{savedLead.email}</span>
          </a>
          <a
            href={`tel:${savedLead.phone}`}
            className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-base">{savedLead.phone}</span>
          </a>
        </div>

        {/* Comment if exists */}
        {savedLead.comment && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Komentārs</p>
            <p className="text-gray-700 italic">"{savedLead.comment}"</p>
          </div>
        )}

        {/* Info Notice */}
        <div className="mt-4">
          <InfoNotice variant="blue" title="Automātiskie datu avoti">
            <p>🌐 Mājaslapas forma &nbsp;•&nbsp; 📋 Pansionati.info &nbsp;•&nbsp; 🔗 Citi portāli</p>
            <p className="text-xs mt-2 text-blue-600">
              Strukturētie dati no ārējiem avotiem tiek automātiski importēti šeit.
            </p>
          </InfoNotice>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {/* Consultation Info */}
          <InfoNotice variant="orange" title="Konsultācija klātienē vai telefoniski" icon="phone">
            <p>
              Uzsākot konsultāciju, jūs sazināsieties ar klientu, lai noskaidrotu potenciālā rezidenta veselības stāvokli, aprūpes vajadzības un vēlmes.
            </p>
          </InfoNotice>

          <button
            onClick={onStartConsultation}
            className="mt-4 w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Sākt konsultāciju
          </button>
        </div>
      </div>

      {/* Metadata - Less Prominent */}
      <div className="text-xs text-gray-400 flex items-center justify-between px-2">
        <span>ID: {savedLead.id}</span>
        <span>Pievienoja: {savedLead.assignedTo}</span>
        <span>{savedLead.createdDate} {savedLead.createdTime}</span>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditLeadModal
          lead={savedLead}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </PageShell>
  );
};

export default LeadDetailsView;
