import React, { useState } from 'react';
import { Mail, Phone, Building2, Calendar, Bed, Heart, FileText, ListChecks, ChevronRight, Users, Edit2, UserCheck, Brain } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import LeadAvatar from '../components/LeadAvatar';
import StatusBadge from '../components/StatusBadge';
import InfoNotice from '../components/InfoNotice';
import ProgressBar from '../components/ProgressBar';
import EditConsultationModal from '../components/EditConsultationModal';

/**
 * Waiting for decision view
 * After consultation, client decides between agreement or queue
 */
const WaitingForDecision = ({
  savedLead,
  onBack,
  onCreateAgreement,
  onAddToQueue,
  onViewList,
  onUpdateConsultation
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveEdit = (updatedConsultation) => {
    onUpdateConsultation(updatedConsultation);
  };

  return (
    <PageShell>
      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          onClick={onViewList}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <Users className="w-4 h-4" />
          Visi pieteikumi
        </button>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStatus={savedLead.status} />

      {/* Client Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-gray-100">
          <LeadAvatar
            firstName={savedLead.firstName}
            lastName={savedLead.lastName}
            size="lg"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {savedLead.firstName} {savedLead.lastName}
            </h2>
            <StatusBadge status={savedLead.status} />
          </div>
        </div>

        <div className="py-4 space-y-2">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{savedLead.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-5 h-5 text-gray-400" />
            <span>{savedLead.phone}</span>
          </div>
        </div>

        {savedLead.comment && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Komentārs</p>
            <p className="text-gray-700 italic">"{savedLead.comment}"</p>
          </div>
        )}
      </div>

      {/* Consultation Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Konsultācijas rezultāti</h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Rediģēt konsultāciju"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 className="w-4 h-4" />
            <span>Adoro Melodija</span>
          </div>
        </div>

        {/* Contact Source Indicator */}
        {savedLead.consultation?.contactSource === 'relative' && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900 font-medium">
              Informāciju sniedza radinieks
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg flex sm:flex-col sm:text-center items-center sm:items-center gap-3 sm:gap-0">
            <Heart className="w-5 h-5 text-orange-500 sm:mx-auto sm:mb-1" />
            <div className="flex-1 sm:flex-none">
              <p className="text-xs text-gray-500 sm:mb-1">Aprūpes līmenis</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {savedLead.consultation?.careLevel}. līmenis
              </p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex sm:flex-col sm:text-center items-center sm:items-center gap-3 sm:gap-0">
            <Calendar className="w-5 h-5 text-orange-500 sm:mx-auto sm:mb-1" />
            <div className="flex-1 sm:flex-none">
              <p className="text-xs text-gray-500 sm:mb-1">Uzturēšanās</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {savedLead.consultation?.duration === 'long' ? 'Ilglaicīga' : 'Īslaicīga'}
              </p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex sm:flex-col sm:text-center items-center sm:items-center gap-3 sm:gap-0">
            <Bed className="w-5 h-5 text-orange-500 sm:mx-auto sm:mb-1" />
            <div className="flex-1 sm:flex-none">
              <p className="text-xs text-gray-500 sm:mb-1">Istabas veids</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {savedLead.consultation?.roomType === 'single' ? 'Vienvietīga' : 'Divvietīga'}
              </p>
            </div>
          </div>
        </div>

        {/* Dementia Indicator */}
        {savedLead.consultation?.hasDementia && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-900 font-medium">
              Residents ir demence - nepieciešama īpaša istaba
            </span>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700 font-medium">Aprēķinātā cena</p>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">{savedLead.consultation?.price} €</p>
              <p className="text-xs text-green-600">dienā</p>
            </div>
          </div>
        </div>

        {/* Internal Notes */}
        {savedLead.consultation?.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">Iekšējās piezīmes</p>
            <p className="text-sm text-gray-700">{savedLead.consultation.notes}</p>
          </div>
        )}
      </div>

      {/* Info Notice */}
      <InfoNotice variant="yellow" title="Gaida klienta lēmumu" icon="clock">
        <p>
          Klients ir iepazīstināts ar cenām un iespējām. Kad klients pieņem lēmumu, izvēlieties atbilstošo darbību.
        </p>
      </InfoNotice>

      {/* Decision Options */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {/* Option 1: Create Agreement */}
        <button
          onClick={onCreateAgreement}
          className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-green-500 hover:shadow-md p-5 text-left transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Izveidot līgumu</h3>
              <p className="text-xs text-gray-500">Klients gatavs sākt</p>
            </div>
          </div>
          <div className="flex items-center justify-end text-sm text-green-600 font-medium">
            Turpināt <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Option 2: Add to Queue */}
        <button
          onClick={onAddToQueue}
          className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-blue-500 hover:shadow-md p-5 text-left transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pievienot rindai</h3>
              <p className="text-xs text-gray-500">Nav brīvu vietu</p>
            </div>
          </div>
          <div className="flex items-center justify-end text-sm text-blue-600 font-medium">
            Turpināt <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && savedLead.consultation && (
        <EditConsultationModal
          consultation={savedLead.consultation}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </PageShell>
  );
};

export default WaitingForDecision;
