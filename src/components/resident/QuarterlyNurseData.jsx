import React, { useState, useEffect } from 'react';
import { Scale, TrendingUp, TrendingDown, Minus, Calendar, AlertCircle } from 'lucide-react';
import {
  getQuarterlyHistory,
  getLatestQuarterlyData,
  hasCurrentQuarterData,
  getWeightTrend,
  getQuarter,
  getQuarterLabel,
  getBMICategory
} from '../../domain/quarterlyDataHelpers';

/**
 * QuarterlyNurseData - Displays quarterly weight/BMI data for a resident
 * Shows current quarter status, BMI category, and historical trend
 */
const QuarterlyNurseData = ({ residentId, onRecordVitals }) => {
  const [latestData, setLatestData] = useState(null);
  const [hasCurrentData, setHasCurrentData] = useState(false);
  const [weightTrend, setWeightTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!residentId) return;

    setIsLoading(true);
    try {
      const latest = getLatestQuarterlyData(residentId);
      const hasCurrent = hasCurrentQuarterData(residentId);
      const trend = getWeightTrend(residentId);

      setLatestData(latest);
      setHasCurrentData(hasCurrent);
      setWeightTrend(trend);
    } catch (error) {
      console.error('Error loading quarterly data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [residentId]);

  // Get current quarter info
  const now = new Date();
  const currentQuarter = getQuarter(now);
  const currentYear = now.getFullYear();
  const currentQuarterLabel = getQuarterLabel(currentQuarter, currentYear);

  // Calculate weight change trend
  const getWeightChange = () => {
    if (weightTrend.length < 2) return null;
    const latest = weightTrend[weightTrend.length - 1]?.weight;
    const previous = weightTrend[weightTrend.length - 2]?.weight;
    if (!latest || !previous) return null;
    const change = latest - previous;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      label: change > 0 ? 'pieaugums' : change < 0 ? 'kritums' : 'nemainīgs'
    };
  };

  const weightChange = getWeightChange();
  const bmiCategory = latestData?.bmi ? getBMICategory(latestData.bmi) : null;

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Svars un ĶMI</h3>
        </div>
        <span className="text-sm text-gray-500">{currentQuarterLabel}</span>
      </div>

      <div className="p-4">
        {/* No data warning */}
        {!hasCurrentData && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Nav šī kvartāla datu</p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Nepieciešams reģistrēt svaru {currentQuarterLabel}
              </p>
              {onRecordVitals && (
                <button
                  onClick={onRecordVitals}
                  className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Reģistrēt vitālos
                </button>
              )}
            </div>
          </div>
        )}

        {/* Latest data display */}
        {latestData ? (
          <div className="space-y-4">
            {/* Current BMI and Weight */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Svars</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {latestData.weight || '—'}
                  </span>
                  <span className="text-sm text-gray-500">kg</span>
                </div>
                {weightChange && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${
                    weightChange.direction === 'up' ? 'text-red-600' :
                    weightChange.direction === 'down' ? 'text-blue-600' :
                    'text-gray-500'
                  }`}>
                    {weightChange.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                    {weightChange.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                    {weightChange.direction === 'same' && <Minus className="w-3 h-3" />}
                    <span>{weightChange.value} kg {weightChange.label}</span>
                  </div>
                )}
              </div>

              {/* BMI */}
              <div className={`p-3 rounded-lg ${
                bmiCategory?.color === 'green' ? 'bg-green-50' :
                bmiCategory?.color === 'yellow' ? 'bg-yellow-50' :
                bmiCategory?.color === 'orange' ? 'bg-orange-50' :
                bmiCategory?.color === 'red' ? 'bg-red-50' :
                'bg-gray-50'
              }`}>
                <p className="text-xs text-gray-500 mb-1">ĶMI</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${
                    bmiCategory?.color === 'green' ? 'text-green-700' :
                    bmiCategory?.color === 'yellow' ? 'text-yellow-700' :
                    bmiCategory?.color === 'orange' ? 'text-orange-700' :
                    bmiCategory?.color === 'red' ? 'text-red-700' :
                    'text-gray-900'
                  }`}>
                    {latestData.bmi || '—'}
                  </span>
                </div>
                {bmiCategory && bmiCategory.value !== 'unknown' && (
                  <p className={`text-xs mt-1 ${
                    bmiCategory.color === 'green' ? 'text-green-600' :
                    bmiCategory.color === 'yellow' ? 'text-yellow-600' :
                    bmiCategory.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {bmiCategory.label}
                  </p>
                )}
              </div>
            </div>

            {/* Measurement info */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                Mērīts: {new Date(latestData.measuredAt).toLocaleDateString('lv-LV')}
                {latestData.measuredBy && ` (${latestData.measuredBy})`}
              </span>
            </div>

            {/* Historical trend */}
            {weightTrend.length > 1 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Svara dinamika</p>
                <div className="flex items-end gap-1 h-16">
                  {weightTrend.map((item, index) => {
                    const maxWeight = Math.max(...weightTrend.map(t => t.weight || 0));
                    const minWeight = Math.min(...weightTrend.filter(t => t.weight).map(t => t.weight));
                    const range = maxWeight - minWeight || 1;
                    const heightPercent = item.weight
                      ? ((item.weight - minWeight) / range * 60) + 40
                      : 20;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                        title={`${item.label}: ${item.weight || '—'} kg`}
                      >
                        <div
                          className={`w-full rounded-t transition-all ${
                            index === weightTrend.length - 1
                              ? 'bg-orange-500'
                              : 'bg-gray-300'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] text-gray-400 mt-1">
                          Q{item.quarter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Scale className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nav svara datu</p>
            {onRecordVitals && (
              <button
                onClick={onRecordVitals}
                className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Reģistrēt pirmo mērījumu
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuarterlyNurseData;
