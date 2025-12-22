import React, { useState } from 'react';
import { X, Save, Mail, Phone } from 'lucide-react';
import FormInput from './FormInput';
import { validateLeadForm, isValidForm, getFieldStatus } from '../domain/validation';

/**
 * Modal for editing lead contact information
 */
const EditLeadModal = ({ lead, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    email: lead.email || '',
    phone: lead.phone || '',
    comment: lead.comment || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLeadForm(formData);
    setErrors(validationErrors);

    if (isValidForm(validationErrors)) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Rediģēt kontaktinformāciju</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <FormInput
            label="Vārds"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            showSuccess={getFieldStatus('firstName', formData.firstName, true).showSuccess}
            required
            placeholder="Anna"
          />

          <FormInput
            label="Uzvārds"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            showSuccess={getFieldStatus('lastName', formData.lastName, true).showSuccess}
            required
            placeholder="Bērziņa"
          />

          <FormInput
            label="E-pasts"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            showSuccess={getFieldStatus('email', formData.email, true).showSuccess}
            required
            placeholder="anna@example.com"
            icon={Mail}
          />

          <FormInput
            label="Telefons"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            showSuccess={getFieldStatus('phone', formData.phone, true).showSuccess}
            required
            placeholder="+371 20000000"
            icon={Phone}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Komentārs
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
              placeholder="Papildu informācija vai vēlmes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Atcelt
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Saglabāt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
