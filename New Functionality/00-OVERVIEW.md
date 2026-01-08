# Adorable - Project Overview

## About
Adorable is a care facility management system for Latvian elderly care homes (Adoro). The UI is entirely in Latvian.

## Main Menu Sections

| Section | Latvian Name | ClickUp ID | Status |
|---------|--------------|------------|--------|
| Residents | Rezidenti | AD-10 | Partially Built |
| Administration | Administrācija | AD-45 | In Progress |
| Bed Fund | Gultu fonds | AD-60 | To Do |
| Medication Inventory | Zāļu noliktava | AD-69 | To Do |
| Prescriptions | Ordinācijas | AD-17 | Partially Built |
| Reports | Atskaites | AD-90 | Not Started |

---

## Gap Analysis Summary

### What's Built in Prototype

| Feature | Status | Notes |
|---------|--------|-------|
| Resident List View | Built | Basic list with filters |
| Resident Profile (Tabs) | Built | Pamatinfo, Izmitināšana, Ordinācijas tabs |
| Prescriptions Module | Built | Today/Week/History views, refusal workflow |
| Medication Inventory | Built | Bulk inventory, XML import, resident inventory |
| Room Management | Built | Room cards, bed availability |
| Bed Booking | Built | Part of onboarding flow |
| Client Onboarding | Built | Lead -> Consultation -> Survey -> Agreement flow |
| Queue Management | Built | Waiting list functionality |

### What's Missing (from ClickUp)

| Feature | ClickUp ID | Priority |
|---------|------------|----------|
| Līguma izveide (Agreement creation) | AD-58 | High |
| Gultas vietu datubāze | AD-59, AD-61 | High |
| Vairāku rezidentu piesaiste klientam | AD-66 | Medium |
| 18 Required Reports | AD-90 | High |
| Tenure of Stay KPI | AD-79 | Medium |
| Aprūpes līmeņa noteikšanas process | AD-86 | High |
| RD līdzfinansējuma pieteikšana | AD-72 | Medium |
| Moneo integrācija | AD-92 | Low |
| Ordinācijas plāns printēšana | AD-67 | Medium |
| Zāļu mērvienības | AD-68 | Low |

### In Test Stage (Ready for Review)

Many resident profile subsections are in "test stage" status in ClickUp:
- Diagnozes, Māsas apskate, Ārsta apskate
- Psihiatra apskate, Fizioterapeita apskate
- Rezidenta parametri, Braden/Morse/Bartela scales
- Vakcinācija, Tehniskie palīglīdzekļi
- Aprūpes līmeņa noteikšana
- Psihologa atzinums/konsultācija
- Social care plan forms
- Client forms (Komunikācija, Finansējums, Pielikumi)

---

## ClickUp Project Structure

```
Adorable (Space ID: 90154759115)
├── Development (List)
│   ├── AD-10: Sadaļa - "Rezidenti"
│   ├── AD-45: Sadaļa - "Administrācija"
│   ├── AD-60: Sadaļa "Gultu fonds"
│   ├── AD-69: Sadaļa "Zāļu noliktava"
│   └── AD-72: Rīgas Domes līdzfinansējums
│
└── Pieteikumi (List - Requests)
    ├── AD-79: Tenure of Stay rādītājs
    ├── AD-86: Aprūpes līmeņa noteikšanas process
    ├── AD-88: RD līdzfinansējuma atspoguļošana
    ├── AD-90: Minimālais atskaišu saraksts (18)
    ├── AD-92: Moneo integrācijas kontakti
    └── AD-93: Standartizēta līguma forma
```

---

## Documentation Files

| File | Content |
|------|---------|
| [01-REZIDENTI.md](./01-REZIDENTI.md) | Resident management section |
| [02-ADMINISTRACIJA.md](./02-ADMINISTRACIJA.md) | Client administration/onboarding |
| [03-GULTU-FONDS.md](./03-GULTU-FONDS.md) | Bed/room management |
| [04-ZALU-NOLIKTAVA.md](./04-ZALU-NOLIKTAVA.md) | Medication inventory |
| [05-ORDINACIJAS.md](./05-ORDINACIJAS.md) | Prescriptions module |
| [06-ATSKAITES.md](./06-ATSKAITES.md) | Reports (18 required) |

---

## Key Stakeholders (from ClickUp)

- **Kristens Blūms** - Project lead, requirements
- **Gints Fricbergs** - Business requirements, Pieteikumi
- **Ivo Zibens** - Development
- **Edžus Kašs** - Development
- **Ivars Šaudinis** - Development
- **Anna** - Business requirements (Adoro)

---

## Technical Stack (Prototype)

- React 18 + Vite
- Tailwind CSS
- localStorage for persistence
- Lucide React icons

---

*Last updated: 2025-01-08*
*Source: ClickUp Adorable project*
