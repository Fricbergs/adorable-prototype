# Adoro Client Intake - Status Flow Diagram

```mermaid
flowchart TD
    Start([User Submits Form]) --> Prospect

    Prospect["📋 STATUS: PROSPECT<br/>Badge: Pieteikums (Orange)<br/>View: LeadDetailsView<br/><br/>Data:<br/>• firstName, lastName<br/>• email, phone<br/>• comment"]

    Prospect -->|Click 'Start Consultation'| Consultation[["⚙️ ConsultationStep View<br/><br/>Gather:<br/>• Care level (1-4)<br/>• Duration (long/short)<br/>• Room type (single/double)<br/>• Dementia checkbox<br/>• Internal notes<br/>• Fill scenario (in-person/remote)"]]

    Consultation -->|Save as 'Klients'| OfferSent

    OfferSent["📧 STATUS: OFFER_SENT<br/>Badge: Piedāvājums (Yellow)<br/>View: WaitingForDecision<br/><br/>Data:<br/>• consultation object<br/>• calculated price<br/><br/>Has 2 branches based on<br/>fillScenario"]

    OfferSent -->|fillScenario = 'in-person'<br/>Customer visited| InPersonPath{{"🏢 IN-PERSON PATH<br/>Admin fills survey<br/>immediately"}}

    OfferSent -->|fillScenario = 'remote'<br/>Phone/email only| RemotePath{{"📱 REMOTE PATH<br/>Send email<br/>Customer fills later"}}

    InPersonPath -->|Click 'Aizpildīt aptauju'| Survey
    RemotePath -->|Send email, then click<br/>'Aizpildīt aptauju'| Survey

    OfferSent -->|Click 'Pievienot rindai'<br/>No space available| Queue1

    Survey[["📝 SurveyView<br/><br/>Admin fills:<br/>• Resident details (personal code, address, etc)<br/>• Disability info<br/>• Stay dates<br/>• Signer scenario (resident/relative)<br/>• Client details (if relative signs)"]]

    Survey -->|Submit survey| SurveyFilled

    SurveyFilled["✅ STATUS: SURVEY_FILLED<br/>Badge: Anketa (Purple)<br/>View: OfferReviewView<br/><br/>Data:<br/>• Full survey data<br/>• Resident info<br/>• Client/signer info"]

    SurveyFilled -->|Click 'Izveidot līgumu'<br/>Customer agrees| Agreement
    SurveyFilled -->|Click 'Pievienot rindai'<br/>No space available| Queue2

    Agreement["📄 STATUS: AGREEMENT<br/>Badge: Līgums (Green)<br/>View: AgreementSuccess<br/><br/>Data:<br/>• Generated agreementNumber<br/>• Full HTML agreement template<br/><br/>Actions:<br/>• View/Print agreement<br/>• Download PDF<br/>• View list<br/>• Add new lead"]

    Queue1["📋 STATUS: QUEUE<br/>Badge: Rindā (Blue)<br/>View: QueueSuccess<br/><br/>From WaitingForDecision"]
    Queue2["📋 STATUS: QUEUE<br/>Badge: Rindā (Blue)<br/>View: QueueSuccess<br/><br/>From OfferReviewView"]

    Queue1 --> QueueEnd([Customer waits for space])
    Queue2 --> QueueEnd
    Agreement --> End([Process Complete])

    style Prospect fill:#fed7aa,stroke:#ea580c,stroke-width:3px
    style OfferSent fill:#fef08a,stroke:#ca8a04,stroke-width:3px
    style SurveyFilled fill:#e9d5ff,stroke:#9333ea,stroke-width:3px
    style Agreement fill:#bbf7d0,stroke:#16a34a,stroke-width:3px
    style Queue1 fill:#bfdbfe,stroke:#2563eb,stroke-width:3px
    style Queue2 fill:#bfdbfe,stroke:#2563eb,stroke-width:3px

    style Consultation fill:#f3f4f6,stroke:#6b7280,stroke-width:2px
    style Survey fill:#f3f4f6,stroke:#6b7280,stroke-width:2px
    style InPersonPath fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style RemotePath fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
```

## Status Summary

| Status | Badge Text | Color | View | Description |
|--------|-----------|-------|------|-------------|
| **prospect** | Pieteikums | 🟠 Orange | LeadDetailsView | Initial contact form submitted |
| **consultation** | Konsultācija | 🟡 Yellow | WaitingForDecision | Consultation completed (offer may be sent via email) |
| **survey_filled** | Anketa | 🟣 Purple | OfferReviewView | Survey/questionnaire filled |
| **agreement** | Līgums | 🟢 Green | AgreementSuccess | Agreement created |
| **queue** | Rindā | 🔵 Blue | QueueSuccess | Added to waiting queue |

## Key Decision Points

### 1. Fill Scenario Selection (at Consultation)
- **In-Person**: Customer visited facility → Admin fills survey immediately
- **Remote**: Phone/email contact → Send email, wait for customer to fill (or admin fills later)

### 2. After Survey Filled
- **Customer Agrees** → Create Agreement (generates agreement number)
- **No Space Available** → Add to Queue

### 3. Alternative Path
- **Directly from Offer** → Can add to queue without filling survey if clearly no space

## Data Flow

```
prospect
  └─ firstName, lastName, email, phone, comment

consultation
  └─ All prospect data +
     └─ consultation {
          careLevel, duration, roomType,
          hasDementia, notes, fillScenario, price
        }
     └─ emailSent (boolean, if offer email was sent)

survey_filled
  └─ All offer_sent data +
     └─ survey {
          Resident: personal code, birth date, address, gender, disability, stay dates
          Signer scenario: resident | relative
          Client (if relative): client details, relationship
        }

agreement
  └─ All survey_filled data +
     └─ agreementNumber (e.g., "2025-001")

queue
  └─ All consultation data
     └─ Waiting for available space
```

## Notes

- **Email Integration**: Email sending is tracked with `emailSent`, `emailSentDate`, `emailSentTime`
- **Facility**: Hardcoded to "Adoro Šampēteris" (single facility mode)
- **Pricing**: Automatically calculated based on care level + duration + room type + dementia
