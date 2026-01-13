import React, { useState } from 'react';
import { FileText, User, UserCheck, Save, Mail, X, Send } from 'lucide-react';
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
  const existingSurvey = savedLead.survey || {};
  const [signerScenario, setSignerScenario] = useState(
    existingSurvey.signerScenario || 'resident'
  );
  const [formData, setFormData] = useState({
    // Resident fields - pre-fill from lead or existing survey
    firstName: existingSurvey.firstName || savedLead.firstName || '',
    lastName: existingSurvey.lastName || savedLead.lastName || '',
    phone: existingSurvey.phone || savedLead.phone || '',
    email: existingSurvey.email || savedLead.email || '',
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

    // Contract terms
    securityDeposit: existingSurvey.securityDeposit || 'no',
    securityDepositAmount: existingSurvey.securityDepositAmount || '',
    paymentDeadline: existingSurvey.paymentDeadline || '',
    healthDataConsent: existingSurvey.healthDataConsent || 'yes',
    storeIdDocuments: existingSurvey.storeIdDocuments || 'no',

    // Additional services
    laundryService: existingSurvey.laundryService || 'no',
    podologistService: existingSurvey.podologistService || 'no',
    podologistFrequency: existingSurvey.podologistFrequency || '',
    otherServicesEnabled: existingSurvey.otherServicesEnabled || 'no',
    otherServices: existingSurvey.otherServices || '',

    // Client fields
    clientFirstName: existingSurvey.clientFirstName || '',
    clientLastName: existingSurvey.clientLastName || '',
    relationship: existingSurvey.relationship || '',
    clientPhone: existingSurvey.clientPhone || '',
    clientEmail: existingSurvey.clientEmail || '',
    clientStreet: existingSurvey.clientStreet || '',
    clientCity: existingSurvey.clientCity || '',
    clientPostalCode: existingSurvey.clientPostalCode || '',
    clientPersonalCode: existingSurvey.clientPersonalCode || ''
  });

  const [errors, setErrors] = useState({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailSent, setEmailSent] = useState(existingSurvey.emailSentAt ? true : false);

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

            // Hide security deposit amount if security deposit is not selected
            if (field.name === 'securityDepositAmount' && formData.securityDeposit !== 'yes') {
              return null;
            }

            // Hide podologist frequency if podologist service is not selected
            if (field.name === 'podologistFrequency' && formData.podologistService !== 'yes') {
              return null;
            }

            // Hide other services description if not enabled
            if (field.name === 'otherServices' && formData.otherServicesEnabled !== 'yes') {
              return null;
            }

            // Determine appropriate width class based on field type and name
            const getFieldWidth = () => {
              if (field.type === 'date') return 'max-w-xs';
              if (field.type === 'tel') return 'max-w-sm';
              if (field.type === 'number') return 'max-w-xs';
              if (field.name === 'personalCode' || field.name === 'clientPersonalCode') return 'max-w-sm';
              if (field.name === 'postalCode' || field.name === 'clientPostalCode') return 'max-w-xs';
              if (field.name === 'city' || field.name === 'clientCity') return 'max-w-sm';
              if (field.type === 'select' && (field.name === 'gender' || field.name === 'disabilityGroup')) return 'max-w-xs';
              if (field.type === 'select') return 'max-w-md';
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

  // Check if all required fields are filled
  const checkFormCompleteness = () => {
    const missingFields = [];

    RESIDENT_FIELDS.forEach(group => {
      group.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          missingFields.push(field.name);
        }
      });
    });

    if (signerScenario === 'relative') {
      CLIENT_FIELDS.forEach(group => {
        group.fields.forEach(field => {
          if (field.required && !formData[field.name]) {
            missingFields.push(field.name);
          }
        });
      });
    }

    return missingFields;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = checkFormCompleteness();

    if (missingFields.length === 0) {
      // Form is complete - save and continue
      onSubmit({
        ...formData,
        signerScenario,
        isComplete: true
      });
    } else {
      // Form is incomplete - show modal to send to client
      setShowSendModal(true);
    }
  };

  // Save as draft without validation
  const handleSaveDraft = () => {
    onSubmit({
      ...formData,
      signerScenario,
      isComplete: false,
      emailSentAt: emailSent ? new Date().toISOString() : null
    });
  };

  // Simulate sending email to client
  const handleSendEmail = () => {
    const clientEmail = formData.email || savedLead.email;
    if (clientEmail) {
      // Simulate email sent
      setEmailSent(true);
      alert(`Anketa nosūtīta uz: ${clientEmail}\n\n(Šī ir simulācija - īstā sistēmā tiktu nosūtīts e-pasts)`);

      // Save with email sent timestamp
      onSubmit({
        ...formData,
        signerScenario,
        isComplete: false,
        emailSentAt: new Date().toISOString()
      });
    }
    setShowSendModal(false);
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

      {/* Send Survey Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Anketa nav pilnīga</h2>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-gray-600">
                Anketa nav pilnībā aizpildīta. Vai vēlaties nosūtīt anketu klientam, lai viņš to aizpilda pats?
              </p>

              {/* Client email info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>E-pasts:</strong> {formData.email || savedLead.email || 'Nav norādīts'}
                </p>
                {emailSent && (
                  <p className="text-xs text-blue-600 mt-1">
                    Anketa jau tika nosūtīta iepriekš
                  </p>
                )}
              </div>

              {!(formData.email || savedLead.email) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    Lai nosūtītu anketu, vispirms jānorāda klienta e-pasta adrese.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSendEmail}
                disabled={!(formData.email || savedLead.email)}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Nosūtīt anketu klientam
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                Saglabāt kā melnrakstu
              </button>
              <button
                onClick={() => setShowSendModal(false)}
                className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-700 font-medium"
              >
                Turpināt rediģēt
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default SurveyView;
