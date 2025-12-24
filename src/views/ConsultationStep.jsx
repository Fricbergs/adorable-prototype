import React from 'react';
import { Building2, Calendar, Clock, Bed, Users, Heart, CheckCircle } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import LeadAvatar from '../components/LeadAvatar';
import ProgressBar from '../components/ProgressBar';

/**
 * Consultation step view
 * Capture consultation details and calculate price
 */
const ConsultationStep = ({
  savedLead,
  consultation,
  price,
  allSelected,
  onConsultationChange,
  onSave,
  onBack
}) => {
  const handleChange = (field, value) => {
    onConsultationChange({ ...consultation, [field]: value });
  };

  return (
    <PageShell>
      <BackButton onClick={onBack} />

      {/* Progress Bar */}
      <ProgressBar currentStatus={savedLead.status} />

      {/* Client Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3">
          <LeadAvatar
            firstName={savedLead.firstName}
            lastName={savedLead.lastName}
            size="md"
          />
          <div>
            <p className="font-medium text-gray-900">
              {savedLead.firstName} {savedLead.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {savedLead.email} • {savedLead.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Consultation Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Konsultācijas rezultāti</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 className="w-4 h-4" />
            <span>Adoro Šampēteris</span>
          </div>
        </div>

        {/* Fill Scenario Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Anketas aizpildīšanas veids</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              consultation.fillScenario === 'in-person'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="fillScenario"
                value="in-person"
                checked={consultation.fillScenario === 'in-person'}
                onChange={(e) => handleChange('fillScenario', e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-medium text-gray-900 block">Klients apmeklēja iestādi</span>
                <span className="text-xs text-gray-500">Anketu aizpildīšu uzreiz pēc konsultācijas</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              consultation.fillScenario === 'remote'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="fillScenario"
                value="remote"
                checked={consultation.fillScenario === 'remote'}
                onChange={(e) => handleChange('fillScenario', e.target.value)}
                className="mt-1"
              />
              <div>
                <span className="font-medium text-gray-900 block">Saziņa pa tālruni/e-pastu</span>
                <span className="text-xs text-gray-500">Nosūtīšu e-pastu ar anketu klientam</span>
              </div>
            </label>
          </div>
        </div>

        {/* Care Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Aprūpes līmenis</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleChange('careLevel', level.toString())}
                className={`p-3 rounded-lg border-2 transition-all ${
                  consultation.careLevel === level.toString()
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-lg font-bold ${
                  consultation.careLevel === level.toString()
                    ? 'text-orange-500'
                    : 'text-gray-700'
                }`}>
                  {level}. līmenis
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Uzturēšanās ilgums</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange('duration', 'long')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                consultation.duration === 'long'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Calendar className={`w-5 h-5 mb-1 ${
                consultation.duration === 'long' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Ilglaicīga</div>
              <div className="text-xs text-gray-500">Ilgāk par 3 mēnešiem</div>
            </button>
            <button
              type="button"
              onClick={() => handleChange('duration', 'short')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                consultation.duration === 'short'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Clock className={`w-5 h-5 mb-1 ${
                consultation.duration === 'short' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Īslaicīga</div>
              <div className="text-xs text-gray-500">Līdz 3 mēnešiem</div>
            </button>
          </div>
        </div>

        {/* Room Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Istabas veids</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleChange('roomType', 'single')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                consultation.roomType === 'single'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Bed className={`w-5 h-5 mb-1 ${
                consultation.roomType === 'single' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Vienvietīga istaba</div>
              <div className="text-xs text-gray-500">Privāta istaba</div>
            </button>
            <button
              type="button"
              onClick={() => handleChange('roomType', 'double')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                consultation.roomType === 'double'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className={`w-5 h-5 mb-1 ${
                consultation.roomType === 'double' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Divvietīga istaba</div>
              <div className="text-xs text-gray-500">Dalīta istaba</div>
            </button>
            <button
              type="button"
              onClick={() => handleChange('roomType', 'triple')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                consultation.roomType === 'triple'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className={`w-5 h-5 mb-1 ${
                consultation.roomType === 'triple' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Trīsvietīga istaba</div>
              <div className="text-xs text-gray-500">3 gultas</div>
            </button>
          </div>
        </div>

        {/* Internal Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Iekšējās piezīmes
          </label>
          <textarea
            value={consultation.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            rows={3}
            placeholder="Piem., diabēts, nepieciešama palīdzība pārvietojoties, alerģijas, īpašas vēlmes..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Pierakstiet svarīgu informāciju no sarunas, kas nav iekļauta augstāk.
          </p>

          {/* Dementia Checkbox */}
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consultation.hasDementia || false}
                onChange={(e) => handleChange('hasDementia', e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-yellow-900">
                  Residents ir demence
                </span>
                <p className="text-xs text-yellow-700 mt-1">
                  Nepieciešama īpaša istaba ar papildu drošības pasākumiem
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Calculated Price */}
        {price && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Aprēķinātā cena</p>
                <p className="text-xs text-green-600 mt-1">
                  {consultation.careLevel}. līmenis •
                  {consultation.duration === 'long' ? ' Ilglaicīga' : ' Īslaicīga'} •
                  {consultation.roomType === 'single' && ' Vienvietīga'}
                  {consultation.roomType === 'double' && ' Divvietīga'}
                  {consultation.roomType === 'triple' && ' Trīsvietīga'}
                  {consultation.hasDementia && ' • Demence'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-700">{price} €</p>
                <p className="text-xs text-green-600">dienā</p>
              </div>
            </div>
          </div>
        )}

        {/* Save as Klients Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={!allSelected}
            className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
              allSelected
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Saglabāt kā Klientu
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default ConsultationStep;
