import React, { useState, useMemo } from 'react';
import { X, Thermometer, Heart, Activity, Wind, Droplet, Scale, Ruler } from 'lucide-react';
import { VITALS_RANGES } from '../../constants/residentConstants';
import { recordVitals } from '../../domain/residentDataHelpers';
import { calculateBMI, getBMICategory } from '../../domain/quarterlyDataHelpers';

/**
 * VitalsModal - Record vitals (Māsas apskate)
 * Based on AD-15 spec: AS, Pulss, Saturācija, Temperatūra, Cukurs, Vispārējais stāvoklis
 */
const VitalsModal = ({ resident, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    // Blood pressure
    systolic: '',
    diastolic: '',
    // Other vitals
    pulse: '',
    oxygen: '',
    temperature: '',
    bloodSugar: '',
    weight: '',
    height: resident?.height || '', // Height for BMI calculation
    // Additional
    generalCondition: '',
    notes: '',
    measuredBy: 'Māsa'
  });

  // Calculate BMI when weight and height are provided
  const bmiData = useMemo(() => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    if (weight && height) {
      const bmi = calculateBMI(weight, height);
      const category = getBMICategory(bmi);
      return { bmi, category };
    }
    return null;
  }, [formData.weight, formData.height]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Check if value is within normal range
  const isInRange = (value, type) => {
    if (!value || value === '') return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    const range = VITALS_RANGES[type];
    if (!range) return null;
    return num >= range.min && num <= range.max;
  };

  const getRangeIndicator = (value, type) => {
    const inRange = isInRange(value, type);
    if (inRange === null) return null;
    return inRange ? (
      <span className="text-green-600 text-xs">Normā</span>
    ) : (
      <span className="text-red-600 text-xs font-medium">Ārpus normas!</span>
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // At least one vital should be recorded
    const hasAnyVital = formData.systolic || formData.diastolic || formData.pulse ||
                        formData.oxygen || formData.temperature || formData.bloodSugar ||
                        formData.weight;

    if (!hasAnyVital) {
      newErrors.general = 'Jāievada vismaz viens mērījums';
    }

    // Validate numeric fields
    if (formData.systolic && isNaN(parseFloat(formData.systolic))) {
      newErrors.systolic = 'Jābūt skaitlim';
    }
    if (formData.diastolic && isNaN(parseFloat(formData.diastolic))) {
      newErrors.diastolic = 'Jābūt skaitlim';
    }
    if (formData.pulse && isNaN(parseFloat(formData.pulse))) {
      newErrors.pulse = 'Jābūt skaitlim';
    }
    if (formData.oxygen && isNaN(parseFloat(formData.oxygen))) {
      newErrors.oxygen = 'Jābūt skaitlim';
    }
    if (formData.temperature && isNaN(parseFloat(formData.temperature))) {
      newErrors.temperature = 'Jābūt skaitlim';
    }
    if (formData.bloodSugar && isNaN(parseFloat(formData.bloodSugar))) {
      newErrors.bloodSugar = 'Jābūt skaitlim';
    }
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Jābūt skaitlim';
    }
    if (formData.height && isNaN(parseFloat(formData.height))) {
      newErrors.height = 'Jābūt skaitlim';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const bloodPressure = formData.systolic && formData.diastolic
        ? `${formData.systolic}/${formData.diastolic}`
        : '';

      recordVitals(resident.id, {
        bloodPressure,
        pulse: formData.pulse ? parseFloat(formData.pulse) : null,
        oxygen: formData.oxygen ? parseFloat(formData.oxygen) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        bmi: bmiData?.bmi || null,
        generalCondition: formData.generalCondition,
        notes: formData.notes,
        measuredBy: formData.measuredBy,
        measuredAt: new Date().toISOString()
      });
      onSave();
    } catch (error) {
      console.error('Error saving vitals:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generalConditionOptions = [
    { value: '', label: 'Nav norādīts' },
    { value: 'good', label: 'Labs' },
    { value: 'satisfactory', label: 'Apmierinošs' },
    { value: 'moderate', label: 'Vidēji smags' },
    { value: 'poor', label: 'Smags' },
    { value: 'critical', label: 'Kritisks' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Reģistrēt vitālos rādītājus
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Blood Pressure */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Asinsspiediens (mmHg)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.systolic}
                  onChange={(e) => handleChange('systolic', e.target.value)}
                  placeholder="Sistoliskais"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.systolic ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getRangeIndicator(formData.systolic, 'bloodPressureSystolic')}
              </div>
              <span className="text-gray-500">/</span>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.diastolic}
                  onChange={(e) => handleChange('diastolic', e.target.value)}
                  placeholder="Diastoliskais"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.diastolic ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getRangeIndicator(formData.diastolic, 'bloodPressureDiastolic')}
              </div>
            </div>
          </div>

          {/* Pulse */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Heart className="w-4 h-4 text-pink-500" />
              Pulss
            </label>
            <div>
              <input
                type="text"
                value={formData.pulse}
                onChange={(e) => handleChange('pulse', e.target.value)}
                placeholder="sitieni/min"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.pulse ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getRangeIndicator(formData.pulse, 'pulse')}
            </div>
          </div>

          {/* Oxygen Saturation */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Wind className="w-4 h-4 text-cyan-500" />
              Saturācija (%)
            </label>
            <div>
              <input
                type="text"
                value={formData.oxygen}
                onChange={(e) => handleChange('oxygen', e.target.value)}
                placeholder="95-100%"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.oxygen ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getRangeIndicator(formData.oxygen, 'oxygen')}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Thermometer className="w-4 h-4 text-red-500" />
              Temperatūra (°C)
            </label>
            <div>
              <input
                type="text"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                placeholder="36.6"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.temperature ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getRangeIndicator(formData.temperature, 'temperature')}
            </div>
          </div>

          {/* Blood Sugar */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Droplet className="w-4 h-4 text-purple-500" />
              Cukura līmenis (mmol/L)
            </label>
            <div>
              <input
                type="text"
                value={formData.bloodSugar}
                onChange={(e) => handleChange('bloodSugar', e.target.value)}
                placeholder="4.0-7.0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.bloodSugar ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getRangeIndicator(formData.bloodSugar, 'bloodSugar')}
            </div>
          </div>

          {/* Weight & Height - for BMI calculation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Scale className="w-4 h-4 text-gray-500" />
                Svars (kg)
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="kg"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Ruler className="w-4 h-4 text-gray-500" />
                Augums (cm)
              </label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="cm"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* BMI Display */}
          {bmiData && (
            <div className={`p-3 rounded-lg border ${
              bmiData.category.color === 'green' ? 'bg-green-50 border-green-200' :
              bmiData.category.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
              bmiData.category.color === 'orange' ? 'bg-orange-50 border-orange-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Ķermeņa masas indekss (ĶMI)
                </span>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    bmiData.category.color === 'green' ? 'text-green-700' :
                    bmiData.category.color === 'yellow' ? 'text-yellow-700' :
                    bmiData.category.color === 'orange' ? 'text-orange-700' :
                    'text-red-700'
                  }`}>
                    {bmiData.bmi}
                  </span>
                  <span className={`ml-2 text-sm ${
                    bmiData.category.color === 'green' ? 'text-green-600' :
                    bmiData.category.color === 'yellow' ? 'text-yellow-600' :
                    bmiData.category.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    ({bmiData.category.label})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* General Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vispārējais stāvoklis
            </label>
            <select
              value={formData.generalCondition}
              onChange={(e) => handleChange('generalCondition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {generalConditionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piezīmes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Papildus novērojumi..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atcelt
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saglabā...' : 'Saglabāt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VitalsModal;
