import React from 'react';
import { CheckCircle, MessageSquare, FileText, ClipboardList } from 'lucide-react';

/**
 * Multi-step progress bar component
 * Shows the current stage in the lead journey
 *
 * Flow (4 steps):
 * 1. Pieteikums (prospect) - Application saved
 * 2. Konsultācija (consultation) - Consultation completed
 * 3. Anketa (survey_filled) - Survey filled
 * 4. Līgums (agreement/queue) - Agreement signed or in queue
 */
const ProgressBar = ({ currentStatus }) => {
  // Step 1: Pieteikums (Application) - Always completed when viewing
  const step1 = {
    completed: true, // If we're viewing it, it's already saved
    active: false
  };

  // Step 2: Konsultācija (Consultation)
  const step2 = {
    completed: ['consultation', 'survey_filled', 'agreement', 'queue'].includes(currentStatus),
    active: currentStatus === 'prospect' // Active when waiting for consultation
  };

  // Step 3: Anketa (Survey)
  const step3 = {
    completed: ['survey_filled', 'agreement', 'queue'].includes(currentStatus),
    active: currentStatus === 'consultation' // Active when consultation done, waiting for survey
  };

  // Step 4: Līgums/Rinda (Agreement/Queue)
  const step4 = {
    completed: false, // Final state
    active: ['survey_filled', 'agreement', 'queue'].includes(currentStatus)
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
        <div className={`flex-1 h-1 mx-1 -mt-6 ${getConnectorClasses(step1)}`}></div>

        {/* Step 2 - Konsultācija */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(step2)}`}>
            {step2.completed ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </div>
          <p className={`text-sm font-medium mt-2 ${getTextClasses(step2)}`}>
            Konsultācija
          </p>
          <p className="text-xs text-gray-500">
            {step2.completed ? 'Pabeigta' : step2.active ? 'Aktīva' : '-'}
          </p>
        </div>

        {/* Connector 2→3 */}
        <div className={`flex-1 h-1 mx-1 -mt-6 ${getConnectorClasses(step2)}`}></div>

        {/* Step 3 - Anketa */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(step3)}`}>
            {step3.completed ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <ClipboardList className="w-5 h-5" />
            )}
          </div>
          <p className={`text-sm font-medium mt-2 ${getTextClasses(step3)}`}>
            Anketa
          </p>
          <p className="text-xs text-gray-500">
            {step3.completed ? 'Aizpildīta' : step3.active ? 'Gaida' : '-'}
          </p>
        </div>

        {/* Connector 3→4 */}
        <div className={`flex-1 h-1 mx-1 -mt-6 ${getConnectorClasses(step3)}`}></div>

        {/* Step 4 - Līgums/Rinda */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(step4)}`}>
            <FileText className="w-5 h-5" />
          </div>
          <p className={`text-sm font-medium mt-2 ${getTextClasses(step4)}`}>
            Līgums
          </p>
          <p className="text-xs text-gray-500">
            {currentStatus === 'agreement' ? 'Parakstīts' : currentStatus === 'queue' ? 'Rindā' : step4.active ? 'Gaida' : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
