import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { STEPS } from '../../constants/steps';
import DemoTourStep from './DemoTourStep';

/**
 * DEMO_STEPS - 5-step guided tour covering all inventory workflow types.
 *
 * Step 1: XML import (Supplier 1)
 * Step 2: Manual entry (Supplier 2)
 * Step 3: Transfer A -> B
 * Step 4: Relative-brought medication
 * Step 5: Foreign medication
 */
const DEMO_STEPS = [
  {
    title: '1. solis: XML imports (Piegādātājs 1)',
    description:
      'Dodieties uz Lielo noliktavu un atveriet XML importa modāli, lai saņemtu medikamentus no Recipe Plus.',
    instruction:
      "Nospiediet 'Saņemt XML' pogu, lai redzētu importa formu.",
    targetView: STEPS.INVENTORY_DASHBOARD
  },
  {
    title: '2. solis: Manuālā ievade (Piegādātājs 2)',
    description:
      'Izmantojiet manuālo ievadi, lai reģistrētu medikamentus no otra piegādātāja ar papīra pavadzīmi.',
    instruction:
      "Nospiediet 'Manuālā ievade' pogu, lai aizpildītu pavadzīmes formu.",
    targetView: STEPS.INVENTORY_DASHBOARD
  },
  {
    title: '3. solis: Pārvietošana A uz B',
    description:
      'Pārvietojiet medikamentu no lielās noliktavas (A) uz rezidenta noliktavu (B).',
    instruction:
      "Izvēlēties rezidentu un nospiediet pārvietošanas pogu pie medikamenta.",
    targetView: STEPS.RESIDENT_INVENTORY_LIST
  },
  {
    title: '4. solis: Radinieki atnes medikamentu',
    description:
      'Reģistrējiet medikamentu, ko rezidenta radinieki atnesa. Tas tiks ierakstīts ar nulles izmaksām.',
    instruction:
      "Rezidenta noliktavā nospiediet 'Pievienot ārējo' un izvēlēties no kataloga.",
    targetView: STEPS.RESIDENT_INVENTORY_LIST
  },
  {
    title: '5. solis: Ārvalstu medikaments',
    description:
      'Ievadiet ārvalstu medikamentu, kas nav pieejams Latvijas katalogā. Ievadiet nosaukumu, vielu un izcelsmes valsti.',
    instruction:
      "Nospiediet 'Pievienot ārējo', meklējiet nesaņemtu nosaukumu, un aizpildiet manuāli.",
    targetView: STEPS.RESIDENT_INVENTORY_LIST
  }
];

/**
 * DemoTour - Main tour controller.
 *
 * Props:
 *  - currentStep: index into DEMO_STEPS (0-4), or 5 for completion
 *  - onNext: increment step
 *  - onPrev: decrement step
 *  - onClose: close tour entirely
 *  - onNavigate: callback to navigate app to a target view (STEPS constant value)
 */
export default function DemoTour({ currentStep, onNext, onPrev, onClose, onNavigate }) {
  const totalSteps = DEMO_STEPS.length;
  const isComplete = currentStep >= totalSteps;

  // Navigate to the correct view whenever step changes
  useEffect(() => {
    if (!isComplete && onNavigate) {
      const step = DEMO_STEPS[currentStep];
      if (step && step.targetView) {
        onNavigate(step.targetView);
      }
    }
  }, [currentStep, isComplete, onNavigate]);

  // Completion card (after step 5)
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Semi-transparent backdrop */}
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />

        {/* Centered completion card */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />

            <h3 className="text-lg font-bold text-gray-900">
              Demo pabeigts!
            </h3>

            <p className="text-gray-600 mt-2">
              Jūs izgājāt cauri visiem noliktavas darbības veidiem.
              Skatiet izmaksu atskaites sadaļā <strong>Noliktava &gt; Atskaites</strong> un
              importu vēsturi sadaļā <strong>Iestatījumi &gt; Importu vēsture</strong>.
            </p>

            <button
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Aizvērt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active step
  const step = DEMO_STEPS[currentStep];

  return (
    <DemoTourStep
      step={step}
      currentIndex={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrev={onPrev}
      onClose={onClose}
    />
  );
}
