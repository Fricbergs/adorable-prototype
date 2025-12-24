import React from 'react';
import { FileText, Building2, Calendar, User } from 'lucide-react';

/**
 * Agreement Template Component
 * Displays the social services agreement in HTML format
 * Based on "Līgums par sociālo pakalpojumu nodrošināšanu"
 */
const AgreementTemplate = ({ lead }) => {
  const consultation = lead?.consultation || {};
  const survey = lead?.survey || {};
  const agreementNumber = lead?.agreementNumber || 'RSD-__-2025-LĪ-___';

  // Format date to Latvian format
  const formatDate = (dateString) => {
    if (!dateString) return '____';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs',
                    'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${year}. gada ${day}. ${month}`;
  };

  const today = formatDate(new Date().toISOString());
  const entryDate = formatDate(survey.stayDateFrom);

  // Determine if caregiver/relative is signing
  const hasCaregiver = survey.signerScenario === 'relative';

  // Helper to highlight missing data
  const getMissingClass = (value) => {
    if (!value) return 'bg-yellow-100 px-1 rounded';
    if (typeof value === 'string' && value.trim() === '') return 'bg-yellow-100 px-1 rounded';
    return '';
  };

  return (
    <div className="bg-white p-4 sm:p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-base sm:text-xl font-bold mb-2">
          LĪGUMS PAR SOCIĀLO PAKALPOJUMU NODROŠINĀŠANU
        </h1>
        <p className="text-sm sm:text-lg font-semibold">
          NR. {agreementNumber}
        </p>
      </div>

      {/* Date and Place */}
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-sm sm:text-base">Rīga, {today}</p>
      </div>

      {/* Parties */}
      <div className="mb-6 sm:mb-8 text-xs sm:text-sm leading-relaxed">
        <p className="mb-4">
          <span className="font-semibold">SIA "Adoro Šampēteris"</span>, reģistrācijas Nr. 40203404640,
          juridiskā adrese: Zolitūdes iela 68A, Rīga, LV-1046, kuras vārdā rīkojas direktors Kristīne Besedina,
          turpmāk tekstā - <span className="font-semibold">Pakalpojuma sniedzējs</span>, no vienas puses,
        </p>

        <p className="mb-4">
          <span className={`font-semibold ${getMissingClass(survey.firstName)}`}>{survey.firstName || '_________'}</span>{' '}
          <span className={`font-semibold ${getMissingClass(survey.lastName)}`}>{survey.lastName || '_________'}</span>,
          personas kods: <span className={`font-semibold ${getMissingClass(survey.personalCode)}`}>{survey.personalCode || '__________-_____'}</span>,
          deklarētā adrese: <span className={`font-semibold ${survey.street && survey.city && survey.postalCode ? '' : 'bg-yellow-100 px-1 rounded'}`}>
            {survey.street && survey.city && survey.postalCode
              ? `${survey.street}, ${survey.city}, ${survey.postalCode}`
              : '_________________________________'}
          </span>, turpmāk tekstā - <span className="font-semibold">Klients</span>,{hasCaregiver ? ' un' : ''}
        </p>

        {hasCaregiver && (
          <p className="mb-4">
            <span className={`font-semibold ${getMissingClass(survey.clientFirstName)}`}>
              {survey.clientFirstName || '_________'}
            </span>{' '}
            <span className={`font-semibold ${getMissingClass(survey.clientLastName)}`}>
              {survey.clientLastName || '_________'}
            </span>,
            personas kods: <span className={`font-semibold ${getMissingClass(survey.clientPersonalCode)}`}>{survey.clientPersonalCode || '__________-_____'}</span>,
            deklarētā adrese: <span className={`font-semibold ${survey.clientStreet && survey.clientCity && survey.clientPostalCode ? '' : 'bg-yellow-100 px-1 rounded'}`}>
              {survey.clientStreet && survey.clientCity && survey.clientPostalCode
                ? `${survey.clientStreet}, ${survey.clientCity}, ${survey.clientPostalCode}`
                : '_________________________________'}
            </span>, turpmāk tekstā - <span className="font-semibold">Apgādnieks</span>,
          </p>
        )}

        <p className="mt-6">
          {hasCaregiver
            ? 'Pakalpojuma sniedzējs, Klients un Apgādnieks turpmāk tekstā visi kopā – Puses, noslēdz līgumu par sociālo pakalpojumu nodrošināšanu.'
            : 'Pakalpojuma sniedzējs un Klients turpmāk tekstā visi kopā – Puses, noslēdz līgumu par sociālo pakalpojumu nodrošināšanu.'
          }
        </p>
      </div>

      {/* Section 1 - Contract Details */}
      <div className="mb-8">
        <h2 className="text-base sm:text-lg font-bold mb-4">1. LĪGUMA PRIEKŠMETS</h2>

        <h3 className="font-semibold mb-4 text-sm sm:text-base">1.1. Vispārējie līguma noteikumi:</h3>

        {/* Contract Terms - Clean Text Format */}
        <div className="border-2 border-gray-800 rounded text-sm leading-relaxed">
          {/* I. Service Type */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">I. Pakalpojums: </span>
            <span className="bg-orange-100 px-2 py-0.5 rounded font-semibold text-orange-800">
              {consultation.duration === 'long' ? 'ilglaicīgs' : consultation.duration === 'short' ? 'īslaicīgs' : '____'}
            </span>
          </div>

          {/* II. Room Type */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">II. Mājoklis: </span>
            <span className="bg-orange-100 px-2 py-0.5 rounded font-semibold text-orange-800">
              {consultation.roomType === 'single' ? 'vienvietīgs' :
               consultation.roomType === 'double' ? 'divvietīgs' :
               consultation.roomType === 'triple' ? 'trīsvietīgs' : '____'}
            </span>
            {consultation.hasDementia && (
              <span className="ml-2 bg-yellow-100 px-2 py-0.5 rounded text-yellow-800 text-xs font-semibold">
                + speciāla istaba (demence)
              </span>
            )}
          </div>

          {/* III. Daily Rate */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">III. Maksa par vienu diennakti: </span>
            <span className="bg-green-100 px-2 py-0.5 rounded font-bold text-green-800">
              EUR {consultation.price || '00.00'}
            </span>
          </div>

          {/* IV. Security Deposit */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">IV. Drošības nauda: </span>
            {survey.securityDeposit === 'yes' ? (
              <span className="bg-orange-100 px-2 py-0.5 rounded font-semibold text-orange-800">
                {survey.securityDepositAmount ? `${survey.securityDepositAmount} EUR` : '_______ EUR'}
              </span>
            ) : (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">nav</span>
            )}
          </div>

          {/* V. Entry Date */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">V. Klienta iestāšanās datums: </span>
            <span className={`px-2 py-0.5 rounded font-semibold ${survey.stayDateFrom ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {entryDate}
            </span>
          </div>

          {/* VI. Contract Term */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">VI. Līguma termiņš: </span>
            {survey.stayDateTo ? (
              <span className="bg-orange-100 px-2 py-0.5 rounded font-semibold text-orange-800">
                līdz {formatDate(survey.stayDateTo)}
              </span>
            ) : (
              <span className="bg-blue-100 px-2 py-0.5 rounded font-semibold text-blue-800">beztermiņa</span>
            )}
          </div>

          {/* VII. Care Level */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">VII. Aprūpes līmenis: </span>
            <span className="bg-orange-100 px-2 py-0.5 rounded font-semibold text-orange-800">
              {consultation.careLevel ? `${consultation.careLevel}. līmenis` : '____'}
            </span>
          </div>

          {/* VIII. Health Data Consent */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">VIII. Veselības datu nodošana Apgādniekam: </span>
            <span className={`px-2 py-0.5 rounded font-semibold ${
              (survey.healthDataConsent === 'yes' || (hasCaregiver && !survey.healthDataConsent))
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {(survey.healthDataConsent === 'yes' || (hasCaregiver && !survey.healthDataConsent)) ? 'jā' : 'nē'}
            </span>
          </div>

          {/* IX. ID Documents */}
          <div className="p-3 sm:p-4 border-b border-gray-300">
            <span className="font-semibold">IX. Personas dokumentu glabāšana: </span>
            <span className={`px-2 py-0.5 rounded font-semibold ${
              survey.storeIdDocuments === 'yes' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {survey.storeIdDocuments === 'yes' ? 'jā' : 'nē'}
            </span>
          </div>

          {/* X. Additional Services */}
          <div className="p-3 sm:p-4">
            <span className="font-semibold block mb-2">X. Papildus pakalpojumi:</span>
            <div className="space-y-1.5 ml-4">
              <div>
                <span className="text-gray-700">• Veļas mazgāšana un marķēšana: </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  survey.laundryService === 'yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {survey.laundryService === 'yes' ? 'jā' : 'nē'}
                </span>
              </div>
              <div>
                <span className="text-gray-700">• Podologs: </span>
                {survey.podologistService === 'yes' ? (
                  <span className="bg-green-100 px-2 py-0.5 rounded text-xs font-semibold text-green-800">
                    jā, {survey.podologistFrequency || '___'} reizes mēnesī
                  </span>
                ) : (
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">nē</span>
                )}
              </div>
              <div>
                <span className="text-gray-700">• Cits: </span>
                {survey.otherServicesEnabled === 'yes' ? (
                  <span className="bg-orange-100 px-2 py-0.5 rounded text-xs font-semibold text-orange-800">
                    {survey.otherServices || '____'}
                  </span>
                ) : (
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">nē</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-gray-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-sm">
          <div>
            <p className="font-bold mb-2">PAKALPOJUMU SNIEDZĒJS:</p>
            <p className="font-semibold">SIA "Adoro Šampēteris"</p>
            <p>Reģ. Nr. 40203404640</p>
            <p>Zolitūdes iela 68A, Rīga, LV-1046</p>
            <p className="mt-2">Tālrunis: +371 20 616 003</p>
            <p>E-pasts: rezidence.sampeteris@adoro.lv</p>
          </div>
          <div>
            <p className="font-bold mb-2">KLIENTS:</p>
            <p className="font-semibold">
              <span className={getMissingClass(survey.firstName)}>{survey.firstName || '_________'}</span>{' '}
              <span className={getMissingClass(survey.lastName)}>{survey.lastName || '_________'}</span>
            </p>
            <p>Personas kods: <span className={getMissingClass(survey.personalCode)}>{survey.personalCode || '__________-_____'}</span></p>
            <p>E-pasts: {survey.email || lead.email || '_________________'}</p>
            <p>Tālrunis: {survey.phone || lead.phone || '_________________'}</p>

            {hasCaregiver && (
              <div className="mt-4">
                <p className="font-bold mb-2">APGĀDNIEKS:</p>
                <p className="font-semibold">
                  <span className={getMissingClass(survey.clientFirstName)}>{survey.clientFirstName || '_________'}</span>{' '}
                  <span className={getMissingClass(survey.clientLastName)}>{survey.clientLastName || '_________'}</span>
                </p>
                <p>Personas kods: <span className={getMissingClass(survey.clientPersonalCode)}>{survey.clientPersonalCode || '__________-_____'}</span></p>
                <p>E-pasts: {survey.clientEmail || '_________________'}</p>
                <p>Tālrunis: {survey.clientPhone || '_________________'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-300 rounded-lg">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Līguma pirmā lappuse</p>
            <p>
              Šis ir vienkāršots līguma variants priekšskatījumam. Pilns līgums satur papildu sadaļas par pušu pienākumiem,
              maksājumu noteikumiem, līguma izbeigšanas kārtību un citiem svarīgiem noteikumiem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementTemplate;
