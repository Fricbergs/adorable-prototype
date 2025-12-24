import React, { useState } from 'react';

// Domain logic
import { calculatePrice } from './domain/pricing';
import { validateLeadForm, isValidForm } from './domain/validation';
import { createProspect, upgradeToLead, generateAgreementNumber, addToQueue, markQueueOfferSent, calculateQueuePosition } from './domain/leadHelpers';
import { getCurrentDate, getCurrentTime } from './domain/leadHelpers';

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
import QueueListView from './views/QueueListView';
import AllLeadsView from './views/AllLeadsView';

// Components
import QueueOfferModal from './components/QueueOfferModal';

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
    careLevel: '',
    duration: '',
    roomType: '',
    notes: '',
    hasDementia: false,
    fillScenario: 'in-person'
  });
  const [showQueueOfferModal, setShowQueueOfferModal] = useState(false);
  const [queueOfferLead, setQueueOfferLead] = useState(null);

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

    // Conditional routing based on fill scenario
    if (consultation.fillScenario === 'in-person') {
      setCurrentStep(STEPS.SURVEY); // Admin fills survey immediately
    } else {
      setCurrentStep(STEPS.WAITING); // Wait for customer to fill remotely
    }
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
    const consultationWithPrice = { ...savedLead.consultation, ...updatedConsultation, price };
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
    const updated = addToQueue(savedLead);
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.QUEUE);
  };

  // Admin adds to queue from waiting view (after consultation)
  const handleAddToQueueFromWaiting = () => {
    const updated = addToQueue(savedLead);
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.QUEUE);
  };

  // Send offer to someone in queue (bed available)
  const handleSendQueueOffer = (lead) => {
    setQueueOfferLead(lead);
    setShowQueueOfferModal(true);
  };

  // Confirm queue offer sent
  const handleConfirmQueueOfferSent = (lead) => {
    const updated = markQueueOfferSent(lead);
    addLead(updated);
    setShowQueueOfferModal(false);
    setQueueOfferLead(null);
  };

  // Accept from queue - create agreement
  const handleAcceptFromQueue = (lead) => {
    const agreementNumber = generateAgreementNumber();
    const updated = {
      ...lead,
      status: STATUS.AGREEMENT,
      agreementNumber,
      acceptedFromQueueDate: getCurrentDate(),
      acceptedFromQueueTime: getCurrentTime()
    };
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.AGREEMENT);
  };

  // Cancel a lead from queue list
  const handleCancelFromQueueList = (leadId, cancellationData) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const updated = {
        ...lead,
        status: STATUS.CANCELLED,
        cancellation: cancellationData
      };
      addLead(updated);
    }
  };

  // View lead details from queue list
  const handleViewLeadFromQueue = (lead) => {
    setSavedLead(lead);
    setCurrentStep(STEPS.QUEUE);
  };

  // Handle email sent
  const handleEmailSent = () => {
    const updated = {
      ...savedLead,
      emailSent: true,
      emailSentDate: getCurrentDate(),
      emailSentTime: getCurrentTime()
    };
    setSavedLead(updated);
    addLead(updated);
  };

  // Handle lead cancellation
  const handleCancelLead = (cancellationData) => {
    const updated = {
      ...savedLead,
      status: STATUS.CANCELLED,
      cancellation: cancellationData
    };
    setSavedLead(updated);
    addLead(updated);
    setCurrentStep(STEPS.LIST);
  };

  // Reset to add new lead
  const handleAddNew = () => {
    setCurrentStep(STEPS.FORM);
    setLeadData({ firstName: '', lastName: '', email: '', phone: '', comment: '' });
    setSavedLead(null);
    setConsultation({
      careLevel: '',
      duration: '',
      roomType: '',
      notes: '',
      hasDementia: false,
      fillScenario: 'in-person'
    });
    setErrors({});
  };

  // Handle lead selection from list
  const handleSelectLead = (lead) => {
    // Prevent navigation to cancelled leads - they are read-only
    if (lead.status === STATUS.CANCELLED) {
      return;
    }

    setSavedLead({
      ...lead,
      assignedTo: lead.assignedTo || 'Kristens Blūms',
      createdTime: lead.createdTime || '10:00'
    });

    // Navigate to appropriate step based on status (treat missing status as PROSPECT)
    const status = lead.status || STATUS.PROSPECT;

    if (status === STATUS.PROSPECT) {
      setCurrentStep(STEPS.LEAD_VIEW);
    } else if (status === STATUS.CONSULTATION) {
      setCurrentStep(STEPS.WAITING);
    } else if (status === STATUS.SURVEY_FILLED) {
      setCurrentStep(STEPS.OFFER_REVIEW);
    } else if (status === STATUS.AGREEMENT) {
      setCurrentStep(STEPS.AGREEMENT);
    } else if (status === STATUS.QUEUE) {
      setCurrentStep(STEPS.QUEUE);
    }
  };

  // Handle navigation from header menu
  const handleNavigate = (view) => {
    setFilterView(view);
    if (view === 'queue') {
      setCurrentStep(STEPS.QUEUE_LIST);
    } else {
      setCurrentStep(STEPS.LIST);
    }
  };

  // Calculate price and check if all fields selected
  const price = calculatePrice(consultation);
  const allSelected = consultation.careLevel && consultation.duration && consultation.roomType;

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
          onCancelLead={handleCancelLead}
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
          onAddToQueue={handleAddToQueueFromWaiting}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onUpdateConsultation={handleUpdateConsultation}
          onEmailSent={handleEmailSent}
          onCancelLead={handleCancelLead}
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
          onEmailSent={handleEmailSent}
          onCancelLead={handleCancelLead}
        />
      )}

      {currentStep === STEPS.AGREEMENT && savedLead && (
        <AgreementSuccess
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.OFFER_REVIEW)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
          onCancelLead={handleCancelLead}
        />
      )}

      {currentStep === STEPS.QUEUE && savedLead && (
        <QueueSuccess
          savedLead={savedLead}
          allLeads={leads}
          onBack={() => setCurrentStep(STEPS.OFFER_REVIEW)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
          onCancelLead={handleCancelLead}
        />
      )}

      {currentStep === STEPS.QUEUE_LIST && (
        <QueueListView
          allLeads={leads}
          onSendOffer={handleSendQueueOffer}
          onAcceptFromQueue={handleAcceptFromQueue}
          onViewLead={handleViewLeadFromQueue}
          onCancelLead={handleCancelFromQueueList}
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

      {/* Queue Offer Modal */}
      {showQueueOfferModal && queueOfferLead && (
        <QueueOfferModal
          lead={queueOfferLead}
          queuePosition={calculateQueuePosition(queueOfferLead, leads)}
          onClose={() => {
            setShowQueueOfferModal(false);
            setQueueOfferLead(null);
          }}
          onSend={handleConfirmQueueOfferSent}
        />
      )}
    </div>
  );
};

export default ClientIntakePrototype;
