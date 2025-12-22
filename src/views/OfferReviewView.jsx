import React from 'react';
import { FileText, CheckCircle, ListChecks, ArrowLeft, Building2, Heart, Bed, User, UserCheck, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import ProgressBar from '../components/ProgressBar';
import InfoNotice from '../components/InfoNotice';

/**
 * Offer Review View
 * Admin reviews survey/offer data and decides next action
 */
const OfferReviewView = ({ savedLead, onCreateAgreement, onAddToQueue, onBack }) => {
  // Support both survey (admin-filled) and offer (customer-filled) data
  const data = savedLead?.survey || savedLead?.offer || {};
  const consultation = savedLead?.consultation || {};

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

      {/* Alert */}
      <InfoNotice variant="green" title="Aptauja aizpildīta">
        <p className="text-sm">
          Visi nepieciešamie dati ir ievadīti. Pārskatiet informāciju un izvēlieties darbību.
        </p>
      </InfoNotice>

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
            <p className="font-medium text-gray-900">Adoro Melodija</p>
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
              {consultation?.roomType === 'single' ? 'Vienvietīga' : consultation?.roomType === 'double' ? 'Divvietīga' : '-'}
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Rezidenta informācija</h3>
            <p className="text-sm text-gray-500">Persona, kas dzīvos rezidencē</p>
          </div>
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
                  {formatDate(data.disabilityDateFrom)} - {formatDate(data.disabilityDateTo) || 'Beztermiņa'}
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
            <p className="text-base font-medium text-gray-900 mt-1">{formatDate(data.stayDateTo) || 'Beztermiņa'}</p>
          </div>
        </div>
      </div>

      {/* Client/Signer Details (if relative scenario) */}
      {data.signerScenario === 'relative' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Līguma parakstītāja informācija</h3>
              <p className="text-sm text-gray-500">Radinieks / Pilnvarotā persona</p>
            </div>
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
          onClick={onCreateAgreement}
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
    </PageShell>
  );
};

export default OfferReviewView;
