import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Mail, AlertCircle, Save, User } from 'lucide-react';
import { usePersistedLeads } from '../hooks/useLocalStorage';
import FormInput from '../components/FormInput';
import { RESIDENT_FIELDS, CLIENT_FIELDS } from '../domain/agreementFields';

/**
 * Customer Fill View (Fillable)
 * For remote scenario - customer fills out questionnaire themselves
 */
const CustomerFillView = () => {
  const { id } = useParams();
  const { leads, addLead } = usePersistedLeads();
  const lead = leads.find(l => l.id === id);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const existingSurvey = lead?.survey || {};

  const [signerScenario, setSignerScenario] = useState(
    existingSurvey.signerScenario || 'resident'
  );

  const [formData, setFormData] = useState({
    // Pre-fill from lead
    firstName: existingSurvey.firstName || lead?.firstName || '',
    lastName: existingSurvey.lastName || lead?.lastName || '',
    phone: existingSurvey.phone || lead?.phone || '',
    email: existingSurvey.email || lead?.email || '',
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pieteikums nav atrasts</h1>
          <p className="text-gray-600">
            Šī saite vairs nav derīga vai pieteikums ir dzēsts.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paldies!</h1>
          <p className="text-gray-600 mb-4">
            Jūsu anketa ir veiksmīgi nosūtīta. Mēs sazināsimies ar Jums tuvākajā laikā.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-900 font-medium">Adoro Šampēteris</p>
            <p className="text-sm text-blue-800 mt-2">Tālrunis: +371 20 616 003</p>
            <p className="text-sm text-blue-800">E-pasts: rezidence.sampeteris@adoro.lv</p>
          </div>
        </div>
      </div>
    );
  }

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
            const hasDisability = formData.disabilityGroup && formData.disabilityGroup !== 'none' && formData.disabilityGroup !== '';
            if ((field.name === 'disabilityDateFrom' || field.name === 'disabilityDateTo') && !hasDisability) {
              return null;
            }

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
      // Save to localStorage
      const updated = {
        ...lead,
        status: 'survey_filled',
        survey: {
          ...formData,
          signerScenario
        }
      };
      addLead(updated);
      setSubmitted(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const consultation = lead.consultation || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/60x60/f97316/ffffff?text=A"
              alt="Adoro"
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adoro Šampēteris</h1>
              <p className="text-sm text-gray-600">Sociālās aprūpes centrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Labdien, {lead.firstName} {lead.lastName}!
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Paldies par interesi par Adoro aprūpes centru. Lūdzu aizpildiet šo anketu ar visu nepieciešamo informāciju līguma sagatavošanai.
          </p>

          {/* Service Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Jūsu izvēlētais pakalpojums:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Aprūpe:</span>
                <span className="ml-1 font-medium">{consultation.careLevel}. līmenis</span>
              </div>
              <div>
                <span className="text-gray-600">Istaba:</span>
                <span className="ml-1 font-medium">
                  {consultation.roomType === 'single' ? 'Vienvietīga' : 'Divvietīga'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Periods:</span>
                <span className="ml-1 font-medium">
                  {consultation.duration === 'long' ? 'Ilglaicīgs' : 'Īslaicīgs'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Cena:</span>
                <span className="ml-1 font-bold text-green-700">{consultation.price} €/dienā</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
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
            <h3 className="font-semibold text-gray-900 mb-4">Līguma parakstītājs</h3>
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
                    <span className="text-xs text-gray-500">Parakstīšu personīgi</span>
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

            {signerScenario === 'relative' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Parakstītāja informācija</h4>
                {CLIENT_FIELDS.map(group => renderFieldGroup(group))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Nosūtīt anketu
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="font-semibold text-gray-900 mb-2">Adoro Šampēteris</p>
            <p>Zolitūdes iela 68A, Rīga, LV-1046</p>
            <p className="mt-2">Tālrunis: +371 20 616 003 | E-pasts: rezidence.sampeteris@adoro.lv</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFillView;
