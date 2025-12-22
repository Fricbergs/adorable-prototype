import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Back button component
 * @param {Function} onClick - Click handler
 * @param {string} label - Button label (default: 'Atpakaļ')
 */
const BackButton = ({ onClick, label = 'Atpakaļ' }) => {
  return (
    <button
      onClick={onClick}
      className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};

export default BackButton;
