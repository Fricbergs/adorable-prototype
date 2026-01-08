import React from 'react';
import { Thermometer, Heart, Activity, Wind, Weight, Droplet } from 'lucide-react';
import { VITALS_RANGES } from '../../constants/residentConstants';

/**
 * VitalsSection - Displays current vitals with visual indicators
 */
const VitalsSection = ({ vitals, onRecordNew }) => {
  if (!vitals) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Nav pieejamu mērījumu</p>
        {onRecordNew && (
          <button
            onClick={onRecordNew}
            className="mt-2 text-sm text-orange-600 hover:text-orange-700"
          >
            Pievienot pirmo mērījumu
          </button>
        )}
      </div>
    );
  }

  // Check if value is in normal range
  const isNormal = (value, type) => {
    if (value === null || value === undefined) return null;
    const range = VITALS_RANGES[type];
    if (!range) return null;
    return value >= range.min && value <= range.max;
  };

  // Get blood pressure values
  const bpParts = vitals.bloodPressure?.split('/') || [];
  const systolic = parseInt(bpParts[0]) || null;
  const diastolic = parseInt(bpParts[1]) || null;

  const vitalCards = [
    {
      label: 'Temperatūra',
      value: vitals.temperature,
      unit: '°C',
      icon: Thermometer,
      normal: isNormal(vitals.temperature, 'temperature'),
      color: 'red'
    },
    {
      label: 'Cukura līmenis',
      value: vitals.bloodSugar,
      unit: 'mmol/L',
      icon: Droplet,
      normal: isNormal(vitals.bloodSugar, 'bloodSugar'),
      color: 'purple'
    },
    {
      label: 'Asinsspiediens',
      value: vitals.bloodPressure,
      unit: '',
      icon: Activity,
      normal: systolic !== null ? isNormal(systolic, 'bloodPressureSystolic') && isNormal(diastolic, 'bloodPressureDiastolic') : null,
      color: 'blue'
    },
    {
      label: 'Pulss',
      value: vitals.pulse,
      unit: '',
      icon: Heart,
      normal: isNormal(vitals.pulse, 'pulse'),
      color: 'pink'
    },
    {
      label: 'Saturācija',
      value: vitals.oxygen,
      unit: '%',
      icon: Wind,
      normal: isNormal(vitals.oxygen, 'oxygen'),
      color: 'cyan'
    },
    {
      label: 'Svars',
      value: vitals.weight,
      unit: 'kg',
      icon: Weight,
      normal: null, // No standard range for weight
      color: 'gray'
    }
  ];

  const colorClasses = {
    red: { bg: 'bg-red-50', icon: 'text-red-500', value: 'text-red-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', value: 'text-purple-700' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', value: 'text-blue-700' },
    pink: { bg: 'bg-pink-50', icon: 'text-pink-500', value: 'text-pink-700' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-500', value: 'text-cyan-700' },
    gray: { bg: 'bg-gray-50', icon: 'text-gray-500', value: 'text-gray-700' }
  };

  return (
    <div>
      {/* Measurement date */}
      {vitals.measuredAt && (
        <p className="text-xs text-gray-500 mb-3">
          Mērīts: {new Date(vitals.measuredAt).toLocaleString('lv-LV')}
          {vitals.measuredBy && <span> • {vitals.measuredBy}</span>}
        </p>
      )}

      {/* Vitals grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {vitalCards.map((card, index) => {
          const colors = colorClasses[card.color];
          const hasValue = card.value !== null && card.value !== undefined && card.value !== '';

          return (
            <div
              key={index}
              className={`${colors.bg} rounded-lg p-3 relative`}
            >
              {/* Normal/Abnormal indicator */}
              {card.normal !== null && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  card.normal ? 'bg-green-500' : 'bg-red-500'
                }`} />
              )}

              <div className="flex items-center gap-2 mb-1">
                <card.icon className={`w-4 h-4 ${colors.icon}`} />
                <span className="text-xs text-gray-600">{card.label}</span>
              </div>

              <div className={`text-lg font-bold ${hasValue ? colors.value : 'text-gray-400'}`}>
                {hasValue ? (
                  <>
                    {card.value}
                    {card.unit && <span className="text-sm font-normal ml-1">{card.unit}</span>}
                  </>
                ) : (
                  '—'
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {vitals.notes && (
        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
          {vitals.notes}
        </div>
      )}
    </div>
  );
};

export default VitalsSection;
