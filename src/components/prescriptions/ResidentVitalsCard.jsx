import { Thermometer, Heart, Activity, Droplets, Scale } from 'lucide-react';

/**
 * ResidentVitalsCard - Displays recent vital signs for a resident
 */
export default function ResidentVitalsCard({ vitals }) {
  if (!vitals) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-center">
        Nav pieejamu vitālo rādītāju
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const vitalItems = [
    {
      icon: Thermometer,
      label: 'Temperatūra',
      value: vitals.temperature,
      unit: '°C',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Heart,
      label: 'Asinsspiediens',
      value: vitals.bloodPressure,
      unit: 'mmHg',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Activity,
      label: 'Pulss',
      value: vitals.pulse,
      unit: 'x/min',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Droplets,
      label: 'SpO2',
      value: vitals.oxygen,
      unit: '%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Scale,
      label: 'Svars',
      value: vitals.weight,
      unit: 'kg',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  // Add blood sugar if present
  if (vitals.bloodSugar !== undefined) {
    vitalItems.push({
      icon: Droplets,
      label: 'Cukurs',
      value: vitals.bloodSugar,
      unit: 'mmol/L',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Vitālie rādītāji</h3>
        <span className="text-xs text-gray-500">
          {formatDate(vitals.measuredAt)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vitalItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} rounded-lg p-3 flex items-center gap-2`}
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">{item.label}</span>
              <span className={`font-bold ${item.color}`}>
                {item.value !== undefined && item.value !== null ? `${item.value} ${item.unit}` : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact inline version for print
export function ResidentVitalsInline({ vitals }) {
  if (!vitals) return null;

  const items = [
    { label: 'T', value: vitals.temperature, unit: '°C' },
    { label: 'AS', value: vitals.bloodPressure, unit: '' },
    { label: 'P', value: vitals.pulse, unit: '' },
    { label: 'SpO2', value: vitals.oxygen, unit: '%' },
    { label: 'Svars', value: vitals.weight, unit: 'kg' }
  ];

  if (vitals.bloodSugar) {
    items.push({ label: 'Cukurs', value: vitals.bloodSugar, unit: 'mmol/L' });
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {items.map((item, i) => (
        <span key={i}>
          <span className="font-medium">{item.label}:</span>{' '}
          {item.value !== undefined ? `${item.value}${item.unit}` : '—'}
        </span>
      ))}
    </div>
  );
}
