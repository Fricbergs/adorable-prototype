import React, { useState } from 'react';
import { ArrowLeft, Printer, Check, X, UserPlus, CheckCircle } from 'lucide-react';
import { RESIDENCE_LABELS, ROOM_TYPE_LABELS, CARE_LEVELS, getCareLevelNumber } from '../domain/products';
import { CONTRACT_STATUS_LABELS } from '../domain/contracts';

/**
 * ContractPrintView - Print-optimized contract document
 * Renders a full contract document matching the official Adoro template
 * Includes contract signing checkbox and move-in button for resident creation
 */
const ContractPrintView = ({ contract, lead, onBack, onMarkSigned, onMoveIn }) => {
  const [isSigned, setIsSigned] = useState(contract?.signedAt ? true : false);
  const [isMovingIn, setIsMovingIn] = useState(false);
  if (!contract) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Līgums nav atrasts</p>
        <button
          onClick={onBack}
          className="mt-4 text-orange-600 hover:text-orange-700"
        >
          Atpakaļ
        </button>
      </div>
    );
  }

  // Format date for display (Latvian format)
  const formatDate = (dateString) => {
    if (!dateString) return '________________';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const months = [
      'janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs',
      'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris'
    ];
    return `${year}. gada ${date.getDate()}. ${months[date.getMonth()]}`;
  };

  // Get residence name and details
  const isMelodija = contract.residence === 'melodija';
  const residenceName = isMelodija ? 'Adoro Melodija' : 'Adoro Šampēteris';
  const residenceCompany = isMelodija ? 'SIA "Adoro Melodija"' : 'SIA "Adoro Šampēteris"';
  const residenceRegNr = isMelodija ? '40103XXXXXX' : '40203404640';
  const residenceAddress = isMelodija
    ? 'Miera iela 25, Rīga, LV-1001'
    : 'Zolitūdes iela 68A, Rīga, LV-1046';
  const residencePhone = isMelodija ? '+371 20 000 000' : '+371 20 616 003';
  const residenceEmail = isMelodija ? 'rezidence.melodija@adoro.lv' : 'rezidence.sampeteris@adoro.lv';
  const residenceBank = isMelodija
    ? { name: 'AS "Swedbank"', account: 'LVXXSWEDXXXXXXXXXXXXXXX' }
    : { name: 'AS SEB Banka', account: 'LV60UNLA0055003546697' };

  // Checkbox helper component
  const Checkbox = ({ checked, label }) => (
    <div className="flex items-start gap-2">
      <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5 ${checked ? 'bg-gray-100' : ''}`}>
        {checked && <Check className="w-3 h-3 text-gray-700" />}
      </div>
      <span>{label}</span>
    </div>
  );

  // Get care level number (1-4 from GIR1-4)
  const careLevelNum = getCareLevelNumber(contract.careLevel);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle signing checkbox
  const handleSignedChange = (checked) => {
    setIsSigned(checked);
    if (checked && onMarkSigned) {
      onMarkSigned(contract);
    }
  };

  // Handle move-in (create resident)
  const handleMoveIn = async () => {
    if (!onMoveIn) return;
    setIsMovingIn(true);
    try {
      await onMoveIn(contract, lead);
    } finally {
      setIsMovingIn(false);
    }
  };

  // Check if resident already exists (contract has residentId from a previous move-in)
  const hasResident = !!contract.residentCreatedAt;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print controls - hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Atpakaļ
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Līgums: {contract.contractNumber || 'Melnraksts'}
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              <Printer className="w-5 h-5" />
              Drukāt
            </button>
          </div>
        </div>

        {/* Contract signing and move-in controls */}
        <div className="max-w-4xl mx-auto px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            {/* Signing checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSigned}
                onChange={(e) => handleSignedChange(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="font-medium text-gray-700">
                Līgums parakstīts
              </span>
              {isSigned && contract.signedAt && (
                <span className="text-sm text-gray-500">
                  ({new Date(contract.signedAt).toLocaleDateString('lv-LV')})
                </span>
              )}
            </label>

            {/* Move-in button */}
            {isSigned && !hasResident && contract.roomId && (
              <button
                onClick={handleMoveIn}
                disabled={isMovingIn}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isMovingIn ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iebraucina...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Iebraucināt rezidentu
                  </>
                )}
              </button>
            )}

            {/* Already moved in indicator */}
            {hasResident && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Rezidents iebraucināts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract document */}
      <div className="max-w-4xl mx-auto p-4 print:p-0 print:max-w-none">
        <div className="bg-white shadow-lg print:shadow-none p-8 print:p-12 text-sm leading-relaxed">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              LĪGUMS PAR SOCIĀLO PAKALPOJUMU NODROŠINĀŠANU
            </h1>
            <p className="text-lg font-semibold text-gray-700">
              Nr. {contract.contractNumber || '________________'}
            </p>
          </div>

          {/* Date and Location */}
          <div className="flex justify-between mb-6">
            <p>Rīgā</p>
            <p>{formatDate(contract.activatedAt || contract.startDate || contract.createdAt)}</p>
          </div>

          {/* Parties Introduction */}
          <div className="mb-6 space-y-3">
            <p>
              <strong>{residenceCompany}</strong>, reģistrācijas Nr. {residenceRegNr},
              juridiskā adrese: {residenceAddress}, turpmāk tekstā - <strong>Pakalpojuma sniedzējs</strong>, no vienas puses,
            </p>

            <p>
              <strong>{contract.residentName || '________________________'}</strong>,
              personas kods: <strong>{contract.residentPersonalCode || '________________________'}</strong>,
              deklarētā adrese: {contract.residentAddress || '________________________'},
              turpmāk tekstā - <strong>Klients</strong>,
              {contract.residentIsClient ? ' un' : ''}
            </p>

            {!contract.residentIsClient && contract.clientName && (
              <p>
                <strong>{contract.clientName}</strong>,
                personas kods: <strong>{contract.clientPersonalCode || '________________________'}</strong>,
                deklarētā adrese: {contract.clientAddress || '________________________'},
                {contract.clientRelationship && (
                  <span> ({contract.clientRelationship === 'child' ? 'dēls/meita' :
                    contract.clientRelationship === 'spouse' ? 'laulātais' :
                    contract.clientRelationship === 'guardian' ? 'pilnvarotā persona' :
                    contract.clientRelationship === 'social_worker' ? 'sociālais darbinieks' :
                    'cits'})</span>
                )},
                turpmāk tekstā – <strong>Apgādnieks</strong>,
              </p>
            )}

            <p>
              Pakalpojuma sniedzējs, Klients {!contract.residentIsClient && contract.clientName ? 'un Apgādnieks ' : ''}
              turpmāk tekstā visi kopā – Puses, noslēdz līgumu par sociālo pakalpojumu nodrošināšanu.
            </p>
          </div>

          {/* 1. LĪGUMA PRIEKŠMETS */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-4 border-b border-gray-300 pb-1">
              1. LĪGUMA PRIEKŠMETS
            </h2>

            {/* Contract summary table */}
            <div className="border border-gray-300 rounded overflow-hidden mb-4">
              <table className="w-full text-sm">
                <tbody>
                  {/* I. Pakalpojums */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium w-8">I.</td>
                    <td className="p-2 bg-gray-50 font-medium w-40">Pakalpojums</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={contract.termType === 'ilgtermiņa'} label="ilglaicīgs" />
                        <Checkbox checked={contract.termType === 'īstermiņa'} label="īslaicīgs" />
                      </div>
                    </td>
                  </tr>

                  {/* II. Mājoklis */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">II.</td>
                    <td className="p-2 bg-gray-50 font-medium">Mājoklis</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={contract.roomType === '1-vietīga'} label="vienvietīgs" />
                        <Checkbox checked={contract.roomType === '2-vietīga'} label="divvietīgs" />
                      </div>
                    </td>
                  </tr>

                  {/* III. Maksa */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">III.</td>
                    <td className="p-2 bg-gray-50 font-medium">Uzturēšanās maksa par vienu diennakti</td>
                    <td className="p-2">
                      <strong>
                        {contract.dailyRateWithDiscount
                          ? `EUR ${contract.dailyRateWithDiscount.toFixed(2)}`
                          : 'EUR ______'}
                      </strong>
                      {contract.discountPercent > 0 && (
                        <span className="text-gray-500 ml-2">
                          (ar {contract.discountPercent}% atlaidi, bāzes: {contract.dailyRate?.toFixed(2)} EUR)
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* IV. Drošības nauda */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">IV.</td>
                    <td className="p-2 bg-gray-50 font-medium">Drošības nauda</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={!contract.securityDeposit} label="nav" />
                        <Checkbox
                          checked={contract.securityDeposit}
                          label={`ir ${contract.securityDepositAmount ? `EUR ${contract.securityDepositAmount.toFixed(2)}` : '________'}`}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* V. Maksas termiņš */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">V.</td>
                    <td className="p-2 bg-gray-50 font-medium">Maksas par pirmo mēnesi apmaksas termiņš</td>
                    <td className="p-2">
                      {contract.paymentDeadline ? formatDate(contract.paymentDeadline) : '________________________'}
                    </td>
                  </tr>

                  {/* VI. Iestāšanās datums */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">VI.</td>
                    <td className="p-2 bg-gray-50 font-medium">Klienta iestāšanās datums</td>
                    <td className="p-2">
                      <strong>{formatDate(contract.startDate)}</strong>
                    </td>
                  </tr>

                  {/* VII. Līguma termiņš */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">VII.</td>
                    <td className="p-2 bg-gray-50 font-medium">Līguma termiņš</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={contract.noEndDate} label="beztermiņa" />
                        <Checkbox
                          checked={!contract.noEndDate}
                          label={`līdz ${contract.endDate ? formatDate(contract.endDate) : '________________'}`}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* VIII. Aprūpes līmenis */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">VIII.</td>
                    <td className="p-2 bg-gray-50 font-medium">Aprūpes līmenis / grupa</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={careLevelNum === 1} label="1" />
                        <Checkbox checked={careLevelNum === 2} label="2" />
                        <Checkbox checked={careLevelNum === 3} label="3" />
                        <Checkbox checked={careLevelNum === 4} label="4" />
                      </div>
                    </td>
                  </tr>

                  {/* IX. Veselības datu nodošana */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">IX.</td>
                    <td className="p-2 bg-gray-50 font-medium">Klients piekrīt veselības datu nodošanai Apgādniekam</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={contract.healthDataConsent} label="jā" />
                        <Checkbox checked={!contract.healthDataConsent} label="nē" />
                      </div>
                    </td>
                  </tr>

                  {/* X. Dokumentu glabāšana */}
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-medium">X.</td>
                    <td className="p-2 bg-gray-50 font-medium">Personas dokumentu glabāšana pie Pakalpojuma sniedzēja</td>
                    <td className="p-2">
                      <div className="flex gap-6">
                        <Checkbox checked={contract.storeIdDocuments} label="jā" />
                        <Checkbox checked={!contract.storeIdDocuments} label="nē" />
                      </div>
                    </td>
                  </tr>

                  {/* XI. Papildus pakalpojumi */}
                  <tr>
                    <td className="p-2 bg-gray-50 font-medium">XI.</td>
                    <td className="p-2 bg-gray-50 font-medium">Sniedzamie papildus pakalpojumi</td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-48">- Veļas mazgāšana un marķēšana:</span>
                          <div className="flex gap-4">
                            <Checkbox checked={contract.laundryService} label="jā" />
                            <Checkbox checked={!contract.laundryService} label="nē" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-48">- Podologs:</span>
                          <div className="flex gap-4">
                            <Checkbox
                              checked={contract.podologistService}
                              label={`jā${contract.podologistFrequency ? `, ${contract.podologistFrequency}x mēnesī` : ''}`}
                            />
                            <Checkbox checked={!contract.podologistService} label="nē" />
                          </div>
                        </div>
                        {contract.otherServices && (
                          <div className="flex items-center gap-2">
                            <span className="w-48">- Cits:</span>
                            <span>{contract.otherServices}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Room assignment if available */}
            {contract.roomNumber && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Piešķirtā istaba:</strong> Nr. {contract.roomNumber}
                {contract.bedNumber && contract.roomType === '2-vietīga' && `, gulta ${contract.bedNumber}`}
              </p>
            )}

            <p className="mb-2">
              1.2. Līgums tiek noslēgts par sociālās aprūpes, sociālās rehabilitācijas un citu sociālo pakalpojumu
              nodrošināšanu Klientam tādā apmērā un kārtībā, kā to paredz atbilstošie LR normatīvie akti.
            </p>

            <p>
              1.3. Pakalpojumi tiek nodrošināti Pakalpojuma sniedzēja valdījumā esošajās telpās, kas atrodas {residenceAddress}.
            </p>
          </div>

          {/* 2. LĪGUMA TERMIŅŠ */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-4 border-b border-gray-300 pb-1">
              2. LĪGUMA TERMIŅŠ UN LĪGUMA IZBEIGŠANAS NOTEIKUMI
            </h2>

            <div className="space-y-2">
              <p>2.1. Līgums ir spēkā no dienas, kad to ir parakstījušas Puses.</p>
              <p>2.2. Līguma termiņš ir noteikts atbilstoši 1.1. punktā minētajam.</p>
              <p>
                2.3. Puses vienojas, ka šis Līgums var tikt izbeigts saskaņā ar Līguma noteikumiem
                un piemērojamajiem LR normatīvajiem aktiem.
              </p>
            </div>
          </div>

          {/* 3. PAKALPOJUMA MAKSA */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-4 border-b border-gray-300 pb-1">
              3. PAKALPOJUMA MAKSA UN NORĒĶINU KĀRTĪBA
            </h2>

            <div className="space-y-2">
              <p>
                3.1. Pakalpojuma maksa par vienu diennakti ir{' '}
                <strong>
                  {contract.dailyRateWithDiscount
                    ? `EUR ${contract.dailyRateWithDiscount.toFixed(2)}`
                    : 'EUR ________'}
                </strong>.
              </p>

              <p>
                3.2. Ikmēneša maksājums tiek aprēķināts, pamatojoties uz faktiski pavadīto diennakšu skaitu.
              </p>

              <p>
                3.3. Rēķins tiek izrakstīts katra mēneša sākumā par iepriekšējo mēnesi.
                Maksājums jāveic 10 (desmit) darba dienu laikā no rēķina saņemšanas.
              </p>

              <p>3.4. Maksājumi veicami ar pārskaitījumu uz Pakalpojuma sniedzēja kontu:</p>
              <div className="ml-4 bg-gray-50 p-3 border border-gray-200 mt-2">
                <p>{residenceCompany}</p>
                <p>Reģ. Nr. {residenceRegNr}</p>
                <p>Banka: {residenceBank.name}</p>
                <p>Konta Nr.: {residenceBank.account}</p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="mb-8 p-3 bg-gray-50 border border-gray-200">
            <p className="font-medium mb-1">{residenceName}</p>
            <p>{residenceAddress}</p>
            <p>Tālrunis: {residencePhone}</p>
            <p>E-pasts: {residenceEmail}</p>
          </div>

          {/* Signatures Section */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <h2 className="text-base font-bold mb-8">
              PUŠU PARAKSTI
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* Provider */}
              <div>
                <p className="font-semibold mb-2">Pakalpojuma sniedzējs:</p>
                <p>{residenceCompany}</p>
                <p className="text-gray-600 mb-2">{residenceAddress}</p>
                <p className="text-gray-600 mb-16">Reģ. Nr. {residenceRegNr}</p>

                <div className="border-t border-gray-400 pt-2">
                  <p className="text-gray-500 text-xs">(paraksts, atšifrējums)</p>
                </div>
              </div>

              {/* Client */}
              <div>
                <p className="font-semibold mb-2">Klients:</p>
                <p>{contract.residentName || '________________________'}</p>
                <p className="text-gray-600 mb-2">
                  Personas kods: {contract.residentPersonalCode || '________________________'}
                </p>
                <p className="text-gray-600 mb-16">
                  {contract.residentAddress || '________________________'}
                </p>

                <div className="border-t border-gray-400 pt-2">
                  <p className="text-gray-500 text-xs">(paraksts, atšifrējums)</p>
                </div>
              </div>

              {/* Guardian if different */}
              {!contract.residentIsClient && contract.clientName && (
                <div className="col-span-2 mt-8">
                  <p className="font-semibold mb-2">Apgādnieks:</p>
                  <p>{contract.clientName}</p>
                  <p className="text-gray-600 mb-2">
                    Personas kods: {contract.clientPersonalCode || '________________________'}
                  </p>
                  <p className="text-gray-600 mb-16">
                    {contract.clientAddress || '________________________'}
                  </p>

                  <div className="border-t border-gray-400 pt-2 max-w-xs">
                    <p className="text-gray-500 text-xs">(paraksts, atšifrējums)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appendixes */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Līguma pielikumi:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>Pielikums Nr.1 – "Pakalpojumu apraksts"</li>
              <li>Pielikums Nr.2 – "Par samaksas apmēru un samaksas termiņiem"</li>
              <li>Pielikums Nr.3 – "Centra Iekšējās kārtības noteikumi"</li>
              <li>Pielikums Nr.4 – "Privātuma politika"</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Līgums sagatavots divos eksemplāros, pa vienam katrai Pusei.</p>
            <p className="mt-1">Abiem eksemplāriem ir vienāds juridisks spēks.</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
        }
      `}</style>
    </div>
  );
};

export default ContractPrintView;
