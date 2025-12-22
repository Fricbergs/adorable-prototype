import React, { useState } from 'react';

// Domain logic
import { calculatePrice } from './domain/pricing';
import { validateLeadForm, isValidForm } from './domain/validation';
import { createProspect, upgradeToLead, generateAgreementNumber } from './domain/leadHelpers';

// Constants
import { STEPS, STATUS } from './constants/steps';

// Hooks
import { usePersistedLeads } from './hooks/useLocalStorage';

// Components
import Header from './components/Header';

// Views
import NewLeadForm from './views/NewLeadForm';
import LeadDetailsView from './views/LeadDetailsView';
import ConsultationStep from './views/ConsultationStep';
import WaitingForDecision from './views/WaitingForDecision';
import SurveyView from './views/SurveyView';
import OfferCustomerView from './views/OfferCustomerView';
import OfferReviewView from './views/OfferReviewView';
import AgreementSuccess from './views/AgreementSuccess';
import QueueSuccess from './views/QueueSuccess';
import AllLeadsView from './views/AllLeadsView';

const ClientIntakePrototype = () => {
  // Persisted leads management
  const { leads, addLead, updateLead } = usePersistedLeads();

  // State management
  const [currentStep, setCurrentStep] = useState(STEPS.LIST);
  const [filterView, setFilterView] = useState('all-leads'); // 'all-leads' or 'queue'
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
    facility: 'melodija',
    careLevel: '',
    duration: '',
    roomType: '',
    notes: '',
    contactSource: 'resident',
    hasDementia: false
  });

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLeadForm(leadData);
    setErrors(validationErrors);

    if (isValidForm(validationErrors)) {
      const newProspect = createProspect(leadData);
      setSavedLead(newProspect);
      addLead(newProspect); // Persist to localStorage
      setCurrentStep(STEPS.LEAD_VIEW);
    }
  };

  // Save consultation and upgrade to lead
  const handleSaveAsLead = () => {
    const price = calculatePrice(consultation);
    const consultationWithPrice = { ...consultation, price };
    const lead = upgradeToLead(savedLead, consultationWithPrice);
    setSavedLead(lead);
    addLead(lead); // Update in localStorage
    setCurrentStep(STEPS.WAITING);
  };

  // Update lead contact information
  const handleUpdateLead = (updatedData) => {
    const updated = { ...savedLead, ...updatedData };
    setSavedLead(updated);
    updateLead(savedLead.id, updatedData); // Update in localStorage
  };

  // Update consultation information
  const handleUpdateConsultation = (updatedConsultation) => {
    const price = calculatePrice(updatedConsultation);
    const consultationWithPrice = { ...updatedConsultation, price };
    const updated = { ...savedLead, consultation: consultationWithPrice };
    setSavedLead(updated);
    addLead(updated); // Update in localStorage
  };

  // Navigate to survey (admin fills survey data)
  const handleGoToSurvey = () => {
    setCurrentStep(STEPS.SURVEY);
  };

  // Submit survey data (changes status to survey_filled, navigates to review)
  const handleSubmitSurvey = (surveyData) => {
    const updated = {
      ...savedLead,
      status: STATUS.SURVEY_FILLED,
      survey: surveyData
    };
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.OFFER_REVIEW);
  };

  // Customer submits offer form (saves offer data, changes status to survey_filled)
  // NOTE: This is for future customer email workflow - currently admin fills survey directly
  const handleSubmitOffer = (offerData) => {
    const updated = {
      ...savedLead,
      status: STATUS.SURVEY_FILLED,
      offer: offerData
    };
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.OFFER_REVIEW);
  };

  // Admin creates agreement (generates agreement number, changes status to agreement)
  const handleCreateAgreement = () => {
    const agreementNumber = generateAgreementNumber();
    const updated = {
      ...savedLead,
      status: STATUS.AGREEMENT,
      agreementNumber
    };
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.AGREEMENT);
  };

  // Admin adds to queue from offer review
  const handleAddToQueueFromOffer = () => {
    const updated = { ...savedLead, status: STATUS.QUEUE };
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.QUEUE);
  };

  // Reset to add new lead
  const handleAddNew = () => {
    setCurrentStep(STEPS.FORM);
    setLeadData({ firstName: '', lastName: '', email: '', phone: '', comment: '' });
    setSavedLead(null);
    setConsultation({
      facility: 'melodija',
      careLevel: '',
      duration: '',
      roomType: '',
      notes: '',
      contactSource: 'resident',
      hasDementia: false
    });
    setErrors({});
  };

  // Handle lead selection from list
  const handleSelectLead = (lead) => {
    setSavedLead({
      ...lead,
      assignedTo: lead.assignedTo || 'Kristens Blūms',
      createdTime: lead.createdTime || '10:00'
    });

    // Navigate to appropriate step based on status
    if (lead.status === STATUS.PROSPECT) {
      setCurrentStep(STEPS.LEAD_VIEW);
    } else if (lead.status === STATUS.OFFER_SENT) {
      setCurrentStep(STEPS.WAITING);
    } else if (lead.status === STATUS.SURVEY_FILLED) {
      setCurrentStep(STEPS.OFFER_REVIEW);
    } else if (lead.status === STATUS.AGREEMENT) {
      setCurrentStep(STEPS.AGREEMENT);
    } else if (lead.status === STATUS.QUEUE) {
      setCurrentStep(STEPS.QUEUE);
    }
  };

  // Handle navigation from header menu
  const handleNavigate = (view) => {
    setFilterView(view);
    setCurrentStep(STEPS.LIST);
  };

  // Calculate price and check if all fields selected
  const price = calculatePrice(consultation);
  const allSelected = consultation.facility && consultation.careLevel && consultation.duration && consultation.roomType;

  // Determine current view for header highlighting
  const currentView = currentStep === STEPS.LIST ? filterView : null;
  const isCustomerView = currentStep === STEPS.OFFER_CUSTOMER;

  // Render current step
  return (
    <div>
      {/* Header Menu - shown on all views */}
      <Header onNavigate={handleNavigate} currentView={currentView} isCustomerView={isCustomerView} />

      {currentStep === STEPS.FORM && (
        <NewLeadForm
          leadData={leadData}
          errors={errors}
          onChange={setLeadData}
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(STEPS.LIST)}
        />
      )}

      {currentStep === STEPS.LEAD_VIEW && savedLead && (
        <LeadDetailsView
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.LIST)}
          onStartConsultation={() => setCurrentStep(STEPS.CONSULTATION)}
          onUpdate={handleUpdateLead}
        />
      )}

      {currentStep === STEPS.CONSULTATION && savedLead && (
        <ConsultationStep
          savedLead={savedLead}
          consultation={consultation}
          price={price}
          allSelected={allSelected}
          onConsultationChange={setConsultation}
          onSave={handleSaveAsLead}
          onBack={() => setCurrentStep(STEPS.LEAD_VIEW)}
        />
      )}

      {currentStep === STEPS.WAITING && savedLead && (
        <WaitingForDecision
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.CONSULTATION)}
          onCreateAgreement={handleGoToSurvey}
          onAddToQueue={() => setCurrentStep(STEPS.QUEUE)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onUpdateConsultation={handleUpdateConsultation}
        />
      )}

      {currentStep === STEPS.SURVEY && savedLead && (
        <SurveyView
          savedLead={savedLead}
          onSubmit={handleSubmitSurvey}
          onBack={() => setCurrentStep(STEPS.WAITING)}
        />
      )}

      {currentStep === STEPS.OFFER_CUSTOMER && savedLead && (
        <OfferCustomerView
          savedLead={savedLead}
          onSubmit={handleSubmitOffer}
          onCancel={() => setCurrentStep(STEPS.WAITING)}
        />
      )}

      {currentStep === STEPS.OFFER_REVIEW && savedLead && (
        <OfferReviewView
          savedLead={savedLead}
          onCreateAgreement={handleCreateAgreement}
          onAddToQueue={handleAddToQueueFromOffer}
          onBack={() => setCurrentStep(STEPS.SURVEY)}
        />
      )}

      {currentStep === STEPS.AGREEMENT && savedLead && (
        <AgreementSuccess
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.OFFER_REVIEW)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
        />
      )}

      {currentStep === STEPS.QUEUE && savedLead && (
        <QueueSuccess
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.OFFER_REVIEW)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
        />
      )}

      {currentStep === STEPS.LIST && (
        <AllLeadsView
          allLeads={leads}
          onAddNew={handleAddNew}
          onSelectLead={handleSelectLead}
          filterView={filterView}
        />
      )}
    </div>
  );
};

export default ClientIntakePrototype;
