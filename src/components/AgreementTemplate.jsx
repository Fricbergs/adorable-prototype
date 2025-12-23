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
    return !value || value.trim() === '' ? 'bg-yellow-100 px-1 rounded' : '';
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold mb-2">
          LĪGUMS PAR SOCIĀLO PAKALPOJUMU NODROŠINĀŠANU
        </h1>
        <p className="text-lg font-semibold">
          NR. {agreementNumber}
        </p>
      </div>

      {/* Date and Place */}
      <div className="text-center mb-8">
        <p>Rīga, {today}</p>
      </div>

      {/* Parties */}
      <div className="mb-8 text-sm leading-relaxed">
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
        <h2 className="text-lg font-bold mb-4">1. LĪGUMA PRIEKŠMETS</h2>

        <h3 className="font-semibold mb-4">1.1. Vispārējie līguma noteikumi:</h3>

        {/* Services Table */}
        <div className="border-2 border-gray-800">
          <table className="w-full text-sm">
            <tbody>
              {/* Service Type */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 w-1/3 font-semibold">I. Pakalpojums</td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={consultation.duration === 'long'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>ilglaicīgs</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={consultation.duration === 'short'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>īslaicīgs</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Room Type */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">II. Mājoklis</td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={consultation.roomType === 'single'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>vienvietīgs</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={consultation.roomType === 'double'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>divvietīgs</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={consultation.roomType === 'triple'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>trīsvietīgs</span>
                    </label>
                  </div>
                  {consultation.hasDementia && (
                    <p className="text-xs mt-2 text-yellow-700 font-semibold">
                      * Speciāla istaba (demence)
                    </p>
                  )}
                </td>
              </tr>

              {/* Daily Rate */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">III. Maksa par vienu diennakti</td>
                <td className="p-3">
                  <span className="font-bold text-lg">EUR {consultation.price || '00.00'}</span>
                </td>
              </tr>

              {/* Security Deposit */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">IV. Drošības nauda</td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={survey.securityDeposit === 'no' || !survey.securityDeposit}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>nav</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={survey.securityDeposit === 'yes'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>ir {survey.securityDepositAmount ? `${survey.securityDepositAmount} EUR` : '____________EUR'}</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Entry Date */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">V. Klienta iestāšanās datums</td>
                <td className="p-3">
                  <span className={`font-semibold ${!survey.stayDateFrom ? 'bg-yellow-100 px-1 rounded' : ''}`}>{entryDate}</span>
                </td>
              </tr>

              {/* Contract Term */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">VI. Līguma termiņš</td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!survey.stayDateTo}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>beztermiņa</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!survey.stayDateTo}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>līdz {survey.stayDateTo ? formatDate(survey.stayDateTo) : '___________'}</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Care Level */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">VII. Aprūpes līmenis</td>
                <td className="p-3">
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map(level => (
                      <label key={level} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={consultation.careLevel === level.toString()}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span>{level}</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Health Data Consent */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">
                  VIII. Klients piekrīt datu par savu veselības stāvokli nodošanai Apgādniekam
                </td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={survey.healthDataConsent === 'yes' || (hasCaregiver && !survey.healthDataConsent)}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>jā</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={survey.healthDataConsent === 'no'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>nē</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* ID Documents Storage */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">
                  IX. Pakalpojumu sniedzējam tiek iesniegti glabāšanai Klientam piederošie personas dokumenti (Pase vai ID karte)
                </td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={survey.storeIdDocuments === 'yes'}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>jā</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={survey.storeIdDocuments === 'no' || !survey.storeIdDocuments}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>nē</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Additional Services */}
              <tr>
                <td className="p-3 border-r border-gray-800 font-semibold">X. Sniedzamie papildus pakalpojumi:</td>
                <td className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">- Klienta veļas mazgāšana un marķēšana:</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={survey.laundryService === 'yes'}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm">jā</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={survey.laundryService === 'no' || !survey.laundryService}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm">nē</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">- podologs:</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={survey.podologistService === 'no' || !survey.podologistService}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm">nē</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={survey.podologistService === 'yes'}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm">jā, {survey.podologistFrequency || '___'} reizes mēnesī</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">- cits {survey.otherServices ? `(${survey.otherServices})` : '______________________________'}:</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={survey.otherServicesEnabled === 'no' || !survey.otherServicesEnabled}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm">nē</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={survey.otherServicesEnabled === 'yes'}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm">jā</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 pt-8 border-t-2 border-gray-400">
        <div className="grid grid-cols-2 gap-8 text-sm">
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
