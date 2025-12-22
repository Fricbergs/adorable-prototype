import React from 'react';
import { CheckCircle, MessageSquare, FileText } from 'lucide-react';

/**
 * Multi-step progress bar component
 * Shows the current stage in the lead journey
 *
 * Flow:
 * - prospect: Form saved, viewing lead details (Step 1 active)
 * - lead: Consultation saved, waiting for decision (Step 1 & 2 complete, Step 3 active)
 * - agreement/queue: Decision made (All steps complete/final)
 */
const ProgressBar = ({ currentStatus }) => {
  // Step 1: Form/Pieteikums
  const step1 = {
    completed: ['lead', 'agreement', 'queue'].includes(currentStatus),
    active: currentStatus === 'prospect'
  };

  // Step 2: Consultation/Klients
  // When status is 'lead', consultation is ALREADY saved, so it should be complete!
  const step2 = {
    completed: ['lead', 'agreement', 'queue'].includes(currentStatus),
    active: false // This step is never "active" - it's either pending or complete
  };

  // Step 3: Decision/Līgums-Rinda
  const step3 = {
    completed: false, // Never truly "completed" - it's the final state
    active: ['lead', 'agreement', 'queue'].includes(currentStatus)
  };

  // Helper to get step styling
  const getStepClasses = (step) => {
    if (step.completed) {
      return 'bg-green-500 text-white';
    }
    if (step.active) {
      return 'bg-orange-500 text-white ring-4 ring-orange-100';
    }
    return 'bg-gray-200 text-gray-400';
  };

  const getTextClasses = (step) => {
    if (step.completed) return 'text-green-600';
    if (step.active) return 'text-orange-600';
    return 'text-gray-400';
  };

  const getConnectorClasses = (previousStep) => {
    return previousStep.completed ? 'bg-green-500' : 'bg-gray-200';
  };

  return (
    <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Step 1 - Pieteikums */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(step1)}`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className={`text-sm font-medium mt-2 ${getTextClasses(step1)}`}>
            Pieteikums
          </p>
          <p className="text-xs text-gray-500">
            {step1.completed ? 'Saglabāts' : step1.active ? 'Aktīvs' : '-'}
          </p>
        </div>

        {/* Connector 1→2 */}
        <div className={`flex-1 h-1 mx-2 -mt-6 ${getConnectorClasses(step1)}`}></div>

        {/* Step 2 - Klients */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(step2)}`}>
            {step2.completed ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </div>
          <p className={`text-sm font-medium mt-2 ${getTextClasses(step2)}`}>
            Klients
          </p>
          <p className="text-xs text-gray-500">
            {step2.completed ? 'Saglabāts' : '-'}
          </p>
        </div>

        {/* Connector 2→3 */}
        <div className={`flex-1 h-1 mx-2 -mt-6 ${getConnectorClasses(step2)}`}></div>

        {/* Step 3 - Līgums/Rinda */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(step3)}`}>
            <FileText className="w-5 h-5" />
          </div>
          <p className={`text-sm font-medium mt-2 ${getTextClasses(step3)}`}>
            Līgums/Rinda
          </p>
          <p className="text-xs text-gray-500">
            {step3.active ? 'Gaida' : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
