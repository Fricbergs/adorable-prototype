import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Printer, AlertTriangle } from 'lucide-react';
import DayStatusCell, { DayStatusLegend } from './DayStatusCell';
import {
  getAllAdministrationLogs,
  getDayAdministrationStatus
} from '../../domain/prescriptionHelpers';

/**
 * MonthlyPrescriptionView - Shows 30-day medication schedule
 * Printable format with refusal list at the bottom
 */
export default function MonthlyPrescriptionView({
  prescriptions,
  residentId,
  residentName,
  onDayClick
}) {
  const [monthOffset, setMonthOffset] = useState(0);

  // Calculate month dates based on offset
  const { monthDates, monthLabel, year } = useMemo(() => {
    const referenceDate = new Date();
    referenceDate.setMonth(referenceDate.getMonth() + monthOffset);
    referenceDate.setDate(1);

    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const monthLabel = referenceDate.toLocaleDateString('lv-LV', { month: 'long', year: 'numeric' });

    return { monthDates: dates, monthLabel, year };
  }, [monthOffset]);

  // Get all administration logs for this resident
  const allLogs = useMemo(() => {
    return getAllAdministrationLogs().filter(l => l.residentId === residentId);
  }, [residentId]);

  // Get today's date string for highlighting
  const today = new Date().toISOString().split('T')[0];

  // Get refusals for this month
  const monthRefusals = useMemo(() => {
    return allLogs.filter(log => {
      if (log.status !== 'refused') return false;
      return monthDates.includes(log.date);
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allLogs, monthDates]);

  // Format date for display (just day number)
  const formatDayNumber = (dateStr) => {
    return new Date(dateStr).getDate();
  };

  // Get day of week abbreviation
  const getDayAbbrev = (dateStr) => {
    const day = new Date(dateStr).getDay();
    const abbrevs = ['Sv', 'P', 'O', 'T', 'C', 'Pk', 'S'];
    return abbrevs[day];
  };

  // Navigate months
  const goToPreviousMonth = () => setMonthOffset(prev => prev - 1);
  const goToNextMonth = () => setMonthOffset(prev => prev + 1);
  const goToCurrentMonth = () => setMonthOffset(0);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Nav aktīvu ordināciju
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Print header - only visible when printing */}
      <div className="hidden print:block print:mb-4">
        <h1 className="text-xl font-bold text-gray-900">Mēneša ordinācijas plāns</h1>
        <p className="text-sm text-gray-600">
          {residentName} - {monthLabel}
        </p>
      </div>

      {/* Month navigation - hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Iepriekšējais mēnesis"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Nākamais mēnesis"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {monthOffset !== 0 && (
            <button
              onClick={goToCurrentMonth}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Šis mēnesis
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-600 capitalize">
            {monthLabel}
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Drukāt
          </button>
        </div>
      </div>

      {/* Legend - visible on screen, compact on print */}
      <div className="print:text-xs">
        <DayStatusLegend />
      </div>

      {/* Monthly table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm print:text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-2 py-2 text-left font-medium text-gray-600 min-w-[150px] print:min-w-[100px]">
                Preparāts
              </th>
              {monthDates.map((date) => {
                const isToday = date === today;
                const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                return (
                  <th
                    key={date}
                    className={`px-0.5 py-1 text-center font-medium w-6 print:w-4 ${
                      isToday ? 'bg-orange-50' : isWeekend ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className={`text-[10px] ${isToday ? 'text-orange-600' : 'text-gray-400'}`}>
                      {getDayAbbrev(date)}
                    </div>
                    <div className={`text-xs ${isToday ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>
                      {formatDayNumber(date)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(prescription => (
              <tr key={prescription.id} className="border-b border-gray-100">
                {/* Medication info */}
                <td className="px-2 py-1">
                  <div className="font-medium text-gray-900 text-xs truncate max-w-[150px]">
                    {prescription.medicationName}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {getScheduleSummary(prescription.schedule)}
                  </div>
                </td>

                {/* Day status cells */}
                {monthDates.map((date) => {
                  const isToday = date === today;
                  const status = getDayAdministrationStatus(prescription, date, allLogs);

                  return (
                    <DayStatusCell
                      key={date}
                      status={status}
                      isToday={isToday}
                      compact={true}
                      onClick={() => onDayClick && onDayClick(prescription, date)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refusal list */}
      {monthRefusals.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Atteikumi šajā mēnesī ({monthRefusals.length})
          </h3>
          <div className="space-y-2">
            {monthRefusals.map((refusal, index) => {
              const prescription = prescriptions.find(p => p.id === refusal.prescriptionId);
              return (
                <div key={index} className="flex items-start gap-3 text-sm bg-red-50 rounded-lg px-3 py-2">
                  <div className="text-red-600 font-medium min-w-[80px]">
                    {new Date(refusal.date).toLocaleDateString('lv-LV', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">
                      {prescription?.medicationName || 'Nezināms preparāts'}
                    </div>
                    {refusal.notes && (
                      <div className="text-gray-600 text-xs mt-0.5">
                        Iemesls: {refusal.notes}
                      </div>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {refusal.timeSlot === 'morning' ? 'Rīts' :
                     refusal.timeSlot === 'noon' ? 'Diena' :
                     refusal.timeSlot === 'evening' ? 'Vakars' : 'Nakts'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Get summary of schedule (which time slots are enabled)
 */
function getScheduleSummary(schedule) {
  const slots = [];
  if (schedule.morning?.enabled) slots.push('R');
  if (schedule.noon?.enabled) slots.push('D');
  if (schedule.evening?.enabled) slots.push('V');
  if (schedule.night?.enabled) slots.push('N');
  return slots.join('/') || '-';
}
