import React, { useState, useMemo } from 'react';
import { FileText, CheckCircle, ListChecks, ArrowLeft, Building2, Heart, Bed, User, UserCheck, Calendar, Mail, Phone, MapPin, Send, XCircle, AlertCircle, Pencil } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import ProgressBar from '../components/ProgressBar';
import InfoNotice from '../components/InfoNotice';
import EmailPreviewModal from '../components/EmailPreviewModal';
import CancelModal from '../components/CancelModal';
import MissingDataModal from '../components/MissingDataModal';
import { validateAgreementData } from '../domain/validation';
import { RESIDENT_FIELDS, CLIENT_FIELDS } from '../domain/agreementFields';

/**
 * Offer Review View
 * Admin reviews survey/offer data and decides next action
 */
const OfferReviewView = ({ savedLead, onCreateAgreement, onAddToQueue, onBack, onEmailSent, onCancelLead, onUpdateSurveyAndCreateAgreement }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMissingDataModal, setShowMissingDataModal] = useState(false);
  const [missingFieldsData, setMissingFieldsData] = useState({ consultation: [], resident: [], caregiver: [] });

  // Support both survey (admin-filled) and offer (customer-filled) data
  const data = savedLead?.survey || savedLead?.offer || {};
  const consultation = savedLead?.consultation || {};

  // Check if survey is complete
  const surveyCompleteness = useMemo(() => {
    const missingFields = [];

    RESIDENT_FIELDS.forEach(group => {
      group.fields.forEach(field => {
        if (field.required && !data[field.name]) {
          missingFields.push(field.label);
        }
      });
    });

    if (data.signerScenario === 'relative') {
      CLIENT_FIELDS.forEach(group => {
        group.fields.forEach(field => {
          if (field.required && !data[field.name]) {
            missingFields.push(field.label);
          }
        });
      });
    }

    return {
      isComplete: missingFields.length === 0,
      missingCount: missingFields.length,
      missingFields
    };
  }, [data]);

  const handleEmailSend = (emailContent) => {
    onEmailSent();
    setShowEmailModal(false);
  };

  const handleCreateAgreementClick = () => {
    // Validate agreement data before creating
    const validation = validateAgreementData(savedLead);

    if (!validation.isValid) {
      // Show missing data modal
      setMissingFieldsData(validation.missingFields);
      setShowMissingDataModal(true);
    } else {
      // All data is present, proceed with agreement creation
      onCreateAgreement();
    }
  };

  const handleProceedAnyway = () => {
    setShowMissingDataModal(false);
    onCreateAgreement();
  };

  // Handle save from MissingDataModal - update survey and create agreement
  const handleSaveFromModal = (surveyUpdates) => {
    setShowMissingDataModal(false);
    if (onUpdateSurveyAndCreateAgreement) {
      onUpdateSurveyAndCreateAgreement(surveyUpdates);
    }
  };

  const isInPersonScenario = consultation?.fillScenario === 'in-person';
  const emailSent = savedLead.emailSent || false;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('lv-LV');
  };

  const getRelationshipLabel = (value) => {
    const labels = {
      child: 'Dēls / Meita',
      spouse: 'Laulātais',
      guardian: 'Pilnvarotā persona',
      social_worker: 'Sociālais darbinieks',
      other: 'Cits'
    };
    return labels[value] || value;
  };

  const getGenderLabel = (value) => {
    return value === 'male' ? 'Vīrietis' : value === 'female' ? 'Sieviete' : value;
  };

  return (
    <PageShell>
      <div className="mb-6">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Piedāvājuma pārskats</h1>
        <p className="text-sm text-gray-600">Klients ir aizpildījis piedāvājuma formu</p>
      </div>

      <ProgressBar currentStatus={savedLead.status} />

      {/* Alert - conditional based on survey completeness */}
      {surveyCompleteness.isComplete ? (
        <InfoNotice variant="green" title="Aptauja aizpildīta">
          <p className="text-sm">
            Visi nepieciešamie dati ir ievadīti. Pārskatiet informāciju un izvēlieties darbību.
          </p>
        </InfoNotice>
      ) : (
        <InfoNotice variant="orange" title="Aptauja nav pilnīga">
          <p className="text-sm">
            Trūkst {surveyCompleteness.missingCount} obligāto lauku. Nosūtiet anketu klientam aizpildīšanai vai atgriezieties un aizpildiet paši.
          </p>
        </InfoNotice>
      )}

      {/* Email Section - show when survey incomplete OR in-person scenario */}
      {(!surveyCompleteness.isComplete || isInPersonScenario) && !emailSent && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Send className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  {surveyCompleteness.isComplete ? 'Nosūtīt informāciju klientam' : 'Nosūtīt anketu klientam'}
                </h3>
                <p className="text-sm text-blue-700">
                  {surveyCompleteness.isComplete
                    ? 'Klients apmeklēja iestādi un jūs aizpildījāt anketu. Nosūtiet e-pastu ar pārskatu klientam apstiprināšanai.'
                    : 'Anketa nav pilnīgi aizpildīta. Nosūtiet e-pastu klientam, lai viņš aizpilda trūkstošos datus.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Mail className="w-5 h-5" />
              Nosūtīt e-pastu
            </button>
          </div>
        </div>
      )}

      {/* Email Sent Confirmation */}
      {isInPersonScenario && emailSent && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">E-pasts nosūtīts</h3>
              <p className="text-sm text-green-700">
                Informācijas pārskats nosūtīts klientam {savedLead.emailSentDate && `${savedLead.emailSentDate} plkst. ${savedLead.emailSentTime}`}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Offer Summary (Read-only) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          Piedāvājuma nosacījumi
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <Building2 className="w-3 h-3" /> Filiāle
            </p>
            <p className="font-medium text-gray-900">Adoro Šampēteris</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <Heart className="w-3 h-3" /> Aprūpe
            </p>
            <p className="font-medium text-gray-900">{consultation?.careLevel || '-'}. līmenis</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <Bed className="w-3 h-3" /> Istaba
            </p>
            <p className="font-medium text-gray-900">
              {consultation?.roomType === 'single' ? 'Vienvietīga' : consultation?.roomType === 'double' ? 'Divvietīga' : consultation?.roomType === 'triple' ? 'Trīsvietīga' : '-'}
              {consultation?.hasDementia ? ' (Spec.)' : ''}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <CheckCircle className="w-3 h-3" /> Cena
            </p>
            <p className="font-bold text-green-700">{consultation?.price || '-'} € / dienā</p>
          </div>
        </div>
      </div>

      {/* Resident Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Rezidenta informācija</h3>
              <p className="text-sm text-gray-500">Persona, kas dzīvos rezidencē</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Labot rezidenta datus"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vārds un uzvārds</label>
            <p className="text-base font-medium text-gray-900 mt-1">{data.firstName} {data.lastName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Personas kods</label>
            <p className="text-base font-medium text-gray-900 mt-1">{data.personalCode || '-'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Dzimšanas datums
            </label>
            <p className="text-base font-medium text-gray-900 mt-1">{formatDate(data.birthDate)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dzimums</label>
            <p className="text-base font-medium text-gray-900 mt-1">{getGenderLabel(data.gender)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Phone className="w-3 h-3" /> Tālrunis
            </label>
            <p className="text-base font-medium text-gray-900 mt-1">{data.phone || '-'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Mail className="w-3 h-3" /> E-pasts
            </label>
            <p className="text-base font-medium text-gray-900 mt-1">{data.email || '-'}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Adrese
            </label>
            <p className="text-base font-medium text-gray-900 mt-1">
              {data.street && data.city && data.postalCode
                ? `${data.street}, ${data.city}, ${data.postalCode}`
                : '-'}
            </p>
          </div>
          {data.disabilityGroup && data.disabilityGroup !== 'none' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Invaliditātes grupa</label>
                <p className="text-base font-medium text-gray-900 mt-1">{data.disabilityGroup}. grupa</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Invaliditātes termiņš</label>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {formatDate(data.disabilityDateFrom)} - {data.disabilityDateTo ? formatDate(data.disabilityDateTo) : 'Beztermiņa'}
                </p>
              </div>
            </>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Uzturēšanās sākums</label>
            <p className="text-base font-medium text-gray-900 mt-1">{formatDate(data.stayDateFrom)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Uzturēšanās beigas</label>
            <p className="text-base font-medium text-gray-900 mt-1">{data.stayDateTo ? formatDate(data.stayDateTo) : 'Beztermiņa'}</p>
          </div>
        </div>
      </div>

      {/* Client/Signer Details (if relative scenario) */}
      {data.signerScenario === 'relative' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Līguma parakstītāja informācija</h3>
                <p className="text-sm text-gray-500">Radinieks / Pilnvarotā persona</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Labot apgādnieka datus"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vārds un uzvārds</label>
              <p className="text-base font-medium text-gray-900 mt-1">{data.clientFirstName} {data.clientLastName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Radniecība / Statuss</label>
              <p className="text-base font-medium text-gray-900 mt-1">{getRelationshipLabel(data.relationship)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Personas kods</label>
              <p className="text-base font-medium text-gray-900 mt-1">{data.clientPersonalCode || '-'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Phone className="w-3 h-3" /> Tālrunis
              </label>
              <p className="text-base font-medium text-gray-900 mt-1">{data.clientPhone || '-'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Mail className="w-3 h-3" /> E-pasts
              </label>
              <p className="text-base font-medium text-gray-900 mt-1">{data.clientEmail || '-'}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Adrese
              </label>
              <p className="text-base font-medium text-gray-900 mt-1">
                {data.clientStreet && data.clientCity && data.clientPostalCode
                  ? `${data.clientStreet}, ${data.clientCity}, ${data.clientPostalCode}`
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Decision Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Create Agreement */}
        <button
          onClick={handleCreateAgreementClick}
          className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-green-500 hover:shadow-md p-5 text-left transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Izveidot līgumu</h3>
              <p className="text-xs text-gray-500">Piešķirt līguma numuru un turpināt</p>
            </div>
          </div>
          <div className="flex items-center justify-end text-sm text-green-600 font-medium">
            Turpināt →
          </div>
        </button>

        {/* Add to Queue */}
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
              <p className="text-xs text-gray-500">Saglabāt datus, nav brīvu vietu</p>
            </div>
          </div>
          <div className="flex items-center justify-end text-sm text-blue-600 font-medium">
            Turpināt →
          </div>
        </button>
      </div>

      {/* Cancel Button */}
      <div className="mt-4">
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full px-6 py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Atcelt pieteikumu
        </button>
      </div>

      {/* Email Preview Modal */}
      {showEmailModal && (
        <EmailPreviewModal
          lead={savedLead}
          onClose={() => setShowEmailModal(false)}
          onSend={handleEmailSend}
        />
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          lead={savedLead}
          onConfirm={onCancelLead}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {/* Missing Data Modal */}
      {showMissingDataModal && (
        <MissingDataModal
          missingFields={missingFieldsData}
          existingData={data}
          onClose={() => setShowMissingDataModal(false)}
          onGoBack={onBack}
          onProceedAnyway={handleProceedAnyway}
          onSave={handleSaveFromModal}
        />
      )}
    </PageShell>
  );
};

export default OfferReviewView;
