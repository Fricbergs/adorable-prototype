import React from 'react';
import { UserPlus, Mail, Phone, ArrowRight } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import InfoNotice from '../components/InfoNotice';
import FormInput from '../components/FormInput';
import { getFieldStatus } from '../domain/validation';

/**
 * New lead form view
 * Initial form for capturing basic lead information
 */
const NewLeadForm = ({
  leadData,
  errors,
  onChange,
  onSubmit,
  onBack
}) => {
  const handleInputChange = (field, value) => {
    onChange({ ...leadData, [field]: value });
  };

  return (
    <PageShell maxWidth="max-w-2xl">
      <BackButton onClick={onBack} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jauns pieteikums</h1>
            <p className="text-sm text-gray-600">Pievienojiet pamatinformāciju par potenciālo rezidentu</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Contact Fields */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Kontaktinformācija
          </h3>

          <div className="space-y-4">
            <FormInput
              label="Vārds"
              name="firstName"
              value={leadData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              showSuccess={getFieldStatus('firstName', leadData.firstName, true).showSuccess}
              required
              placeholder="Anna"
            />

            <FormInput
              label="Uzvārds"
              name="lastName"
              value={leadData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              showSuccess={getFieldStatus('lastName', leadData.lastName, true).showSuccess}
              required
              placeholder="Bērziņa"
            />

            <FormInput
              label="E-pasts"
              name="email"
              type="email"
              value={leadData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              showSuccess={getFieldStatus('email', leadData.email, true).showSuccess}
              required
              placeholder="anna@example.com"
              icon={Mail}
            />

            <FormInput
              label="Telefons"
              name="phone"
              type="tel"
              value={leadData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              showSuccess={getFieldStatus('phone', leadData.phone, true).showSuccess}
              required
              placeholder="+371 20000000"
              icon={Phone}
            />

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Komentārs
              </label>
              <textarea
                value={leadData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={3}
                placeholder="Papildu informācija vai vēlmes..."
              />
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <InfoNotice variant="blue" title="Datu avoti">
          <p>📞 Telefona saruna &nbsp;•&nbsp; 📧 E-pasts &nbsp;•&nbsp; 💬 Sociālie tīkli</p>
          <p className="text-xs mt-2 text-blue-600">
            Pēc saglabāšanas varēsiet pievienot detalizētāku informāciju konsultācijas laikā.
          </p>
        </InfoNotice>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2"
          >
            Saglabāt potenciālo klientu
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </PageShell>
  );
};

export default NewLeadForm;
