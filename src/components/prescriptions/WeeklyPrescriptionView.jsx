import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayStatusCell, { DayStatusLegend } from './DayStatusCell';
import {
  getWeekDates,
  DAY_ABBREVIATIONS,
  getAllAdministrationLogs,
  getDayAdministrationStatus
} from '../../domain/prescriptionHelpers';

/**
 * WeeklyPrescriptionView - Shows 7-day medication schedule
 * Used to identify conflicts when prescriptions change mid-week
 */
export default function WeeklyPrescriptionView({
  prescriptions,
  residentId,
  onDayClick
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate week dates based on offset
  const weekDates = useMemo(() => {
    const referenceDate = new Date();
    referenceDate.setDate(referenceDate.getDate() + (weekOffset * 7));
    return getWeekDates(referenceDate);
  }, [weekOffset]);

  // Get all administration logs for this resident
  const allLogs = useMemo(() => {
    return getAllAdministrationLogs().filter(l => l.residentId === residentId);
  }, [residentId]);

  // Get today's date string for highlighting
  const today = new Date().toISOString().split('T')[0];

  // Format date for display (just day number)
  const formatDayNumber = (dateStr) => {
    return new Date(dateStr).getDate();
  };

  // Format month/year for header
  const formatWeekHeader = () => {
    const startDate = new Date(weekDates[0]);
    const endDate = new Date(weekDates[6]);

    const startMonth = startDate.toLocaleDateString('lv-LV', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('lv-LV', { month: 'short' });
    const year = startDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    }
    return `${startMonth} - ${endMonth} ${year}`;
  };

  // Navigate weeks
  const goToPreviousWeek = () => setWeekOffset(prev => prev - 1);
  const goToNextWeek = () => setWeekOffset(prev => prev + 1);
  const goToCurrentWeek = () => setWeekOffset(0);

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Nav aktīvu ordināciju
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Iepriekšējā nedēļa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Nākamā nedēļa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={goToCurrentWeek}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Šī nedēļa
            </button>
          )}
        </div>
        <div className="text-sm font-medium text-gray-600">
          {formatWeekHeader()}
        </div>
      </div>

      {/* Legend */}
      <DayStatusLegend />

      {/* Weekly table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-[200px]">
                Preparāts
              </th>
              {weekDates.map((date, index) => {
                const isToday = date === today;
                return (
                  <th
                    key={date}
                    className={`px-1 py-3 text-center text-sm font-medium w-12 ${
                      isToday ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className={`${isToday ? 'text-orange-600' : 'text-gray-600'}`}>
                      {DAY_ABBREVIATIONS[index]}
                    </div>
                    <div className={`text-xs ${isToday ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>
                      {formatDayNumber(date)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(prescription => (
              <tr key={prescription.id} className="border-b border-gray-100 hover:bg-gray-50">
                {/* Medication info */}
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 text-sm">
                    {prescription.medicationName}
                  </div>
                  {prescription.activeIngredient && (
                    <div className="text-xs text-gray-500">
                      {prescription.activeIngredient}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-0.5">
                    {getScheduleSummary(prescription.schedule)}
                  </div>
                </td>

                {/* Day status cells */}
                {weekDates.map((date, index) => {
                  const isToday = date === today;
                  const status = getDayAdministrationStatus(prescription, date, allLogs);

                  return (
                    <DayStatusCell
                      key={date}
                      status={status}
                      isToday={isToday}
                      onClick={() => onDayClick && onDayClick(prescription, date)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile hint */}
      <div className="text-xs text-gray-400 text-center md:hidden">
        ← Velciet, lai skatītu vairāk →
      </div>
    </div>
  );
}

/**
 * Get summary of schedule (which time slots are enabled)
 */
function getScheduleSummary(schedule) {
  const slots = [];
  if (schedule.morning?.enabled) slots.push(schedule.morning.time || 'Rīts');
  if (schedule.noon?.enabled) slots.push(schedule.noon.time || 'Diena');
  if (schedule.evening?.enabled) slots.push(schedule.evening.time || 'Vakars');
  if (schedule.night?.enabled) slots.push(schedule.night.time || 'Nakts');
  return slots.join(', ') || 'Nav laika';
}
