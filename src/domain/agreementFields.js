/**
 * Field configurations for the Offer & Agreement form
 * Defines structure, labels, and requirements for Resident and Client sections
 */

export const RESIDENT_FIELDS = [
  {
    id: 'identity_group',
    title: 'Identitāte',
    fields: [
      { name: 'firstName', label: 'Vārds', type: 'text', required: true },
      { name: 'lastName', label: 'Uzvārds', type: 'text', required: true }
    ]
  },
  {
    id: 'contacts_group',
    title: 'Kontakti',
    fields: [
      { name: 'phone', label: 'Tālrunis', type: 'tel', required: true },
      { name: 'email', label: 'E-pasts', type: 'email', required: false }
    ]
  },
  {
    id: 'legal_group',
    title: 'Personas dati',
    fields: [
      { name: 'birthDate', label: 'Dzimšanas datums', type: 'date', required: true },
      { name: 'personalCode', label: 'Personas kods', type: 'text', required: true, placeholder: '123456-12345' }
    ]
  },
  {
    id: 'address_group',
    title: 'Deklarētā dzīvesvieta',
    fields: [
      { name: 'street', label: 'Iela, māja, dzīvoklis', type: 'text', required: true, placeholder: 'piemēram: Brīvības iela 123-45' },
      { name: 'city', label: 'Pilsēta', type: 'text', required: true, placeholder: 'piemēram: Rīga' },
      { name: 'postalCode', label: 'Pasta indekss', type: 'text', required: true, placeholder: 'LV-1010' }
    ]
  },
  {
    id: 'attributes_group',
    title: 'Papildu dati',
    fields: [
      {
        name: 'gender',
        label: 'Dzimums',
        type: 'select',
        required: true,
        options: [
          { value: 'male', label: 'Vīrietis' },
          { value: 'female', label: 'Sieviete' }
        ]
      },
      {
        name: 'disabilityGroup',
        label: 'Invaliditātes grupa',
        type: 'select',
        required: false,
        options: [
          { value: 'none', label: 'Nav' },
          { value: '1', label: '1. grupa' },
          { value: '2', label: '2. grupa' },
          { value: '3', label: '3. grupa' }
        ]
      }
    ]
  },
  {
    id: 'terms_group',
    title: 'Termiņi',
    fields: [
      { name: 'disabilityDateFrom', label: 'Invaliditāte no', type: 'date', required: false },
      { name: 'disabilityDateTo', label: 'Invaliditāte līdz', type: 'date', required: false },
      { name: 'stayDateFrom', label: 'Plānotais sākuma datums', type: 'date', required: true },
      { name: 'stayDateTo', label: 'Plānotais beigu datums', type: 'date', required: false, helper: 'Atstāt tukšu, ja beztermiņa' }
    ]
  },
  {
    id: 'contract_terms_group',
    title: 'Līguma papildus noteikumi',
    fields: [
      {
        name: 'securityDeposit',
        label: 'Drošības nauda',
        type: 'select',
        required: false,
        options: [
          { value: 'no', label: 'Nav' },
          { value: 'yes', label: 'Ir' }
        ]
      },
      { name: 'securityDepositAmount', label: 'Drošības naudas summa (EUR)', type: 'number', required: false, placeholder: '0.00' },
      { name: 'paymentDeadline', label: 'Maksas termiņš', type: 'date', required: false, helper: 'Maksas par pirmo mēnesi termiņš' },
      {
        name: 'healthDataConsent',
        label: 'Veselības datu nodošana apgādniekam',
        type: 'select',
        required: false,
        options: [
          { value: 'yes', label: 'Jā' },
          { value: 'no', label: 'Nē' }
        ],
        helper: 'Automātiski "Jā", ja līgumu paraksta radinieks'
      },
      {
        name: 'storeIdDocuments',
        label: 'Personas dokumentu glabāšana',
        type: 'select',
        required: false,
        options: [
          { value: 'yes', label: 'Jā - glabāt pie pakalpojuma sniedzēja' },
          { value: 'no', label: 'Nē - glabāt pie klienta' }
        ]
      }
    ]
  },
  {
    id: 'additional_services_group',
    title: 'Papildus pakalpojumi',
    fields: [
      {
        name: 'laundryService',
        label: 'Veļas mazgāšana un marķēšana',
        type: 'select',
        required: false,
        options: [
          { value: 'no', label: 'Nē' },
          { value: 'yes', label: 'Jā' }
        ]
      },
      {
        name: 'podologistService',
        label: 'Podologs',
        type: 'select',
        required: false,
        options: [
          { value: 'no', label: 'Nē' },
          { value: 'yes', label: 'Jā' }
        ]
      },
      { name: 'podologistFrequency', label: 'Podologa apmeklējumu skaits mēnesī', type: 'number', required: false, placeholder: '1' },
      {
        name: 'otherServicesEnabled',
        label: 'Citi papildus pakalpojumi',
        type: 'select',
        required: false,
        options: [
          { value: 'no', label: 'Nē' },
          { value: 'yes', label: 'Jā' }
        ]
      },
      { name: 'otherServices', label: 'Citu pakalpojumu apraksts', type: 'text', required: false, placeholder: 'Aprakstiet nepieciešamos pakalpojumus' }
    ]
  }
];

export const CLIENT_FIELDS = [
  {
    id: 'client_identity_group',
    title: 'Identitāte',
    fields: [
      { name: 'clientFirstName', label: 'Vārds', type: 'text', required: true },
      { name: 'clientLastName', label: 'Uzvārds', type: 'text', required: true }
    ]
  },
  {
    id: 'client_relation_group',
    title: 'Statuss',
    fields: [
      {
        name: 'relationship',
        label: 'Radniecība / Statuss',
        type: 'select',
        required: true,
        options: [
          { value: 'child', label: 'Dēls / Meita' },
          { value: 'spouse', label: 'Laulātais' },
          { value: 'guardian', label: 'Pilnvarotā persona' },
          { value: 'social_worker', label: 'Sociālais darbinieks' },
          { value: 'other', label: 'Cits' }
        ]
      }
    ]
  },
  {
    id: 'client_contacts_group',
    title: 'Kontakti',
    fields: [
      { name: 'clientPhone', label: 'Tālrunis', type: 'tel', required: true },
      { name: 'clientEmail', label: 'E-pasts', type: 'email', required: true, helper: 'Nepieciešams līguma komunikācijai' }
    ]
  },
  {
    id: 'client_address_group',
    title: 'Deklarētā dzīvesvieta',
    fields: [
      { name: 'clientStreet', label: 'Iela, māja, dzīvoklis', type: 'text', required: true, placeholder: 'piemēram: Brīvības iela 123-45' },
      { name: 'clientCity', label: 'Pilsēta', type: 'text', required: true, placeholder: 'piemēram: Rīga' },
      { name: 'clientPostalCode', label: 'Pasta indekss', type: 'text', required: true, placeholder: 'LV-1010' }
    ]
  },
  {
    id: 'client_legal_group',
    title: 'Personas dati',
    fields: [
      { name: 'clientPersonalCode', label: 'Personas kods', type: 'text', required: true, placeholder: '123456-12345' }
    ]
  }
];
