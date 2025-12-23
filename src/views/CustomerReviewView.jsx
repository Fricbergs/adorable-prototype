import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Mail, Phone, MapPin, User, Calendar, Heart, Bed, AlertCircle } from 'lucide-react';
import { usePersistedLeads } from '../hooks/useLocalStorage';

/**
 * Customer Review View (Read-Only)
 * For in-person scenario - customer reviews their information
 * Cannot edit, must contact facility if changes needed
 */
const CustomerReviewView = () => {
  const { id } = useParams();
  const { leads } = usePersistedLeads();
  const lead = leads.find(l => l.id === id);

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pieteikums nav atrasts</h1>
          <p className="text-gray-600">
            Šī saite vairs nav derīga vai pieteikums ir dzēsts.
          </p>
        </div>
      </div>
    );
  }

  const consultation = lead.consultation || {};
  const survey = lead.survey || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/60x60/f97316/ffffff?text=A"
              alt="Adoro"
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adoro Šampēteris</h1>
              <p className="text-sm text-gray-600">Sociālās aprūpes centrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Labdien, {survey.firstName || lead.firstName} {survey.lastName || lead.lastName}!
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Paldies, ka apmeklējāt mūsu iestādi. Šeit Jūs varat pārskatīt informāciju, ko esam savākuši pēc mūsu sarunas.
                Lūdzu pārbaudiet, vai viss ir pareizi.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Tikai apskatei</h3>
              <p className="text-sm text-blue-800">
                Šī ir tikai informācijas apskates lapa. Ja pamanāt kļūdu vai vēlaties ko mainīt,
                lūdzu sazinieties ar mums pa e-pastu vai tālruni (kontakti lapas apakšā).
              </p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-500" />
            Jūsu izvēlētais pakalpojums
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Aprūpes līmenis</p>
              <p className="text-lg font-bold text-gray-900">{consultation.careLevel}. līmenis</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Uzturēšanās</p>
              <p className="text-lg font-bold text-gray-900">
                {consultation.duration === 'long' ? 'Ilglaicīga' : 'Īslaicīga'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Istabas veids</p>
              <p className="text-lg font-bold text-gray-900">
                {consultation.roomType === 'single' ? 'Vienvietīga' : 'Divvietīga'}
                {consultation.hasDementia && ' (Speciāla)'}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-700 mb-1">Cena</p>
              <p className="text-2xl font-bold text-green-700">{consultation.price} € / dienā</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Jūsu personīgā informācija
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Vārds, uzvārds</label>
              <p className="text-base font-medium text-gray-900 mt-1">
                {survey.firstName || lead.firstName} {survey.lastName || lead.lastName}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Tālrunis
                </label>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {survey.phone || lead.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> E-pasts
                </label>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {survey.email || lead.email}
                </p>
              </div>
            </div>
            {survey.street && survey.city && (
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Adrese
                </label>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {survey.street}, {survey.city}, {survey.postalCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Caregiver Information (if applicable) */}
        {survey.signerScenario === 'relative' && survey.clientFirstName && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Līguma parakstītājs
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Vārds, uzvārds</label>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {survey.clientFirstName} {survey.clientLastName}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tālrunis</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{survey.clientPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">E-pasts</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{survey.clientEmail}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
          <h3 className="font-semibold text-orange-900 mb-2">Nākamie soļi</h3>
          <p className="text-sm text-orange-800 mb-3">
            Ja visa informācija ir pareiza, mēs turpināsim ar līguma sagatavošanu un sazināsimies ar Jums tuvākajā laikā.
          </p>
          <p className="text-sm text-orange-800">
            Ja ir jautājumi vai nepieciešami labojumi, lūdzu sazinieties ar mums.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Adoro Šampēteris</h4>
              <p className="text-sm text-gray-600">Zolitūdes iela 68A</p>
              <p className="text-sm text-gray-600">Rīga, LV-1046</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Kontakti</h4>
              <p className="text-sm text-gray-600">Tālrunis: +371 20 616 003</p>
              <p className="text-sm text-gray-600">E-pasts: rezidence.sampeteris@adoro.lv</p>
              <p className="text-sm text-gray-600 mt-2">www.adoro.lv</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewView;
