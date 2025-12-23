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
          <span className="font-semibold">{survey.firstName || '_________'} {survey.lastName || '_________'}</span>,
          personas kods: <span className="font-semibold">{survey.personalCode || '__________-_____'}</span>,
          deklarētā adrese: <span className="font-semibold">
            {survey.street && survey.city && survey.postalCode
              ? `${survey.street}, ${survey.city}, ${survey.postalCode}`
              : '_________________________________'}
          </span>, turpmāk tekstā - <span className="font-semibold">Klients</span>,{hasCaregiver ? ' un' : ''}
        </p>

        {hasCaregiver && (
          <p className="mb-4">
            <span className="font-semibold">
              {survey.clientFirstName || '_________'} {survey.clientLastName || '_________'}
            </span>,
            personas kods: <span className="font-semibold">{survey.clientPersonalCode || '__________-_____'}</span>,
            deklarētā adrese: <span className="font-semibold">
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
                      <input type="checkbox" checked readOnly className="w-4 h-4" />
                      <span>nav</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Entry Date */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">VI. Klienta iestāšanās datums</td>
                <td className="p-3">
                  <span className="font-semibold">{entryDate}</span>
                </td>
              </tr>

              {/* Contract Term */}
              <tr className="border-b border-gray-800">
                <td className="p-3 border-r border-gray-800 font-semibold">VII. Līguma termiņš</td>
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
                <td className="p-3 border-r border-gray-800 font-semibold">VIII. Aprūpes līmenis</td>
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
              <tr>
                <td className="p-3 border-r border-gray-800 font-semibold">
                  IX. Klients piekrīt datu par savu veselības stāvokli nodošanai Apgādniekam
                </td>
                <td className="p-3">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={hasCaregiver} readOnly className="w-4 h-4" />
                      <span>jā</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={!hasCaregiver} readOnly className="w-4 h-4" />
                      <span>nē</span>
                    </label>
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
            <p className="font-semibold">{survey.firstName || '_________'} {survey.lastName || '_________'}</p>
            <p>Personas kods: {survey.personalCode || '__________-_____'}</p>
            <p>E-pasts: {survey.email || lead.email || '_________________'}</p>
            <p>Tālrunis: {survey.phone || lead.phone || '_________________'}</p>

            {hasCaregiver && (
              <div className="mt-4">
                <p className="font-bold mb-2">APGĀDNIEKS:</p>
                <p className="font-semibold">
                  {survey.clientFirstName || '_________'} {survey.clientLastName || '_________'}
                </p>
                <p>Personas kods: {survey.clientPersonalCode || '__________-_____'}</p>
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
