import React, { useState } from 'react';
import {
  Phone, Mail, User, Users, Building2, Calendar,
  CheckCircle, Clock, AlertCircle, ChevronRight,
  FileText, UserPlus, ListChecks, Bed, Euro,
  Home, Heart, MessageSquare, ArrowRight, ArrowLeft
} from 'lucide-react';

const ClientIntakePrototype = () => {
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'lead-view', 'consultation', 'agreement', 'queue'
  const [leadData, setLeadData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [savedLead, setSavedLead] = useState(null);
  const [errors, setErrors] = useState({});
  const [consultation, setConsultation] = useState({
    facility: 'melodija', // Pre-selected based on login
    careLevel: '', // '1', '2', '3', '4'
    duration: '', // 'long' or 'short'
    roomType: '', // 'single' or 'double'
    notes: '' // Internal notes from conversation
  });

  // Pricing data from Excel (EUR per day)
  const pricing = {
    melodija: {
      long: {
        double: { 1: 48, 2: 51, 3: 58, 4: 63 },
        single: { 1: 65, 2: 70, 3: 77, 4: 87 }
      },
      short: {
        double: { 1: 51, 2: 55, 3: 63, 4: 67 },
        single: { 1: 69, 2: 74, 3: 82, 4: 95 }
      }
    },
    sampeteris: {
      long: {
        double: { 1: 51, 2: 55, 3: 62, 4: 67 },
        single: { 1: 69, 2: 74, 3: 82, 4: 94 }
      },
      short: {
        double: { 1: 55, 2: 58, 3: 67, 4: 71 },
        single: { 1: 73, 2: 80, 3: 88, 4: 101 }
      }
    }
  };

  const calculatePrice = () => {
    const { facility, careLevel, duration, roomType } = consultation;
    if (!facility || !careLevel || !duration || !roomType) return null;
    return pricing[facility][duration][roomType][careLevel];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!leadData.firstName.trim()) newErrors.firstName = 'Vārds ir obligāts';
    if (!leadData.lastName.trim()) newErrors.lastName = 'Uzvārds ir obligāts';
    if (!leadData.email.trim()) newErrors.email = 'E-pasts ir obligāts';
    if (!leadData.phone.trim()) newErrors.phone = 'Telefons ir obligāts';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create saved prospect with generated data
      const newLead = {
        id: 'L-2025-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        ...leadData,
        status: 'prospect', // Initial status is Prospect
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' }),
        source: 'manual',
        assignedTo: 'Kristens Blūms'
      };
      setSavedLead(newLead);
      setCurrentStep('lead-view');
    }
  };

  // Save consultation data and upgrade to Lead status
  const saveAsLead = () => {
    const price = calculatePrice();
    setSavedLead({
      ...savedLead,
      status: 'lead',
      consultation: {
        ...consultation,
        price: price
      }
    });
    setCurrentStep('waiting');
  };

  // Step 1: New Lead Form
  const newLeadForm = (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentStep('list')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ
          </button>

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
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Contact Fields */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Kontaktinformācija
              </h3>

              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vārds <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leadData.firstName}
                    onChange={(e) => setLeadData({ ...leadData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Anna"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uzvārds <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leadData.lastName}
                    onChange={(e) => setLeadData({ ...leadData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Bērziņa"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-pasts <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={leadData.email}
                      onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="anna@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefons <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={leadData.phone}
                      onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+371 20000000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Komentārs
                  </label>
                  <textarea
                    value={leadData.comment}
                    onChange={(e) => setLeadData({ ...leadData, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                    placeholder="Papildu informācija vai vēlmes..."
                  />
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">Datu avoti</p>
                <p className="text-blue-700">
                  📞 Telefona saruna &nbsp;•&nbsp; 📧 E-pasts &nbsp;•&nbsp; 💬 Sociālie tīkli
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  Pēc saglabāšanas varēsiet pievienot detalizētāku informāciju konsultācijas laikā.
                </p>
              </div>
            </div>

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
        </div>
      </div>
  );

  // Step 2: Lead Details View
  const LeadDetailsView = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentStep('form')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ
          </button>

          {/* Progress Bar - Hidden on mobile */}
          <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {/* Step 1 - Jauns pieteikums */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white ring-4 ring-orange-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-orange-600 mt-2">Pieteikums</p>
                <p className="text-xs text-gray-500">Aktīvs</p>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-gray-200 mx-2 -mt-6"></div>

              {/* Step 2 - Jauns klients */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-400 mt-2">Klients</p>
                <p className="text-xs text-gray-400">-</p>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-gray-200 mx-2 -mt-6"></div>

              {/* Step 3 - Pending */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-400 mt-2">Līgums/Rinda</p>
                <p className="text-xs text-gray-400">-</p>
              </div>
            </div>
          </div>

          {/* Main Content - Contact Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            {/* Header with avatar and name */}
            <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-semibold">
                {savedLead.firstName[0]}{savedLead.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {savedLead.firstName} {savedLead.lastName}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium mt-1">
                  <Clock className="w-3 h-3" />
                  Jauns pieteikums
                </span>
              </div>
            </div>

            {/* Contact details */}
            <div className="py-4 space-y-3">
              <a href={`mailto:${savedLead.email}`} className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-base">{savedLead.email}</span>
              </a>
              <a href={`tel:${savedLead.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-base">{savedLead.phone}</span>
              </a>
            </div>

            {/* Comment if exists */}
            {savedLead.comment && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Komentārs</p>
                <p className="text-gray-700 italic">"{savedLead.comment}"</p>
              </div>
            )}

            {/* Info Notice */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">Automātiskie datu avoti</p>
                <p className="text-blue-700">
                  🌐 Mājaslapas forma &nbsp;•&nbsp; 📋 Pansionati.info &nbsp;•&nbsp; 🔗 Citi portāli
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  Strukturētie dati no ārējiem avotiem tiek automātiski importēti šeit.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {/* Consultation Info */}
              <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
                <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-900">
                  <p className="font-medium mb-1">Konsultācija klātienē vai telefoniski</p>
                  <p className="text-orange-700">
                    Uzsākot konsultāciju, jūs sazināsieties ar klientu, lai noskaidrotu potenciālā rezidenta veselības stāvokli, aprūpes vajadzības un vēlmes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep('consultation')}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Sākt konsultāciju
              </button>
            </div>
          </div>

          {/* Metadata - Less Prominent */}
          <div className="text-xs text-gray-400 flex items-center justify-between px-2">
            <span>ID: {savedLead.id}</span>
            <span>Pievienoja: {savedLead.assignedTo}</span>
            <span>{savedLead.createdDate} {savedLead.createdTime}</span>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Consultation Outcome
  // Calculate these outside the JSX
  const price = calculatePrice();
  const allSelected = consultation.facility && consultation.careLevel && consultation.duration && consultation.roomType;

  // Step 3: Consultation Outcome (as JSX variable to prevent re-renders)
  const consultationOutcome = savedLead ? (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentStep('lead-view')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ
          </button>

          {/* Progress Bar - Hidden on mobile */}
          <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {/* Step 1 - Pieteikums (Completed) */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-green-600 mt-2">Pieteikums</p>
                <p className="text-xs text-gray-500">Saglabāts</p>
              </div>

              {/* Connector */}
              <div className={`flex-1 h-1 mx-2 -mt-6 ${savedLead.status === 'lead' ? 'bg-green-500' : 'bg-green-500'}`}></div>

              {/* Step 2 - Klients */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  savedLead.status === 'lead'
                    ? 'bg-green-500 text-white'
                    : 'bg-orange-500 text-white ring-4 ring-orange-100'
                }`}>
                  {savedLead.status === 'lead' ? <CheckCircle className="w-6 h-6" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <p className={`text-sm font-medium mt-2 ${savedLead.status === 'lead' ? 'text-green-600' : 'text-orange-600'}`}>
                  Klients
                </p>
                <p className="text-xs text-gray-500">{savedLead.status === 'lead' ? 'Saglabāts' : 'Aktīvs'}</p>
              </div>

              {/* Connector */}
              <div className={`flex-1 h-1 mx-2 -mt-6 ${savedLead.status === 'lead' ? 'bg-green-500' : 'bg-gray-200'}`}></div>

              {/* Step 3 - Agreement/Queue */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  savedLead.status === 'lead'
                    ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <p className={`text-sm font-medium mt-2 ${savedLead.status === 'lead' ? 'text-orange-600' : 'text-gray-400'}`}>
                  Līgums/Rinda
                </p>
                <p className={`text-xs ${savedLead.status === 'lead' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {savedLead.status === 'lead' ? 'Gaida' : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {savedLead.firstName[0]}{savedLead.lastName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">{savedLead.firstName} {savedLead.lastName}</p>
                <p className="text-sm text-gray-500">{savedLead.email} • {savedLead.phone}</p>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Konsultācijas rezultāti</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
                <span>Adoro Melodija</span>
              </div>
            </div>

            {/* Care Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Aprūpes līmenis</label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setConsultation({ ...consultation, careLevel: level.toString() })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      consultation.careLevel === level.toString()
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`text-lg font-bold ${consultation.careLevel === level.toString() ? 'text-orange-500' : 'text-gray-700'}`}>
                      {level}. līmenis
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Uzturēšanās ilgums</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultation({ ...consultation, duration: 'long' })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    consultation.duration === 'long'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Calendar className={`w-5 h-5 mb-1 ${consultation.duration === 'long' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div className="font-medium text-gray-900">Ilglaicīga</div>
                  <div className="text-xs text-gray-500">Ilgāk par 3 mēnešiem</div>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultation({ ...consultation, duration: 'short' })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    consultation.duration === 'short'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Clock className={`w-5 h-5 mb-1 ${consultation.duration === 'short' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div className="font-medium text-gray-900">Īslaicīga</div>
                  <div className="text-xs text-gray-500">Līdz 3 mēnešiem</div>
                </button>
              </div>
            </div>

            {/* Room Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Istabas veids</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultation({ ...consultation, roomType: 'single' })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    consultation.roomType === 'single'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Bed className={`w-5 h-5 mb-1 ${consultation.roomType === 'single' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div className="font-medium text-gray-900">Vienvietīga istaba</div>
                  <div className="text-xs text-gray-500">Privāta istaba</div>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultation({ ...consultation, roomType: 'double' })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    consultation.roomType === 'double'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className={`w-5 h-5 mb-1 ${consultation.roomType === 'double' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div className="font-medium text-gray-900">Divvietīga istaba</div>
                  <div className="text-xs text-gray-500">Dalīta istaba</div>
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Iekšējās piezīmes
              </label>
              <textarea
                value={consultation.notes}
                onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={3}
                placeholder="Piem., diabēts, nepieciešama palīdzība pārvietojoties, alerģijas, īpašas vēlmes..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Pierakstiet svarīgu informāciju no sarunas, kas nav iekļauta augstāk.
              </p>
            </div>

            {/* Calculated Price */}
            {price && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Aprēķinātā cena</p>
                    <p className="text-xs text-green-600 mt-1">
                      {consultation.careLevel}. līmenis •
                      {consultation.duration === 'long' ? ' Ilglaicīga' : ' Īslaicīga'} •
                      {consultation.roomType === 'single' ? ' Vienvietīga' : ' Divvietīga'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-700">{price} €</p>
                    <p className="text-xs text-green-600">dienā</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save as Klients Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={saveAsLead}
                disabled={!allSelected}
                className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  allSelected
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Saglabāt kā Klientu
              </button>
            </div>
          </div>
        </div>
      </div>
  ) : null;

  // Step 4: Waiting for Decision
  const WaitingForDecision = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('consultation')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Atpakaļ
            </button>
            <button
              onClick={() => setCurrentStep('list')}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <Users className="w-4 h-4" />
              Visi pieteikumi
            </button>
          </div>

          {/* Progress Bar - Hidden on mobile */}
          <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {/* Step 1 - Pieteikums (Completed) */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-green-600 mt-2">Pieteikums</p>
                <p className="text-xs text-gray-500">Saglabāts</p>
              </div>

              <div className="flex-1 h-1 bg-green-500 mx-2 -mt-6"></div>

              {/* Step 2 - Klients (Completed) */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-green-600 mt-2">Klients</p>
                <p className="text-xs text-gray-500">Saglabāts</p>
              </div>

              <div className="flex-1 h-1 bg-green-500 mx-2 -mt-6"></div>

              {/* Step 3 - Waiting (Current) */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white ring-4 ring-orange-100">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-orange-600 mt-2">Lēmums</p>
                <p className="text-xs text-gray-500">Gaida</p>
              </div>
            </div>
          </div>

          {/* Client Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                {savedLead.firstName[0]}{savedLead.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {savedLead.firstName} {savedLead.lastName}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium mt-1">
                  <CheckCircle className="w-3 h-3" />
                  Klients
                </span>
              </div>
            </div>

            <div className="py-4 space-y-2">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{savedLead.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{savedLead.phone}</span>
              </div>
            </div>

            {savedLead.comment && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Komentārs</p>
                <p className="text-gray-700 italic">"{savedLead.comment}"</p>
              </div>
            )}
          </div>

          {/* Consultation Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Konsultācijas rezultāti</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
                <span>Adoro Melodija</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg flex sm:flex-col sm:text-center items-center sm:items-center gap-3 sm:gap-0">
                <Heart className="w-5 h-5 text-orange-500 sm:mx-auto sm:mb-1" />
                <div className="flex-1 sm:flex-none">
                  <p className="text-xs text-gray-500 sm:mb-1">Aprūpes līmenis</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{savedLead.consultation?.careLevel}. līmenis</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex sm:flex-col sm:text-center items-center sm:items-center gap-3 sm:gap-0">
                <Calendar className="w-5 h-5 text-orange-500 sm:mx-auto sm:mb-1" />
                <div className="flex-1 sm:flex-none">
                  <p className="text-xs text-gray-500 sm:mb-1">Uzturēšanās</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {savedLead.consultation?.duration === 'long' ? 'Ilglaicīga' : 'Īslaicīga'}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex sm:flex-col sm:text-center items-center sm:items-center gap-3 sm:gap-0">
                <Bed className="w-5 h-5 text-orange-500 sm:mx-auto sm:mb-1" />
                <div className="flex-1 sm:flex-none">
                  <p className="text-xs text-gray-500 sm:mb-1">Istabas veids</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {savedLead.consultation?.roomType === 'single' ? 'Vienvietīga' : 'Divvietīga'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-700 font-medium">Aprēķinātā cena</p>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">{savedLead.consultation?.price} €</p>
                  <p className="text-xs text-green-600">dienā</p>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            {savedLead.consultation?.notes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 font-medium">Iekšējās piezīmes</p>
                <p className="text-sm text-gray-700">{savedLead.consultation.notes}</p>
              </div>
            )}
          </div>

          {/* Info Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <p className="font-medium mb-1">Gaida klienta lēmumu</p>
              <p className="text-yellow-700">
                Klients ir iepazīstināts ar cenām un iespējām. Kad klients pieņem lēmumu, izvēlieties atbilstošo darbību.
              </p>
            </div>
          </div>

          {/* Decision Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Option 1: Create Agreement */}
            <button
              onClick={() => setCurrentStep('agreement')}
              className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-green-500 hover:shadow-md p-5 text-left transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Izveidot līgumu</h3>
                  <p className="text-xs text-gray-500">Klients gatavs sākt</p>
                </div>
              </div>
              <div className="flex items-center justify-end text-sm text-green-600 font-medium">
                Turpināt <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option 2: Add to Queue */}
            <button
              onClick={() => setCurrentStep('queue')}
              className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-blue-500 hover:shadow-md p-5 text-left transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pievienot rindai</h3>
                  <p className="text-xs text-gray-500">Nav brīvu vietu</p>
                </div>
              </div>
              <div className="flex items-center justify-end text-sm text-blue-600 font-medium">
                Turpināt <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 5a: Agreement Created Success
  const AgreementSuccess = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentStep('waiting')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ
          </button>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Līgums izveidots!</h2>
                  <p className="text-green-100 mt-1 text-sm sm:text-base">Process veiksmīgi uzsākts</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Jauns līgums</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Līguma numurs</span>
                    <span className="font-mono font-semibold text-gray-900">048/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rezidents</span>
                    <span className="font-medium text-gray-900">{savedLead.firstName} {savedLead.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
                      Gaida parakstu
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Izveidots</span>
                    <span className="font-medium text-gray-900">{new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Nākamie soļi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Līguma dokuments ģenerēts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Nosūtīt līgumu klientam parakstīšanai</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Rezervēt gultas vietu</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Pēc parakstīšanas - aktivizēt līgumu</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => setCurrentStep('list')}
                  className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Skatīt visus pieteikumus
                </button>
                <button
                  onClick={() => {
                    setCurrentStep('form');
                    setLeadData({ firstName: '', lastName: '', email: '', phone: '', comment: '' });
                    setSavedLead(null);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Pievienot jaunu klientu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 5b: Added to Queue Success
  const QueueSuccess = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentStep('waiting')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ
          </button>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <ListChecks className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Pievienots rindai!</h2>
                  <p className="text-blue-100 mt-1 text-sm sm:text-base">Klients tiks informēts, kad vieta kļūst pieejama</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gaidīšanas saraksts</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Klients</span>
                    <span className="font-medium text-gray-900">{savedLead.firstName} {savedLead.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pozīcija rindā</span>
                    <span className="font-mono font-semibold text-blue-600">#7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      Gaidīšanas rindā
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pievienots</span>
                    <span className="font-medium text-gray-900">{new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Current Queue Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Pašreizējā situācija</p>
                    <p className="text-blue-700">
                      Abās rezidencēs pašlaik ir pilns aizpildījums. Vidējais gaidīšanas laiks ir 2-4 mēneši.
                      Klients tiks informēts, tiklīdz vieta kļūst pieejama.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Nākamie soļi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Klients pievienots gaidīšanas rindai</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Uzturēt regulāru kontaktu ar klientu</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Informēt, kad vieta kļūst pieejama</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Pēc apstiprinājuma - izveidot līgumu</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => setCurrentStep('list')}
                  className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Skatīt visus pieteikumus
                </button>
                <button
                  onClick={() => {
                    setCurrentStep('form');
                    setLeadData({ firstName: '', lastName: '', email: '', phone: '', comment: '' });
                    setSavedLead(null);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Pievienot jaunu klientu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // All Leads List View
  const AllLeadsView = () => {
    // Sample data for demonstration
    const sampleLeads = [
      {
        id: 'L-2025-001',
        firstName: 'Mārtiņš',
        lastName: 'Ozols',
        email: 'martins.ozols@inbox.lv',
        phone: '+371 29111222',
        status: 'agreement',
        createdDate: '2025-12-15',
        careLevel: 3,
        price: 77
      },
      {
        id: 'L-2025-002',
        firstName: 'Līga',
        lastName: 'Kalniņa',
        email: 'liga.k@gmail.com',
        phone: '+371 26333444',
        status: 'queue',
        createdDate: '2025-12-16',
        careLevel: 2,
        price: 70
      },
      {
        id: 'L-2025-003',
        firstName: 'Jānis',
        lastName: 'Bērziņš',
        email: 'janis.b@outlook.com',
        phone: '+371 22555666',
        status: 'lead',
        createdDate: '2025-12-17',
        careLevel: 1,
        price: 65
      },
      {
        id: 'L-2025-004',
        firstName: 'Anna',
        lastName: 'Liepiņa',
        email: 'anna.l@inbox.lv',
        phone: '+371 28777888',
        status: 'prospect',
        createdDate: '2025-12-18',
        careLevel: null,
        price: null
      },
      // Add the current lead if exists
      ...(savedLead ? [{
        ...savedLead,
        careLevel: savedLead.consultation?.careLevel || null,
        price: savedLead.consultation?.price || null
      }] : [])
    ];

    const getStatusBadge = (status) => {
      switch (status) {
        case 'prospect':
          return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Pieteikums</span>;
        case 'lead':
          return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Klients</span>;
        case 'agreement':
          return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Līgums</span>;
        case 'queue':
          return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Rindā</span>;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visi pieteikumi un klienti</h1>
                <p className="text-sm text-gray-600">{sampleLeads.length} ieraksti</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentStep('form');
                setLeadData({ firstName: '', lastName: '', email: '', phone: '', comment: '' });
                setSavedLead(null);
                setConsultation({ facility: 'melodija', careLevel: '', duration: '', roomType: '', notes: '' });
              }}
              className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Jauns pieteikums
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{sampleLeads.filter(l => l.status === 'prospect').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Pieteikumi</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{sampleLeads.filter(l => l.status === 'lead').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Klienti</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{sampleLeads.filter(l => l.status === 'agreement').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Līgumi</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{sampleLeads.filter(l => l.status === 'queue').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Rindā</p>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {sampleLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSavedLead({
                    ...lead,
                    assignedTo: lead.assignedTo || 'Kristens Blūms',
                    createdTime: lead.createdTime || '10:00',
                    consultation: lead.careLevel ? {
                      facility: 'melodija',
                      careLevel: lead.careLevel.toString(),
                      duration: 'long',
                      roomType: 'single',
                      price: lead.price
                    } : null
                  });
                  if (lead.status === 'prospect') {
                    setCurrentStep('lead-view');
                  } else if (lead.status === 'lead') {
                    setCurrentStep('waiting');
                  } else if (lead.status === 'agreement') {
                    setCurrentStep('agreement');
                  } else if (lead.status === 'queue') {
                    setCurrentStep('queue');
                  }
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                      <p className="text-xs text-gray-500">{lead.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(lead.status)}
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">{lead.email}</p>
                  <p className="text-gray-600">{lead.phone}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">{lead.createdDate}</span>
                  <div className="flex items-center gap-3">
                    {lead.careLevel && <span className="text-gray-700">{lead.careLevel}. līm.</span>}
                    {lead.price && <span className="font-medium text-green-600">{lead.price} €/d</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Klients</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kontakti</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aprūpe</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Cena</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Datums</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sampleLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSavedLead({
                          ...lead,
                          assignedTo: lead.assignedTo || 'Kristens Blūms',
                          createdTime: lead.createdTime || '10:00',
                          consultation: lead.careLevel ? {
                            facility: 'melodija',
                            careLevel: lead.careLevel.toString(),
                            duration: 'long',
                            roomType: 'single',
                            price: lead.price
                          } : null
                        });
                        if (lead.status === 'prospect') {
                          setCurrentStep('lead-view');
                        } else if (lead.status === 'lead') {
                          setCurrentStep('waiting');
                        } else if (lead.status === 'agreement') {
                          setCurrentStep('agreement');
                        } else if (lead.status === 'queue') {
                          setCurrentStep('queue');
                        }
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {lead.firstName[0]}{lead.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                            <p className="text-xs text-gray-500">{lead.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{lead.email}</p>
                        <p className="text-xs text-gray-500">{lead.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="px-4 py-3">
                        {lead.careLevel ? (
                          <span className="text-sm text-gray-700">{lead.careLevel}. līmenis</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lead.price ? (
                          <span className="text-sm font-medium text-gray-900">{lead.price} €/d</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{lead.createdDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current step
  return (
    <div>
      {currentStep === 'form' && newLeadForm}
      {currentStep === 'lead-view' && <LeadDetailsView />}
      {currentStep === 'consultation' && consultationOutcome}
      {currentStep === 'waiting' && <WaitingForDecision />}
      {currentStep === 'agreement' && <AgreementSuccess />}
      {currentStep === 'queue' && <QueueSuccess />}
      {currentStep === 'list' && <AllLeadsView />}

      {/* Administrator Role Badge */}
      <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 bg-red-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg font-bold flex items-center gap-1 sm:gap-2 z-50 text-xs sm:text-base">
        <User className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Admin</span>
      </div>
    </div>
  );
};

export default ClientIntakePrototype;
