import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, FileText, Save, Check, AlertTriangle, User, Home, Calendar, Euro, Info, Bed } from 'lucide-react';
import PageShell from '../components/PageShell';
import { createResidentFromLead } from '../domain/residentHelpers';
import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
  createDraftContract,
  getTermType,
  calculateDiscountedPrice,
  validateContractNumber
} from '../domain/contracts';
import {
  findProduct,
  CARE_LEVELS,
  CARE_LEVEL_LABELS,
  ROOM_TYPES,
  TERM_TYPES,
  RESIDENCES,
  RESIDENCE_LABELS,
  ROOM_TYPE_LABELS,
  formatDailyRate,
  calculateMonthlyEstimate,
  normalizeCareLevel,
  mapLegacyRoomType,
  mapLegacyDuration
} from '../domain/products';
import { useContracts } from '../hooks/useContracts';

/**
 * ContractCreateView - Create or edit a contract
 * Full contract form with product selection, pricing, and room assignment
 */
const ContractCreateView = ({
  lead,
  existingContract,
  onSave,
  onBack,
  onComplete,
  onSelectRoom,
  initialRoom,
  initialBed
}) => {
  const {
    contracts,
    products,
    saveDraft,
    saveAndActivate,
    getNextContractNumber,
    isContractNumberUnique
  } = useContracts();

  // Form state
  const [contractNumber, setContractNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noEndDate, setNoEndDate] = useState(true);
  const [residence, setResidence] = useState(RESIDENCES.MELODIJA);
  const [careLevel, setCareLevel] = useState('');
  const [roomType, setRoomType] = useState('');
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [notes, setNotes] = useState('');
  const [residentIsClient, setResidentIsClient] = useState(false);

  // Resident/Client info (from lead or editable)
  const [residentName, setResidentName] = useState('');
  const [clientName, setClientName] = useState('');

  // Room selection (received from BedBookingView)
  const [selectedRoom, setSelectedRoom] = useState(initialRoom || null);
  const [selectedBed, setSelectedBed] = useState(initialBed || null);

  // Update room when initialRoom changes (after returning from bed selection)
  useEffect(() => {
    if (initialRoom) {
      setSelectedRoom(initialRoom);
    }
  }, [initialRoom]);

  useEffect(() => {
    if (initialBed) {
      setSelectedBed(initialBed);
    }
  }, [initialBed]);

  // UI state
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from lead data if available
  useEffect(() => {
    if (lead) {
      // Check if we have survey data (more complete) or just basic lead data
      const survey = lead.survey || {};

      // Set resident name - prefer survey data, fall back to lead
      const residentFirst = survey.firstName || lead.firstName || '';
      const residentLast = survey.lastName || lead.lastName || '';
      const fullResidentName = `${residentFirst} ${residentLast}`.trim();
      setResidentName(fullResidentName);

      // Determine if resident is their own client
      const signerIsResident = survey.signerScenario === 'resident' || !survey.signerScenario;
      setResidentIsClient(signerIsResident);

      // Set client/apgādnieks name
      if (!signerIsResident && (survey.clientFirstName || survey.clientLastName)) {
        const clientFirst = survey.clientFirstName || '';
        const clientLast = survey.clientLastName || '';
        setClientName(`${clientFirst} ${clientLast}`.trim());
      } else {
        setClientName(fullResidentName);
      }

      // Map consultation data to new format
      if (lead.consultation) {
        const { careLevel: legacyCare, roomType: legacyRoom, duration } = lead.consultation;

        if (legacyCare) {
          const mappedCare = normalizeCareLevel(legacyCare);
          if (mappedCare) setCareLevel(mappedCare);
        }

        if (legacyRoom) {
          const mappedRoom = mapLegacyRoomType(legacyRoom);
          if (mappedRoom) setRoomType(mappedRoom);
        }

        if (duration) {
          const mappedTerm = mapLegacyDuration(duration);
          setNoEndDate(mappedTerm === 'ilgtermiņa');
        }
      }

      // Set dates from survey if available
      if (survey.stayDateFrom) {
        setStartDate(survey.stayDateFrom);
      } else {
        // Default to today
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
      }

      if (survey.stayDateTo) {
        setEndDate(survey.stayDateTo);
        setNoEndDate(false);
      }
    }
  }, [lead]);

  // Initialize from existing contract (edit mode)
  useEffect(() => {
    if (existingContract) {
      setContractNumber(existingContract.contractNumber || '');
      setStartDate(existingContract.startDate || '');
      setEndDate(existingContract.endDate || '');
      setNoEndDate(existingContract.noEndDate ?? true);
      setResidence(existingContract.residence || RESIDENCES.MELODIJA);
      setCareLevel(existingContract.careLevel || '');
      setRoomType(existingContract.roomType || '');
      setDiscountEnabled(existingContract.discountPercent > 0);
      setNotes(existingContract.notes || '');
      setResidentIsClient(existingContract.residentIsClient ?? false);
    }
  }, [existingContract]);

  // Calculate term type from dates
  const termType = useMemo(() => {
    return getTermType(startDate, endDate, noEndDate);
  }, [startDate, endDate, noEndDate]);

  // Find matching product
  const selectedProduct = useMemo(() => {
    if (!careLevel || !roomType || !residence) return null;
    return findProduct(careLevel, roomType, residence, termType, products);
  }, [careLevel, roomType, residence, termType, products]);

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!selectedProduct) {
      return { dailyRate: null, discountedRate: null, monthlyEstimate: null };
    }

    const dailyRate = selectedProduct.dailyRate;
    const discountedRate = discountEnabled
      ? calculateDiscountedPrice(dailyRate, 10)
      : dailyRate;
    const monthlyEstimate = calculateMonthlyEstimate(discountedRate);

    return { dailyRate, discountedRate, monthlyEstimate };
  }, [selectedProduct, discountEnabled]);

  // Generate suggested contract number
  const suggestedContractNumber = useMemo(() => {
    return getNextContractNumber(residence);
  }, [residence, getNextContractNumber]);

  // Handle no end date toggle
  const handleNoEndDateChange = (checked) => {
    setNoEndDate(checked);
    if (checked) {
      setEndDate('');
    }
  };

  // Handle resident is client toggle
  const handleResidentIsClientChange = (checked) => {
    setResidentIsClient(checked);
    if (checked) {
      setClientName(residentName);
    }
  };

  // Validate form
  const validateForm = (forActivation = false) => {
    const errors = [];

    if (forActivation) {
      // Auto-fill contract number if empty
      const effectiveContractNumber = contractNumber || suggestedContractNumber;

      if (!effectiveContractNumber) {
        errors.push('Līguma numurs ir obligāts');
      } else {
        const numberValidation = validateContractNumber(effectiveContractNumber);
        if (!numberValidation.valid) {
          errors.push(numberValidation.error);
        } else if (!isContractNumberUnique(effectiveContractNumber, existingContract?.id)) {
          errors.push('Līguma numurs jau eksistē');
        }
      }

      if (!startDate) {
        errors.push('Sākuma datums ir obligāts');
      }

      if (!noEndDate && !endDate) {
        errors.push('Beigu datums ir obligāts');
      }

      if (!residentName) {
        errors.push('Rezidenta vārds ir obligāts');
      }

      if (!careLevel) {
        errors.push('Aprūpes līmenis ir obligāts');
      }

      if (!roomType) {
        errors.push('Istabas tips ir obligāts');
      }

      if (!selectedRoom) {
        errors.push('Istaba ir obligāta - izvēlieties brīvu istabu');
      }

      if (!selectedProduct) {
        errors.push('Produkts nav atrasts izvēlētajai kombinācijai');
      }
    }

    return errors;
  };

  // Build contract object from form
  const buildContractObject = () => {
    const survey = lead?.survey || {};

    return {
      id: existingContract?.id || undefined,
      contractNumber: contractNumber || suggestedContractNumber,
      residence,
      residentId: lead?.id || null,
      clientId: residentIsClient ? null : lead?.id,
      residentIsClient,
      startDate: startDate || null,
      endDate: noEndDate ? null : endDate,
      noEndDate,
      careLevel: careLevel || null,
      roomType: roomType || null,
      termType,
      productCode: selectedProduct?.code || null,
      dailyRate: pricing.dailyRate,
      discountPercent: discountEnabled ? 10 : 0,
      dailyRateWithDiscount: pricing.discountedRate,
      roomId: selectedRoom?.id || null,
      roomNumber: selectedRoom?.number || null,
      bedNumber: selectedBed || null,
      notes,
      // Store party names
      residentName,
      clientName: residentIsClient ? residentName : clientName,

      // Resident/Klients full data from survey
      residentPersonalCode: survey.personalCode || null,
      residentAddress: survey.street && survey.city
        ? `${survey.street}, ${survey.city}${survey.postalCode ? ', ' + survey.postalCode : ''}`
        : null,
      residentPhone: survey.phone || lead?.phone || null,
      residentEmail: survey.email || lead?.email || null,
      residentBirthDate: survey.birthDate || null,
      residentGender: survey.gender || null,

      // Client/Apgādnieks full data from survey
      clientPersonalCode: survey.clientPersonalCode || null,
      clientAddress: survey.clientStreet && survey.clientCity
        ? `${survey.clientStreet}, ${survey.clientCity}${survey.clientPostalCode ? ', ' + survey.clientPostalCode : ''}`
        : null,
      clientPhone: survey.clientPhone || null,
      clientEmail: survey.clientEmail || null,
      clientRelationship: survey.relationship || null,

      // Contract terms from survey
      securityDeposit: survey.securityDeposit === 'yes',
      securityDepositAmount: survey.securityDepositAmount ? parseFloat(survey.securityDepositAmount) : null,
      paymentDeadline: survey.paymentDeadline || null,
      healthDataConsent: survey.healthDataConsent === 'yes',
      storeIdDocuments: survey.storeIdDocuments === 'yes',

      // Additional services from survey
      laundryService: survey.laundryService === 'yes',
      podologistService: survey.podologistService === 'yes',
      podologistFrequency: survey.podologistFrequency ? parseInt(survey.podologistFrequency) : null,
      otherServices: survey.otherServicesEnabled === 'yes' ? survey.otherServices : null,

      // Disability info
      disabilityGroup: survey.disabilityGroup && survey.disabilityGroup !== 'none' ? survey.disabilityGroup : null,
      disabilityDateFrom: survey.disabilityDateFrom || null,
      disabilityDateTo: survey.disabilityDateTo || null
    };
  };

  // Handle save as draft
  const handleSaveDraft = async () => {
    setError('');
    setIsSaving(true);

    try {
      const contract = buildContractObject();
      const saved = saveDraft(contract);

      onSave?.(saved);
    } catch (err) {
      setError(err.message || 'Kļūda saglabājot melnrakstu');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle save and activate
  const handleSaveAndActivate = async () => {
    setError('');

    // Validate
    const errors = validateForm(true);
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    setIsSaving(true);

    try {
      const contract = buildContractObject();
      const result = saveAndActivate(contract);

      if (!result.success) {
        setError(result.errors?.join('. ') || 'Kļūda aktivizējot līgumu');
        setIsSaving(false);
        return;
      }

      // Create resident and book bed after successful activation
      let createdResident = null;
      if (selectedRoom && selectedBed && lead) {
        try {
          // Build a lead-like object for resident creation
          const leadForResident = {
            ...lead,
            id: lead.id,
            firstName: lead.survey?.firstName || lead.firstName,
            lastName: lead.survey?.lastName || lead.lastName,
            phone: lead.survey?.phone || lead.phone,
            email: lead.survey?.email || lead.email,
            agreementNumber: result.contract.contractNumber,
            // Pass survey data
            birthDate: lead.survey?.birthDate,
            personalCode: lead.survey?.personalCode,
            gender: lead.survey?.gender,
            street: lead.survey?.street,
            city: lead.survey?.city,
            postalCode: lead.survey?.postalCode,
            // Client/contact info
            clientFirstName: lead.survey?.clientFirstName,
            clientLastName: lead.survey?.clientLastName,
            clientPhone: lead.survey?.clientPhone,
            clientEmail: lead.survey?.clientEmail,
            relationship: lead.survey?.relationship
          };
          createdResident = createResidentFromLead(leadForResident, selectedRoom.id, selectedBed);
        } catch (residentErr) {
          console.warn('Could not create resident:', residentErr);
          // Continue anyway - contract is already activated
        }
      }

      // Pass both contract and resident info
      onComplete?.(result.contract, createdResident);
    } catch (err) {
      setError(err.message || 'Kļūda saglabājot līgumu');
    } finally {
      setIsSaving(false);
    }
  };

  // Use suggested number
  const handleUseSuggestedNumber = () => {
    setContractNumber(suggestedContractNumber);
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-orange-500" />
            {existingContract ? 'Rediģēt līgumu' : 'Jauns līgums'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {existingContract
              ? `Rediģējiet līgumu ${existingContract.contractNumber || 'melnrakstu'}`
              : 'Izveidojiet jaunu pakalpojuma līgumu'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Section 1: Contract Number & Dates */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Līguma informācija
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contract Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Līguma numurs
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    placeholder={suggestedContractNumber}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleUseSuggestedNumber}
                    className="px-3 py-2 text-sm text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50"
                    title="Izmantot ieteikto numuru"
                  >
                    Ieteikt
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formāts: AM-####/GGGG vai AŠ-####/GGGG
                </p>
              </div>

              {/* Residence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rezidence
                </label>
                <select
                  value={residence}
                  onChange={(e) => setResidence(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {Object.entries(RESIDENCE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sākuma datums
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beigu datums
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={noEndDate}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    noEndDate ? 'bg-gray-100 text-gray-400' : ''
                  }`}
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noEndDate}
                    onChange={(e) => handleNoEndDateChange(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">Nav beigu datuma (ilgtermiņa)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Parties */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              Līguma puses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resident (Klients in contract) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rezidents <span className="text-gray-400">(līgumā: Klients)</span>
                </label>
                <input
                  type="text"
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  placeholder="Vārds Uzvārds"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Client (Apgādnieks in contract) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apgādnieks <span className="text-gray-400">(līgumā: Apgādnieks)</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Vārds Uzvārds"
                  disabled={residentIsClient}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    residentIsClient ? 'bg-gray-100 text-gray-400' : ''
                  }`}
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={residentIsClient}
                    onChange={(e) => handleResidentIsClientChange(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">Rezidents pats būs apgādnieks</span>
                </label>
              </div>
            </div>

            {/* Info box about terminology */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                <strong>Terminoloģija:</strong> Sistēmā "Rezidents" = Līgumā "Klients" (aprūpējamā persona).
                Sistēmā "Klients/Apgādnieks" = Līgumā "Apgādnieks" (maksātājs).
              </p>
            </div>
          </div>

          {/* Section 3: Product Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-gray-400" />
              Pakalpojuma parametri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Care Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aprūpes līmenis
                </label>
                <select
                  value={careLevel}
                  onChange={(e) => setCareLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Izvēlieties...</option>
                  {CARE_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}. līmenis</option>
                  ))}
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Istabas tips
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Izvēlieties...</option>
                  {Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Term Type (read-only, calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termiņa tips
                </label>
                <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
                  {termType === 'ilgtermiņa' ? 'Ilgtermiņa (>3 mēneši)' : 'Īstermiņa (≤3 mēneši)'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Aprēķināts automātiski no datumiem
                </p>
              </div>
            </div>

            {/* Selected Product Display */}
            {selectedProduct && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Produkta kods:</strong> {selectedProduct.code}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Nosaukums:</strong> {selectedProduct.name}
                </p>
              </div>
            )}

            {careLevel && roomType && !selectedProduct && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Nav atrasts produkts izvēlētajai kombinācijai
                </p>
              </div>
            )}
          </div>

          {/* Section 3.5: Room Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-400" />
              Istabas izvēle
            </h2>

            {selectedRoom ? (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        Istaba {selectedRoom.number}
                        {selectedRoom.bedCount > 1 && `, gulta ${selectedBed}`}
                      </p>
                      <p className="text-sm text-green-600">
                        {selectedRoom.floor}. stāvs • {selectedRoom.bedCount === 1 ? '1-vietīga' : '2-vietīga'} istaba
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onSelectRoom}
                    className="px-3 py-1.5 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-100"
                  >
                    Mainīt
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Izvēlieties istabu no brīvajām vietām gultu fondā
                </p>
                <button
                  type="button"
                  onClick={onSelectRoom}
                  className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
                >
                  <Bed className="w-5 h-5" />
                  Izvēlēties istabu
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Pricing */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5 text-gray-400" />
              Dzīvošanas izmaksas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Base Daily Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bāzes dienas cena
                </label>
                <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700 font-medium">
                  {pricing.dailyRate ? `${pricing.dailyRate.toFixed(2)} EUR` : '—'}
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atlaide
                </label>
                <label className="flex items-center gap-2 h-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discountEnabled}
                    onChange={(e) => setDiscountEnabled(e.target.checked)}
                    disabled={!selectedProduct}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">Piemērot 10% atlaidi</span>
                </label>
              </div>

              {/* Final Daily Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gala dienas cena
                </label>
                <div className={`w-full border rounded-lg px-3 py-2 font-medium ${
                  pricing.discountedRate
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}>
                  {pricing.discountedRate ? `${pricing.discountedRate.toFixed(2)} EUR / diennakts` : '—'}
                </div>
              </div>
            </div>

            {/* Monthly Estimate */}
            {pricing.monthlyEstimate > 0 && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  <strong>Ikmēneša izmaksu novērtējums:</strong> ~{pricing.monthlyEstimate.toFixed(2)} EUR (30 dienas)
                </p>
              </div>
            )}
          </div>

          {/* Section 5: Survey Data Summary */}
          {lead?.survey && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Aptaujas dati (līgumam)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resident/Klients data */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                    Klients (Rezidents)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vārds, uzvārds:</span>
                      <span className="font-medium">{lead.survey.firstName} {lead.survey.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Personas kods:</span>
                      <span className="font-medium">{lead.survey.personalCode || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Adrese:</span>
                      <span className="font-medium text-right max-w-[200px]">
                        {lead.survey.street && lead.survey.city
                          ? `${lead.survey.street}, ${lead.survey.city}${lead.survey.postalCode ? ', ' + lead.survey.postalCode : ''}`
                          : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tālrunis:</span>
                      <span className="font-medium">{lead.survey.phone || lead.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">E-pasts:</span>
                      <span className="font-medium">{lead.survey.email || lead.email || '—'}</span>
                    </div>
                    {lead.survey.birthDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dzimšanas datums:</span>
                        <span className="font-medium">{lead.survey.birthDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apgādnieks data (if different) */}
                {lead.survey.signerScenario === 'relative' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                      Apgādnieks
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vārds, uzvārds:</span>
                        <span className="font-medium">{lead.survey.clientFirstName} {lead.survey.clientLastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Personas kods:</span>
                        <span className="font-medium">{lead.survey.clientPersonalCode || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Adrese:</span>
                        <span className="font-medium text-right max-w-[200px]">
                          {lead.survey.clientStreet && lead.survey.clientCity
                            ? `${lead.survey.clientStreet}, ${lead.survey.clientCity}${lead.survey.clientPostalCode ? ', ' + lead.survey.clientPostalCode : ''}`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tālrunis:</span>
                        <span className="font-medium">{lead.survey.clientPhone || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">E-pasts:</span>
                        <span className="font-medium">{lead.survey.clientEmail || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Radniecība:</span>
                        <span className="font-medium">
                          {lead.survey.relationship === 'child' ? 'Dēls/Meita' :
                           lead.survey.relationship === 'spouse' ? 'Laulātais' :
                           lead.survey.relationship === 'guardian' ? 'Pilnvarotā persona' :
                           lead.survey.relationship === 'social_worker' ? 'Sociālais darbinieks' :
                           lead.survey.relationship || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contract terms */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                    Līguma noteikumi
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Drošības nauda:</span>
                      <span className="font-medium">
                        {lead.survey.securityDeposit === 'yes'
                          ? `Jā (${lead.survey.securityDepositAmount || '—'} EUR)`
                          : 'Nē'}
                      </span>
                    </div>
                    {lead.survey.paymentDeadline && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Maksas termiņš:</span>
                        <span className="font-medium">{lead.survey.paymentDeadline}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Veselības datu nodošana:</span>
                      <span className="font-medium">{lead.survey.healthDataConsent === 'yes' ? 'Jā' : 'Nē'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dokumentu glabāšana:</span>
                      <span className="font-medium">{lead.survey.storeIdDocuments === 'yes' ? 'Jā' : 'Nē'}</span>
                    </div>
                  </div>
                </div>

                {/* Additional services */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                    Papildus pakalpojumi
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Veļas mazgāšana:</span>
                      <span className="font-medium">{lead.survey.laundryService === 'yes' ? 'Jā' : 'Nē'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Podologs:</span>
                      <span className="font-medium">
                        {lead.survey.podologistService === 'yes'
                          ? `Jā (${lead.survey.podologistFrequency || 1}x mēnesī)`
                          : 'Nē'}
                      </span>
                    </div>
                    {lead.survey.otherServicesEnabled === 'yes' && lead.survey.otherServices && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Citi:</span>
                        <span className="font-medium text-right max-w-[200px]">{lead.survey.otherServices}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                Šie dati tika ievākti aptaujas anketā un tiks izmantoti līguma dokumentā.
              </p>
            </div>
          )}

          {/* Section 6: Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Piezīmes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Iekšējas piezīmes (nav iekļautas līgumā)"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Piezīmes ir tikai iekšējai lietošanai un netiek iekļautas ģenerētajā līguma dokumentā.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Atcelt
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Saglabāt melnrakstu
          </button>

          <button
            onClick={handleSaveAndActivate}
            disabled={isSaving || !selectedProduct}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors
              ${(isSaving || !selectedProduct)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'}
            `}
          >
            {isSaving ? (
              <>Saglabā...</>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Saglabāt un aktivizēt
              </>
            )}
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default ContractCreateView;
