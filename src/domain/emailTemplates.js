/**
 * Email template generator functions
 * Generates email content based on scenario (in-person vs remote)
 */

/**
 * Generate email for in-person scenario (review mode)
 * Customer visited, admin filled survey, sending for review only
 */
export const generateInPersonEmail = (lead) => {
  const reviewUrl = `${window.location.origin}/adorable-prototype/review/${lead.id}`;

  return {
    subject: `Apstiprināšanai: Jūsu informācija par uzturēšanos Adoro Šampēteris`,
    body: `
Labdien, ${lead.firstName} ${lead.lastName}!

Paldies, ka apmeklējāt mūsu iestādi un izvēlējāties Adoro aprūpes centru.

Pēc mūsu sarunas esam sagatavojuši Jūsu informācijas kopsavilkumu. Lūdzu pārskatiet to un pārliecinieties, ka visa informācija ir pareiza.

📋 JŪSU IZVĒLE:
━━━━━━━━━━━━━━━━━━━━━━
• Aprūpes līmenis: ${lead.consultation?.careLevel}. līmenis
• Uzturēšanās: ${lead.consultation?.duration === 'long' ? 'Ilglaicīga (virs 3 mēnešiem)' : 'Īslaicīga (līdz 3 mēnešiem)'}
• Istabas veids: ${lead.consultation?.roomType === 'single' ? 'Vienvietīga istaba' : 'Divvietīga istaba'}
• Cena: ${lead.consultation?.price} € dienā

🔍 PĀRSKATĪT INFORMĀCIJU:
${reviewUrl}

SVARĪGI: Šis ir tikai informācijas apskates režīms. Ja pamanāt kļūdu vai vēlaties ko mainīt, lūdzu sazinieties ar mums:
• E-pasts: info@adoro.lv
• Tālrunis: +371 67 123 456

Ja visa informācija ir pareiza, mēs turpināsim līguma sagatavošanu un sazināsimies ar Jums tuvākajā laikā.

Ar cieņu,
Adoro komanda

━━━━━━━━━━━━━━━━━━━━━━
Adoro Šampēteris | Aprūpes centrs
www.adoro.lv | rezidence.sampeteris@adoro.lv
    `.trim()
  };
};

/**
 * Generate email for remote scenario (fillable mode)
 * Customer contacted remotely, needs to fill questionnaire
 */
export const generateRemoteEmail = (lead) => {
  const fillUrl = `${window.location.origin}/adorable-prototype/fill/${lead.id}`;

  return {
    subject: `Lūdzu aizpildiet anketu - Adoro Šampēteris`,
    body: `
Labdien, ${lead.firstName} ${lead.lastName}!

Paldies par interesi par Adoro aprūpes centru. Pēc mūsu sarunas lūdzam Jūs aizpildīt nepieciešamo informāciju līguma sagatavošanai.

📋 JŪSU IZVĒLĒTAIS PAKALPOJUMS:
━━━━━━━━━━━━━━━━━━━━━━
• Aprūpes līmenis: ${lead.consultation?.careLevel}. līmenis
• Uzturēšanās: ${lead.consultation?.duration === 'long' ? 'Ilglaicīga (virs 3 mēnešiem)' : 'Īslaicīga (līdz 3 mēnešiem)'}
• Istabas veids: ${lead.consultation?.roomType === 'single' ? 'Vienvietīga istaba' : 'Divvietīga istaba'}
• Cena: ${lead.consultation?.price} € dienā

✍️ AIZPILDĪT ANKETU:
${fillUrl}

Anketā būs jānorāda:
• Rezidenta personiskā informācija
• Adrese un kontaktinformācija
• Veselības informācija (invaliditāte, uzturēšanās datumi)
• Ja līgumu parakstīs radinieks - arī viņa informācija

⏱️ Lūdzu aizpildiet anketu 3 darba dienu laikā.

Ja rodas jautājumi par anketas aizpildīšanu, sazinieties ar mums:
• E-pasts: info@adoro.lv
• Tālrunis: +371 67 123 456

Pēc anketas saņemšanas 2 darba dienu laikā sagatavojam līgumu un sazināsimies ar Jums.

Ar cieņu,
Adoro komanda

━━━━━━━━━━━━━━━━━━━━━━
Adoro Šampēteris | Aprūpes centrs
www.adoro.lv | rezidence.sampeteris@adoro.lv
    `.trim()
  };
};

/**
 * Generate appropriate email based on fillScenario
 */
export const generateEmail = (lead) => {
  if (!lead.consultation) {
    throw new Error('Lead must have consultation data to generate email');
  }

  const fillScenario = lead.consultation.fillScenario;

  if (fillScenario === 'in-person') {
    return generateInPersonEmail(lead);
  } else if (fillScenario === 'remote') {
    return generateRemoteEmail(lead);
  } else {
    throw new Error(`Unknown fillScenario: ${fillScenario}`);
  }
};

/**
 * Generate email for queue offer (bed available notification)
 * Sent when a spot becomes available for someone in queue
 */
export const generateQueueOfferEmail = (lead, queuePosition) => {
  return {
    subject: `Laba ziņa! Vieta pieejama - Adoro Šampēteris`,
    body: `
Labdien, ${lead.firstName} ${lead.lastName}!

Mums ir lieliska ziņa - Adoro Šampēteris aprūpes centrā ir atbrīvojusies vieta, kas atbilst Jūsu vajadzībām!

📋 JŪSU REZERVĀCIJA:
━━━━━━━━━━━━━━━━━━━━━━
• Aprūpes līmenis: ${lead.consultation?.careLevel}. līmenis
• Istabas veids: ${lead.consultation?.roomType === 'single' ? 'Vienvietīga istaba' : lead.consultation?.roomType === 'double' ? 'Divvietīga istaba' : 'Trīsvietīga istaba'}
• Cena: ${lead.consultation?.price} € dienā
• Jūsu pozīcija rindā: #${queuePosition}

🏠 PIEEJAMĀ VIETA:
Vieta ir pieejama tuvākajā laikā. Lai apstiprinātu savu rezervāciju, lūdzu sazinieties ar mums 3 darba dienu laikā.

⚠️ SVARĪGI: Ja nesazināsieties noteiktajā termiņā, piedāvājums tiks nodots nākamajam rindā.

📞 KĀ APSTIPRINĀT:
• Zvaniet: +371 20 616 003
• Rakstiet: rezidence.sampeteris@adoro.lv

Mēs priecāsimies Jūs sagaidīt!

Ar cieņu,
Adoro komanda

━━━━━━━━━━━━━━━━━━━━━━
Adoro Šampēteris | Aprūpes centrs
Zolitūdes iela 68A, Rīga
www.adoro.lv | rezidence.sampeteris@adoro.lv
    `.trim()
  };
};
