import React, { useState } from 'react';
import { User } from 'lucide-react';

// Domain logic
import { calculatePrice } from './domain/pricing';
import { validateLeadForm, isValidForm } from './domain/validation';
import { createProspect, upgradeToLead } from './domain/leadHelpers';

// Constants
import { STEPS, STATUS } from './constants/steps';

// Hooks
import { usePersistedLeads } from './hooks/useLocalStorage';

// Views
import NewLeadForm from './views/NewLeadForm';
import LeadDetailsView from './views/LeadDetailsView';
import ConsultationStep from './views/ConsultationStep';
import WaitingForDecision from './views/WaitingForDecision';
import AgreementSuccess from './views/AgreementSuccess';
import QueueSuccess from './views/QueueSuccess';
import AllLeadsView from './views/AllLeadsView';

const ClientIntakePrototype = () => {
  // Persisted leads management
  const { leads, addLead, updateLead } = usePersistedLeads();

  // State management
  const [currentStep, setCurrentStep] = useState(STEPS.LIST);
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
    } else if (lead.status === STATUS.LEAD) {
      setCurrentStep(STEPS.WAITING);
    } else if (lead.status === STATUS.AGREEMENT) {
      setCurrentStep(STEPS.AGREEMENT);
    } else if (lead.status === STATUS.QUEUE) {
      setCurrentStep(STEPS.QUEUE);
    }
  };

  // Calculate price and check if all fields selected
  const price = calculatePrice(consultation);
  const allSelected = consultation.facility && consultation.careLevel && consultation.duration && consultation.roomType;

  // Render current step
  return (
    <div>
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
          onCreateAgreement={() => setCurrentStep(STEPS.AGREEMENT)}
          onAddToQueue={() => setCurrentStep(STEPS.QUEUE)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onUpdateConsultation={handleUpdateConsultation}
        />
      )}

      {currentStep === STEPS.AGREEMENT && savedLead && (
        <AgreementSuccess
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.WAITING)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
        />
      )}

      {currentStep === STEPS.QUEUE && savedLead && (
        <QueueSuccess
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.WAITING)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
        />
      )}

      {currentStep === STEPS.LIST && (
        <AllLeadsView
          allLeads={leads}
          onAddNew={handleAddNew}
          onSelectLead={handleSelectLead}
        />
      )}

      {/* Administrator Role Badge */}
      <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 bg-red-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg font-bold flex items-center gap-1 sm:gap-2 z-50 text-xs sm:text-base">
        <User className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Admin</span>
      </div>
    </div>
  );
};

export default ClientIntakePrototype;
