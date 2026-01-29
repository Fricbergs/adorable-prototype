import React, { useState } from 'react';

// Domain logic
import { calculatePrice } from './domain/pricing';
import { validateLeadForm, isValidForm } from './domain/validation';
import { createProspect, upgradeToLead, generateAgreementNumber, addToQueue, markQueueOfferSent, calculateQueuePosition } from './domain/leadHelpers';
import { getCurrentDate, getCurrentTime } from './domain/leadHelpers';
import { getResidentById, createResidentFromLead, getResidentByLeadId } from './domain/residentHelpers';

// Constants
import { STEPS, STATUS } from './constants/steps';

// Hooks
import { usePersistedLeads } from './hooks/useLocalStorage';
import { useContracts } from './hooks/useContracts';

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

// Resident Views
import ResidentListView from './views/ResidentListView';
import ResidentReportsView from './views/ResidentReportsView';
import PrescriptionPrintView from './views/PrescriptionPrintView';

// Inventory (Noliktava) Views
import InventoryDashboardView from './views/InventoryDashboardView';
import ResidentInventoryView from './views/ResidentInventoryView';
import InventoryCostReportsView from './views/InventoryCostReportsView';

// Room Management Views
import RoomManagementView from './views/RoomManagementView';
import BedFundView from './views/BedFundView';
import BedBookingView from './views/BedBookingView';

// Contract Views
import ContractCreateView from './views/ContractCreateView';
import ContractListView from './views/ContractListView';
import ContractPrintView from './views/ContractPrintView';

// Resident Profile View
import ResidentProfileView from './views/ResidentProfileView';

// Settings View
import SettingsView from './views/SettingsView';
import ImportHistoryView from './views/ImportHistoryView';

// Group Activities View
import GroupActivitiesView from './views/GroupActivitiesView';

// Supplier Views
import SupplierListView from './views/SupplierListView';
import SupplierCatalogView from './views/SupplierCatalogView';

// Demo Data Initialization
import { initializeDemoData } from './domain/initializeDemoData';

// Demo Tour
import DemoTour from './components/inventory/DemoTour';

// Components
import QueueOfferModal from './components/QueueOfferModal';

// Initialize demo data on app load
initializeDemoData();

const ClientIntakePrototype = () => {
  // Persisted leads management
  const { leads, addLead, updateLead } = usePersistedLeads();

  // Contracts management
  const { saveContract } = useContracts();

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

  // Resident state (unified)
  const [selectedResident, setSelectedResident] = useState(null);

  // Inventory (Noliktava) state
  const [selectedInventoryResident, setSelectedInventoryResident] = useState(null);
  const [selectedBulkItemForTransfer, setSelectedBulkItemForTransfer] = useState(null);

  // Contract state
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractFromLead, setContractFromLead] = useState(null);
  const [contractSelectedRoom, setContractSelectedRoom] = useState(null);
  const [contractSelectedBed, setContractSelectedBed] = useState(null);
  const [isSelectingRoomForContract, setIsSelectingRoomForContract] = useState(false);
  const [contractFormState, setContractFormState] = useState(null); // Preserve form state during bed selection

  // Demo tour state
  const [demoTourActive, setDemoTourActive] = useState(false);
  const [demoTourStep, setDemoTourStep] = useState(0);

  // Demo tour control functions
  const handleStartDemo = () => {
    setDemoTourActive(true);
    setDemoTourStep(0);
  };

  const handleDemoNext = () => {
    // Steps 0-4 are active steps; setting to 5 triggers completion card
    setDemoTourStep(prev => prev + 1);
  };

  const handleDemoPrev = () => {
    setDemoTourStep(prev => Math.max(0, prev - 1));
  };

  const handleDemoClose = () => {
    setDemoTourActive(false);
    setDemoTourStep(0);
  };

  // Demo tour navigation: accepts STEPS constant values and calls setCurrentStep directly
  const handleDemoNavigate = (stepValue) => {
    setCurrentStep(stepValue);
  };

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

  // Admin creates agreement (navigates to contract creation)
  const handleCreateAgreement = () => {
    // Navigate to contract creation with lead data
    setContractFromLead(savedLead);
    setSelectedContract(null);
    setCurrentStep(STEPS.CONTRACT_CREATE);
  };

  // Legacy: Generate simple agreement (for backward compatibility)
  const handleCreateSimpleAgreement = () => {
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

  // Accept from queue - go to contract creation
  const handleAcceptFromQueue = (lead) => {
    // Update lead with acceptance info
    const updated = {
      ...lead,
      acceptedFromQueueDate: getCurrentDate(),
      acceptedFromQueueTime: getCurrentTime()
    };
    setSavedLead(updated);
    addLead(updated);

    // Navigate to contract creation with lead data
    setContractFromLead(updated);
    setSelectedContract(null);
    setCurrentStep(STEPS.CONTRACT_CREATE);
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

  // Handle update survey data and create agreement (from MissingDataModal)
  const handleUpdateSurveyAndCreateAgreement = (surveyUpdates) => {
    const updatedSurvey = { ...savedLead.survey, ...surveyUpdates };
    const updated = { ...savedLead, survey: updatedSurvey };
    setSavedLead(updated);
    addLead(updated);
    // Now create the agreement
    const agreementNumber = generateAgreementNumber();
    const finalUpdate = {
      ...updated,
      status: STATUS.AGREEMENT,
      agreementNumber
    };
    setSavedLead(finalUpdate);
    addLead(finalUpdate);
    setCurrentStep(STEPS.AGREEMENT);
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
    } else if (view === 'residents') {
      // Unified residents view
      setSelectedResident(null);
      setCurrentStep(STEPS.RESIDENT_LIST);
    } else if (view === 'resident-reports') {
      // Resident statistics reports (AD-79)
      setCurrentStep(STEPS.RESIDENT_REPORTS);
    } else if (view === 'room-management') {
      setCurrentStep(STEPS.ROOM_MANAGEMENT);
    } else if (view === 'bulk-inventory') {
      setCurrentStep(STEPS.INVENTORY_DASHBOARD);
    } else if (view === 'resident-inventory') {
      setSelectedInventoryResident(null);
      setCurrentStep(STEPS.RESIDENT_INVENTORY_LIST);
    } else if (view === 'inventory-reports') {
      setCurrentStep(STEPS.INVENTORY_REPORTS);
    } else if (view === 'contracts') {
      setSelectedContract(null);
      setContractFromLead(null);
      setCurrentStep(STEPS.CONTRACT_LIST);
    } else if (view === 'settings') {
      setCurrentStep(STEPS.SETTINGS);
    } else if (view === 'import-history') {
      setCurrentStep(STEPS.IMPORT_HISTORY);
    } else if (view === 'group-activities') {
      setCurrentStep(STEPS.GROUP_ACTIVITIES);
    } else if (view === 'suppliers') {
      setCurrentStep(STEPS.SUPPLIER_LIST);
    } else if (view === 'catalogs') {
      setCurrentStep(STEPS.SUPPLIER_CATALOG);
    } else {
      setCurrentStep(STEPS.LIST);
    }
  };

  // Handle resident selection (unified)
  const handleSelectResident = (resident) => {
    setSelectedResident(resident);
    setCurrentStep(STEPS.RESIDENT_PROFILE);
  };

  // Handle print prescription view
  const handlePrintPrescriptions = () => {
    setCurrentStep(STEPS.PRESCRIPTION_PRINT);
  };

  // Calculate price and check if all fields selected
  const price = calculatePrice(consultation);
  const allSelected = consultation.careLevel && consultation.duration && consultation.roomType;

  // Determine current view for header highlighting
  const isResidentView = [STEPS.RESIDENT_LIST, STEPS.RESIDENT_PROFILE, STEPS.PRESCRIPTION_PRINT, STEPS.RESIDENT_REPORTS].includes(currentStep);
  const isInventoryView = [STEPS.INVENTORY_DASHBOARD, STEPS.RESIDENT_INVENTORY_LIST, STEPS.RESIDENT_INVENTORY, STEPS.INVENTORY_REPORTS, STEPS.SUPPLIER_LIST, STEPS.SUPPLIER_CATALOG].includes(currentStep);
  const isRoomView = currentStep === STEPS.ROOM_MANAGEMENT;
  const isQueueView = currentStep === STEPS.QUEUE_LIST;
  const isContractView = [STEPS.CONTRACT_LIST, STEPS.CONTRACT_CREATE, STEPS.CONTRACT_VIEW, STEPS.CONTRACT_PRINT].includes(currentStep);
  const isSettingsView = currentStep === STEPS.SETTINGS || currentStep === STEPS.IMPORT_HISTORY;
  const isGroupActivitiesView = currentStep === STEPS.GROUP_ACTIVITIES;
  const currentView = currentStep === STEPS.LIST ? filterView :
    (currentStep === STEPS.SETTINGS || currentStep === STEPS.IMPORT_HISTORY) ? 'settings' :
    currentStep === STEPS.GROUP_ACTIVITIES ? 'group-activities' :
    currentStep === STEPS.SUPPLIER_LIST ? 'suppliers' :
    currentStep === STEPS.SUPPLIER_CATALOG ? 'catalogs' :
    currentStep === STEPS.RESIDENT_REPORTS ? 'resident-reports' :
    isResidentView ? 'residents' :
    isRoomView ? 'room-management' :
    isQueueView ? 'queue' :
    isContractView ? 'contracts' :
    currentStep === STEPS.INVENTORY_DASHBOARD ? 'bulk-inventory' :
    (currentStep === STEPS.RESIDENT_INVENTORY_LIST || currentStep === STEPS.RESIDENT_INVENTORY) ? 'resident-inventory' :
    currentStep === STEPS.INVENTORY_REPORTS ? 'inventory-reports' : null;
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
          onUpdateSurveyAndCreateAgreement={handleUpdateSurveyAndCreateAgreement}
        />
      )}

      {currentStep === STEPS.AGREEMENT && savedLead && (
        <AgreementSuccess
          savedLead={savedLead}
          onBack={() => setCurrentStep(STEPS.OFFER_REVIEW)}
          onViewList={() => setCurrentStep(STEPS.LIST)}
          onAddNew={handleAddNew}
          onCancelLead={handleCancelLead}
          onBookBed={() => setCurrentStep(STEPS.BED_BOOKING)}
          onEditContract={() => {
            // Open contract creation with lead data
            setContractFromLead(savedLead);
            setSelectedContract(null);
            setCurrentStep(STEPS.CONTRACT_CREATE);
          }}
          onPrintContract={() => {
            // Create temporary contract object from lead for printing
            const tempContract = {
              id: savedLead.id,
              contractNumber: savedLead.agreementNumber || savedLead.contractId,
              status: 'aktīvs',
              residence: 'melodija', // Default, can be updated
              residentName: `${savedLead.firstName || ''} ${savedLead.lastName || ''}`.trim(),
              clientName: savedLead.survey?.signerScenario === 'resident'
                ? `${savedLead.firstName || ''} ${savedLead.lastName || ''}`.trim()
                : `${savedLead.survey?.clientFirstName || ''} ${savedLead.survey?.clientLastName || ''}`.trim(),
              residentIsClient: savedLead.survey?.signerScenario === 'resident',
              startDate: savedLead.survey?.stayDateFrom || new Date().toISOString().split('T')[0],
              endDate: savedLead.survey?.stayDateTo || null,
              noEndDate: !savedLead.survey?.stayDateTo,
              careLevel: savedLead.consultation?.careLevel ? `GIR${savedLead.consultation.careLevel}` : null,
              dailyRate: savedLead.consultation?.price || null,
              dailyRateWithDiscount: savedLead.consultation?.price || null,
              discountPercent: 0,
              createdAt: savedLead.createdDate,
              appendixes: []
            };
            setSelectedContract(tempContract);
            setCurrentStep(STEPS.CONTRACT_PRINT);
          }}
          onViewResident={(residentId) => {
            const resident = getResidentById(residentId);
            if (resident) {
              setSelectedResident(resident);
              setCurrentStep(STEPS.RESIDENT_PROFILE);
            }
          }}
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
          onCreateContract={() => {
            setContractFromLead(savedLead);
            setSelectedContract(null);
            setCurrentStep(STEPS.CONTRACT_CREATE);
          }}
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

      {/* Resident Views (unified) */}
      {currentStep === STEPS.RESIDENT_LIST && (
        <ResidentListView
          onSelectResident={handleSelectResident}
          onBack={() => setCurrentStep(STEPS.LIST)}
        />
      )}

      {currentStep === STEPS.RESIDENT_PROFILE && selectedResident && (
        <ResidentProfileView
          residentId={selectedResident.id}
          onBack={() => setCurrentStep(STEPS.RESIDENT_LIST)}
          onPrint={handlePrintPrescriptions}
        />
      )}

      {currentStep === STEPS.PRESCRIPTION_PRINT && selectedResident && (
        <PrescriptionPrintView
          resident={selectedResident}
          onBack={() => setCurrentStep(STEPS.RESIDENT_PROFILE)}
        />
      )}

      {/* Resident Reports (AD-79) */}
      {currentStep === STEPS.RESIDENT_REPORTS && (
        <ResidentReportsView
          onBack={() => setCurrentStep(STEPS.RESIDENT_LIST)}
        />
      )}

      {/* Inventory (Noliktava) Views */}
      {currentStep === STEPS.INVENTORY_DASHBOARD && (
        <InventoryDashboardView
          onNavigate={handleNavigate}
          onSelectResident={(bulkItem) => {
            // Store bulk item for transfer and navigate to resident selection
            setSelectedBulkItemForTransfer(bulkItem);
            setSelectedInventoryResident(null);
            setCurrentStep(STEPS.RESIDENT_INVENTORY_LIST);
          }}
        />
      )}

      {(currentStep === STEPS.RESIDENT_INVENTORY_LIST || currentStep === STEPS.RESIDENT_INVENTORY) && (
        <ResidentInventoryView
          selectedResident={selectedInventoryResident}
          preselectedBulkItem={selectedBulkItemForTransfer}
          onBack={() => {
            setSelectedBulkItemForTransfer(null);
            setCurrentStep(STEPS.INVENTORY_DASHBOARD);
          }}
          onNavigate={handleNavigate}
        />
      )}

      {currentStep === STEPS.INVENTORY_REPORTS && (
        <InventoryCostReportsView
          onBack={() => handleNavigate('bulk-inventory')}
        />
      )}

      {/* Bed Fund / Room Management View */}
      {currentStep === STEPS.ROOM_MANAGEMENT && (
        <BedFundView
          onBack={() => handleNavigate('all-leads')}
        />
      )}

      {/* Bed Booking View (during agreement flow - creates resident) */}
      {currentStep === STEPS.BED_BOOKING && savedLead && !isSelectingRoomForContract && (
        <BedBookingView
          lead={savedLead}
          onComplete={(resident) => {
            // Update lead with resident ID
            const updated = {
              ...savedLead,
              residentId: resident.id,
              bookedRoomId: resident.roomId,
              bookedBedNumber: resident.bedNumber
            };
            setSavedLead(updated);
            addLead(updated);
            // Navigate to agreement success
            setCurrentStep(STEPS.AGREEMENT);
          }}
          onBack={() => setCurrentStep(STEPS.AGREEMENT)}
        />
      )}

      {/* Bed Booking View (during contract creation - selection only) */}
      {currentStep === STEPS.BED_BOOKING && isSelectingRoomForContract && (
        <BedBookingView
          lead={contractFromLead || savedLead}
          selectionOnly={true}
          targetDate={contractFormState?.startDate}
          onSelectRoom={({ room, bedNumber }) => {
            // Store selection and return to contract
            setContractSelectedRoom(room);
            setContractSelectedBed(bedNumber);
            setIsSelectingRoomForContract(false);
            setCurrentStep(STEPS.CONTRACT_CREATE);
          }}
          onBack={() => {
            setIsSelectingRoomForContract(false);
            setCurrentStep(STEPS.CONTRACT_CREATE);
          }}
        />
      )}

      {/* Contract Views */}
      {currentStep === STEPS.CONTRACT_LIST && (
        <ContractListView
          onCreateNew={() => {
            setSelectedContract(null);
            setContractFromLead(null);
            setCurrentStep(STEPS.CONTRACT_CREATE);
          }}
          onViewContract={(contract) => {
            setSelectedContract(contract);
            setCurrentStep(STEPS.CONTRACT_PRINT);
          }}
          onEditContract={(contract) => {
            setSelectedContract(contract);
            setContractFromLead(null);
            setCurrentStep(STEPS.CONTRACT_CREATE);
          }}
          onPrintContract={(contract) => {
            setSelectedContract(contract);
            setCurrentStep(STEPS.CONTRACT_PRINT);
          }}
        />
      )}

      {currentStep === STEPS.CONTRACT_CREATE && (
        <ContractCreateView
          lead={contractFromLead}
          existingContract={selectedContract}
          initialRoom={contractSelectedRoom}
          initialBed={contractSelectedBed}
          initialFormState={contractFormState}
          onSave={(contract) => {
            // Draft saved, stay on edit
            setSelectedContract(contract);
          }}
          onSelectRoom={(formState) => {
            // Store form state and navigate to bed selection
            setContractFormState(formState);
            setIsSelectingRoomForContract(true);
            setCurrentStep(STEPS.BED_BOOKING);
          }}
          onBack={() => {
            if (contractFromLead) {
              // Coming from lead flow, go back to offer review
              setContractFromLead(null);
              setContractSelectedRoom(null);
              setContractSelectedBed(null);
              setContractFormState(null);
              setCurrentStep(STEPS.OFFER_REVIEW);
            } else {
              // Coming from contract list
              setSelectedContract(null);
              setContractSelectedRoom(null);
              setContractSelectedBed(null);
              setContractFormState(null);
              setCurrentStep(STEPS.CONTRACT_LIST);
            }
          }}
          onComplete={(contract) => {
            // Contract saved - navigate to print view
            setContractSelectedRoom(null);
            setContractSelectedBed(null);
            setContractFormState(null);
            setSelectedContract(contract);

            if (contractFromLead) {
              // Update lead with contract info (resident will be created later via move-in)
              const updated = {
                ...savedLead,
                status: STATUS.AGREEMENT,
                contractId: contract.id,
                agreementNumber: contract.contractNumber,
                bookedRoomId: contract.roomId,
                bookedBedNumber: contract.bedNumber,
                bookedRoomNumber: contract.roomNumber
              };
              setSavedLead(updated);
              addLead(updated);
              // Keep contractFromLead so print view knows the lead context
            }

            // Navigate to print view for signing and move-in
            setCurrentStep(STEPS.CONTRACT_PRINT);
          }}
        />
      )}

      {currentStep === STEPS.CONTRACT_PRINT && selectedContract && (
        <ContractPrintView
          contract={selectedContract}
          lead={contractFromLead}
          onBack={() => {
            // Check if we came from agreement success (has agreementNumber format)
            if (savedLead && (selectedContract.contractNumber === savedLead.agreementNumber || selectedContract.id === savedLead.id)) {
              setSelectedContract(null);
              setContractFromLead(null);
              setCurrentStep(STEPS.AGREEMENT);
            } else {
              setSelectedContract(null);
              setContractFromLead(null);
              setCurrentStep(STEPS.CONTRACT_LIST);
            }
          }}
          onMarkSigned={(contract) => {
            // Update contract with signing info
            const signedContract = {
              ...contract,
              signedAt: new Date().toISOString()
            };
            saveContract(signedContract);
            setSelectedContract(signedContract);
          }}
          onMoveIn={(contract, lead) => {
            // Create resident from lead/contract data
            if (contract.roomId && contract.bedNumber) {
              const leadId = lead?.id || contract.id;

              // Check if resident already exists for this lead
              const existingResident = getResidentByLeadId(leadId);

              if (existingResident) {
                // Resident already exists - just update contract to reflect this
                const updatedContract = {
                  ...contract,
                  residentCreatedAt: contract.residentCreatedAt || new Date().toISOString(),
                  createdResidentId: existingResident.id
                };
                saveContract(updatedContract);
                setSelectedContract(updatedContract);
                return;
              }

              try {
                // Build lead-like object for resident creation
                const leadForResident = {
                  id: leadId,
                  firstName: lead?.survey?.firstName || lead?.firstName || contract.residentName?.split(' ')[0],
                  lastName: lead?.survey?.lastName || lead?.lastName || contract.residentName?.split(' ').slice(1).join(' '),
                  phone: lead?.survey?.phone || lead?.phone || contract.residentPhone,
                  email: lead?.survey?.email || lead?.email || contract.residentEmail,
                  agreementNumber: contract.contractNumber,
                  birthDate: lead?.survey?.birthDate || contract.residentBirthDate,
                  personalCode: lead?.survey?.personalCode || contract.residentPersonalCode,
                  gender: lead?.survey?.gender || contract.residentGender,
                  street: lead?.survey?.street,
                  city: lead?.survey?.city,
                  postalCode: lead?.survey?.postalCode,
                  clientFirstName: lead?.survey?.clientFirstName,
                  clientLastName: lead?.survey?.clientLastName,
                  clientPhone: lead?.survey?.clientPhone,
                  clientEmail: lead?.survey?.clientEmail,
                  relationship: lead?.survey?.relationship,
                  consultation: { careLevel: contract.careLevel }
                };

                const createdResident = createResidentFromLead(leadForResident, contract.roomId, contract.bedNumber);

                // Update contract with resident info
                const updatedContract = {
                  ...contract,
                  residentCreatedAt: new Date().toISOString(),
                  createdResidentId: createdResident.id
                };
                saveContract(updatedContract);
                setSelectedContract(updatedContract);

                // Update lead if it exists
                if (savedLead && lead) {
                  const updatedLead = {
                    ...savedLead,
                    residentId: createdResident.id
                  };
                  setSavedLead(updatedLead);
                  addLead(updatedLead);
                }
              } catch (error) {
                console.error('Error creating resident:', error);
                alert('Kļūda iebraucinot rezidentu: ' + error.message);
              }
            }
          }}
        />
      )}

      {/* Settings View */}
      {currentStep === STEPS.SETTINGS && (
        <SettingsView
          onBack={() => handleNavigate('all-leads')}
          onNavigate={handleNavigate}
          onStartDemo={handleStartDemo}
        />
      )}

      {/* Import History View */}
      {currentStep === STEPS.IMPORT_HISTORY && (
        <ImportHistoryView
          onBack={() => handleNavigate('settings')}
        />
      )}

      {/* Group Activities View */}
      {currentStep === STEPS.GROUP_ACTIVITIES && (
        <GroupActivitiesView
          onBack={() => handleNavigate('all-leads')}
        />
      )}

      {/* Supplier Management View */}
      {currentStep === STEPS.SUPPLIER_LIST && (
        <SupplierListView
          onBack={() => handleNavigate('bulk-inventory')}
        />
      )}

      {/* Supplier Catalog View */}
      {currentStep === STEPS.SUPPLIER_CATALOG && (
        <SupplierCatalogView
          onNavigate={handleNavigate}
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

      {/* Demo Tour Overlay */}
      {demoTourActive && (
        <DemoTour
          currentStep={demoTourStep}
          onNext={handleDemoNext}
          onPrev={handleDemoPrev}
          onClose={handleDemoClose}
          onNavigate={handleDemoNavigate}
        />
      )}
    </div>
  );
};

export default ClientIntakePrototype;
