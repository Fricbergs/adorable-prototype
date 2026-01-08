# Administrācija (Administration)

**ClickUp Task:** AD-45 (Sadaļa - "Administrācija")
**Status:** In Progress

---

## Overview

Client onboarding and administration section. Manages:
- Client registration and profiles
- Contract creation
- Room/bed assignment
- Financial information
- Document attachments

---

## Subsections

### 1. Klientu saraksts (Client List)
**ClickUp ID:** AD-46 | **Status:** Test Stage

Client list view with search and filters.

---

### 2. Jauna klienta pievienošana (New Client Registration)
**ClickUp ID:** AD-47 | **Status:** Test Stage

New client registration flow.

---

### 3. Klients - Pamatinformācija (Client Basic Info)
**ClickUp ID:** AD-48 | **Status:** To Do (parent)

#### 3.1 Klienta forma (Client Form)
**AD-56** | Test Stage

Client information form fields.

#### 3.2 Istabas izvēle (Room Selection)
**AD-57** | Test Stage

Room and bed selection during onboarding.

**Attachment:** Adoro istabu pagaidu saraksts.csv

#### 3.3 Līguma izveide (Contract Creation)
**AD-58** | To Do

Contract generation and signing.

**Open Questions:**
- AD-64: Noskaidrot no Adoro - papildus darbības iekš preview bloka
- AD-65: Noskaidrot no Adoro - līguma papildinājuma/pielikuma šabloni

**Related:** AD-93 - Standartizēta līguma forma + formatēšanas ieteikumi

#### 3.4 Gultas vietu datubāzes izveide (Bed Database)
**AD-59** | To Do

Database of beds, rooms, and pricing.

**Attachment:** Cenrādis 2026 Adorable.xlsx

#### 3.5 Vairāku rezidentu piesaiste vienam klientam
**AD-66** | To Do

Multiple residents linked to one client.

---

### 4. Klients - Komunikācija (Client Communication)
**ClickUp ID:** AD-49 | **Status:** Test Stage

Communication log with client.

---

### 5. Klients - Finansējums (Client Financing)
**ClickUp ID:** AD-50 | **Status:** Test Stage

Financial information and billing.

**Related Tasks:**
- AD-72: Rīgas Domes līdzfinansējuma pieteikšana
- AD-88: RD līdzfinansējuma atspoguļošana rēķinā

---

### 6. Klients - Pielikumi (Client Attachments)
**ClickUp ID:** AD-51 | **Status:** Test Stage

Document attachments management.

---

## Care Level Determination Process

**From AD-86:**

```
Līgumā (punkts 2.1 un 2.6) paredzēts, ka aprūpes līmenis var mainīties:
- Pirmās 10 darba dienas pēc iestāšanās
- Ik pēc 3 mēnešiem (vai reizi pusgadā ilgtermiņa līgumiem)
- AGGIR skala (GIR1-GIR6) tiek izmantota novērtēšanai

Process flow:
1. Pieteikuma stadijā → Aptuvens aprūpes līmenis
2. Pirmās 10 dienas rezidencē → Precīzs aprūpes līmenis (AGGIR)
3. Ik pēc 3 mēnešiem → Pārvērtēšana (ar iespēju mainīt cenu)
```

---

## Prototype Status

### Built (Onboarding Flow)
- NewLeadForm.jsx - Initial lead capture
- LeadDetailsView.jsx - Lead details
- ConsultationStep.jsx - Care level, room type selection
- SurveyView.jsx - Client survey
- OfferReviewView.jsx - Review before agreement
- AgreementSuccess.jsx - Agreement confirmation
- BedBookingView.jsx - Bed assignment

### Missing from Prototype
- Full contract generation (PDF)
- Contract templates and annexes
- Multiple residents per client
- Riga City co-financing integration
- Moneo integration (AD-92)

---

## Open Questions

1. **AD-64:** Papildus darbības iekš preview bloka?
2. **AD-65:** Līguma pielikuma šabloni?
3. **AD-80:** Jautājumi par Administrācijas sadaļu (Closed)
4. **AD-86:** Aprūpes līmeņa noteikšanas process

---

## Related Documents (ClickUp)

- Agreement System - Data Model & Implementation Guide
- Prototipa progress 22.12, 23.12
- Projekta informācija
- MVP production

---

*Source: ClickUp AD-45 and subtasks*
