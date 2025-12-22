import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Enhanced form input with validation feedback
 * Shows success indicator when valid
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  showSuccess,
  required = false,
  placeholder,
  icon: Icon,
  className = ''
}) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = (e) => {
    setTouched(true);
    onBlur?.(e);
  };

  const showError = touched && error;
  const showCheck = touched && showSuccess && !error;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} ${showCheck ? 'pr-9' : 'pr-3'} py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            showError
              ? 'border-red-300'
              : showCheck
              ? 'border-green-300'
              : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        {showCheck && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
      </div>
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
