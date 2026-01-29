import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DemoTourStep - Single tooltip/popover step for the demo tour overlay.
 * Renders a centered card on top of a semi-transparent backdrop.
 *
 * Props:
 *  - step: { title, description, instruction }
 *  - currentIndex: zero-based step index
 *  - totalSteps: total number of steps
 *  - onNext: callback to advance
 *  - onPrev: callback to go back
 *  - onClose: callback to close the tour
 */
export default function DemoTourStep({ step, currentIndex, totalSteps, onNext, onPrev, onClose }) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Centered card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {/* Step counter */}
          <div className="text-sm text-gray-400 mb-1">
            {currentIndex + 1}/{totalSteps}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mt-2">
            {step.description}
          </p>

          {/* Instruction */}
          {step.instruction && (
            <p className="text-sm text-blue-600 mt-3 italic">
              {step.instruction}
            </p>
          )}

          {/* Button row */}
          <div className="mt-4 flex items-center justify-between">
            {/* Close (left side) */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Aizvērt
            </button>

            {/* Navigation (right side) */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atpakaļ
                </button>
              )}
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isLast ? 'Pabeigt' : 'Tālāk'}
                {!isLast && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
