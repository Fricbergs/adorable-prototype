import React, { useState } from 'react';
import { X, Save, Calendar, Clock, Bed, Users, Heart } from 'lucide-react';

/**
 * Modal for editing consultation information
 */
const EditConsultationModal = ({ consultation, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    careLevel: consultation.careLevel || '',
    duration: consultation.duration || '',
    roomType: consultation.roomType || '',
    notes: consultation.notes || '',
    hasDementia: consultation.hasDementia || false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.careLevel && formData.duration && formData.roomType) {
      onSave(formData);
      onClose();
    }
  };

  const allSelected = formData.careLevel && formData.duration && formData.roomType;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Rediģēt konsultācijas datus</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Care Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Aprūpes līmenis</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('careLevel', level.toString())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.careLevel === level.toString()
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-lg font-bold ${
                    formData.careLevel === level.toString() ? 'text-orange-500' : 'text-gray-700'
                  }`}>
                    {level}. līmenis
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Uzturēšanās ilgums</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('duration', 'long')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.duration === 'long'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className={`w-5 h-5 mb-1 ${formData.duration === 'long' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="font-medium text-gray-900">Ilglaicīga</div>
                <div className="text-xs text-gray-500">Ilgāk par 3 mēnešiem</div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('duration', 'short')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.duration === 'short'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className={`w-5 h-5 mb-1 ${formData.duration === 'short' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="font-medium text-gray-900">Īslaicīga</div>
                <div className="text-xs text-gray-500">Līdz 3 mēnešiem</div>
              </button>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Istabas veids</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleChange('roomType', 'single')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.roomType === 'single'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bed className={`w-5 h-5 mb-1 ${formData.roomType === 'single' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="font-medium text-gray-900">Vienvietīga istaba</div>
                <div className="text-xs text-gray-500">Privāta istaba</div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('roomType', 'double')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.roomType === 'double'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className={`w-5 h-5 mb-1 ${formData.roomType === 'double' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="font-medium text-gray-900">Divvietīga istaba</div>
                <div className="text-xs text-gray-500">Dalīta istaba</div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('roomType', 'triple')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.roomType === 'triple'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className={`w-5 h-5 mb-1 ${formData.roomType === 'triple' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="font-medium text-gray-900">Trīsvietīga istaba</div>
                <div className="text-xs text-gray-500">3 gultas</div>
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Iekšējās piezīmes
            </label>
            <textarea
              value={formData.notes}
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
                  checked={formData.hasDementia}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Atcelt
            </button>
            <button
              type="submit"
              disabled={!allSelected}
              className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                allSelected
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Saglabāt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConsultationModal;
