import React, { useState } from 'react';
import { FileText, User, UserCheck, Save } from 'lucide-react';
import PageShell from '../components/PageShell';
import BackButton from '../components/BackButton';
import ProgressBar from '../components/ProgressBar';
import FormInput from '../components/FormInput';
import InfoNotice from '../components/InfoNotice';
import { RESIDENT_FIELDS, CLIENT_FIELDS } from '../domain/agreementFields';

/**
 * Survey View - Admin fills all legal/personal details
 * After consultation, admin collects all necessary information for agreement
 */
const SurveyView = ({ savedLead, onSubmit, onBack }) => {
  // Determine initial scenario based on consultation source
  const isRelativeSource = savedLead.consultation?.contactSource === 'relative';

  const existingSurvey = savedLead.survey || {};
  const [signerScenario, setSignerScenario] = useState(
    existingSurvey.signerScenario || (isRelativeSource ? 'relative' : 'resident')
  );
  const [formData, setFormData] = useState({
    // Resident fields - pre-fill from lead or existing survey
    firstName: existingSurvey.firstName || savedLead.firstName || '',
    lastName: existingSurvey.lastName || savedLead.lastName || '',
    phone: existingSurvey.phone || (!isRelativeSource ? savedLead.phone : ''),
    email: existingSurvey.email || (!isRelativeSource ? savedLead.email : ''),
    birthDate: existingSurvey.birthDate || '',
    personalCode: existingSurvey.personalCode || '',
    street: existingSurvey.street || '',
    city: existingSurvey.city || '',
    postalCode: existingSurvey.postalCode || '',
    gender: existingSurvey.gender || '',
    disabilityGroup: existingSurvey.disabilityGroup || '',
    disabilityDateFrom: existingSurvey.disabilityDateFrom || '',
    disabilityDateTo: existingSurvey.disabilityDateTo || '',
    stayDateFrom: existingSurvey.stayDateFrom || new Date().toISOString().split('T')[0],
    stayDateTo: existingSurvey.stayDateTo || '',

    // Client fields
    clientFirstName: existingSurvey.clientFirstName || (isRelativeSource ? savedLead.firstName : ''),
    clientLastName: existingSurvey.clientLastName || (isRelativeSource ? savedLead.lastName : ''),
    relationship: existingSurvey.relationship || '',
    clientPhone: existingSurvey.clientPhone || (isRelativeSource ? savedLead.phone : ''),
    clientEmail: existingSurvey.clientEmail || (isRelativeSource ? savedLead.email : ''),
    clientStreet: existingSurvey.clientStreet || '',
    clientCity: existingSurvey.clientCity || '',
    clientPostalCode: existingSurvey.clientPostalCode || '',
    clientPersonalCode: existingSurvey.clientPersonalCode || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const renderFieldGroup = (group) => {
    return (
      <div key={group.id} className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
          {group.title}
        </h4>
        <div className="space-y-4">
          {group.fields.map(field => {
            // Hide disability date fields if no disability group is selected
            const hasDisability = formData.disabilityGroup && formData.disabilityGroup !== 'none' && formData.disabilityGroup !== '';
            if ((field.name === 'disabilityDateFrom' || field.name === 'disabilityDateTo') && !hasDisability) {
              return null;
            }

            // Determine appropriate width class based on field type and name
            const getFieldWidth = () => {
              if (field.type === 'date') return 'max-w-xs';
              if (field.type === 'tel') return 'max-w-sm';
              if (field.name === 'personalCode' || field.name === 'clientPersonalCode') return 'max-w-sm';
              if (field.name === 'postalCode' || field.name === 'clientPostalCode') return 'max-w-xs';
              if (field.name === 'city' || field.name === 'clientCity') return 'max-w-sm';
              if (field.type === 'select' && (field.name === 'gender' || field.name === 'disabilityGroup')) return 'max-w-xs';
              return 'w-full';
            };

            return (
              <div key={field.name}>
                {field.type === 'select' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`${getFieldWidth()} px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white`}
                    >
                      <option value="">Izvēlieties...</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className={getFieldWidth()}>
                    <FormInput
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      error={errors[field.name]}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                    {field.helper && <p className="mt-1 text-xs text-gray-500">{field.helper}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};

    RESIDENT_FIELDS.forEach(group => {
      group.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = 'Obligāts lauks';
        }
      });
    });

    if (signerScenario === 'relative') {
      CLIENT_FIELDS.forEach(group => {
        group.fields.forEach(field => {
          if (field.required && !formData[field.name]) {
            newErrors[field.name] = 'Obligāts lauks';
          }
        });
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        signerScenario
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <PageShell>
      <div className="mb-6">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Aptaujas anketa</h1>
        <p className="text-sm text-gray-600">Ievadiet visu nepieciešamo informāciju līguma sagatavošanai</p>
      </div>

      <ProgressBar currentStatus={savedLead.status} />

      <InfoNotice variant="blue" title="Nepieciešamā informācija">
        <p className="text-sm">
          Aizpildiet visus obligātos laukus. Šī informācija tiks izmantota līguma sagatavošanai.
        </p>
      </InfoNotice>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Resident Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Rezidenta informācija</h3>
          </div>
          {RESIDENT_FIELDS.map(group => renderFieldGroup(group))}
        </div>

        {/* Signer Scenario */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Līguma parakstītājs</h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                signerScenario === 'resident'
                  ? 'border-blue-500 bg-white shadow-sm'
                  : 'border-transparent hover:bg-gray-100'
              }`}>
                <input
                  type="radio"
                  name="scenario"
                  value="resident"
                  checked={signerScenario === 'resident'}
                  onChange={(e) => setSignerScenario(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900 block">Rezidents pats</span>
                  <span className="text-xs text-gray-500">Parakstīs rezidents personīgi</span>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                signerScenario === 'relative'
                  ? 'border-blue-500 bg-white shadow-sm'
                  : 'border-transparent hover:bg-gray-100'
              }`}>
                <input
                  type="radio"
                  name="scenario"
                  value="relative"
                  checked={signerScenario === 'relative'}
                  onChange={(e) => setSignerScenario(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900 block">Radinieks / Pilnvarotā persona</span>
                  <span className="text-xs text-gray-500">Parakstīs cita persona</span>
                </div>
              </label>
            </div>
          </div>

          {signerScenario === 'resident' ? (
            <InfoNotice variant="blue" title="Līguma parakstīs rezidents">
              <p className="text-sm">
                Līgums tiks sagatavots uz rezidenta vārda. Rēķini tiks sūtīti uz rezidenta e-pastu.
              </p>
            </InfoNotice>
          ) : (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Parakstītāja informācija</h4>
              {CLIENT_FIELDS.map(group => renderFieldGroup(group))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Atpakaļ
          </button>
          <button
            type="submit"
            className="flex-1 px-8 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Saglabāt aptauju
          </button>
        </div>
      </form>
    </PageShell>
  );
};

export default SurveyView;
