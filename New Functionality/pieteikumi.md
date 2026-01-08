# Pieteikumu Flow Analīze

## Statusi

| Status | Latvieši | Apraksts |
|--------|----------|----------|
| `prospect` | Pieteikums | Jauns pieteikums, gaida konsultāciju |
| `consultation` | Konsultācija | Konsultācija pabeigta |
| `survey_filled` | Anketa aizpildīta | Dati savākti, gatavs līgumam |
| `agreement` | Līgums | Līgums izveidots |
| `queue` | Rinda | Gaida brīvu vietu |
| `cancelled` | Atcelts | Atcelts (neatgriezenisks) |

---

## Galvenie Flowi

### 1. Happy Path → Līgums

```
NewLeadForm → LeadDetailsView [PROSPECT]
    ↓ Sākt konsultāciju
ConsultationStep → WaitingForDecision [CONSULTATION]
    ↓ Aizpildīt aptauju
SurveyView → OfferReviewView [SURVEY_FILLED]
    ↓ Izveidot līgumu
AgreementSuccess [AGREEMENT]
    ↓ (optional) Rezervēt gultas vietu
BedBookingView → AgreementSuccess
```

**Soļi:**
1. **NewLeadForm** - ievada klienta kontaktinformāciju (vārds, uzvārds, e-pasts, telefons, komentārs)
2. **LeadDetailsView** - apskata pieteikumu, var sākt konsultāciju vai atcelt
3. **ConsultationStep** - izvēlas aprūpes līmeni, ilgumu, istabas tipu, demences statusu
4. **WaitingForDecision** - apskata piedāvājumu, var aizpildīt aptauju vai pievienot rindai
5. **SurveyView** - aizpilda detalizētu anketu (rezidenta dati, līguma dati, pakalpojumi, parakstītājs)
6. **OfferReviewView** - pārskata visus datus, var izveidot līgumu vai pievienot rindai
7. **AgreementSuccess** - līgums izveidots ar līguma numuru, var rezervēt gultas vietu
8. **BedBookingView** - izvēlas istabu un gultu rezidentam

---

### 2. Rindas Path → Queue → Līgums

```
WaitingForDecision vai OfferReviewView
    ↓ Pievienot rindai
QueueSuccess [QUEUE]
    ↓ (gaida brīvu vietu)
QueueListView → Nosūtīt piedāvājumu
    ↓ Klients pieņem
AgreementSuccess [AGREEMENT]
```

**Rindas dati:**
- `queuedDate`, `queuedTime` - kad pievienots rindai
- `queueOfferSent` - vai piedāvājums nosūtīts
- `queueOfferSentDate`, `queueOfferSentTime` - kad piedāvājums nosūtīts
- `acceptedFromQueueDate`, `acceptedFromQueueTime` - kad pieņemts no rindas

**Rindas pozīcija:**
- Aprēķina ar `calculateQueuePosition()` - dinamiski pēc rindas datuma
- Rāda gaidīšanas dienas ar `calculateDaysInQueue()`

---

### 3. Atcelšana (no jebkura posma)

```
Jebkurš aktīvs statuss
    ↓ Atcelt pieteikumu
CancelModal (iemesls + piezīmes)
    ↓
[CANCELLED] - read-only, nevar atkārtoti atvērt
```

**Atcelšana iespējama no:**
- LeadDetailsView (PROSPECT)
- WaitingForDecision (CONSULTATION)
- OfferReviewView (SURVEY_FILLED)
- AgreementSuccess (AGREEMENT)
- QueueSuccess (QUEUE)
- QueueListView (QUEUE)

**Atcelšanas dati:**
```javascript
cancellation: {
  reason: 'Iemesla teksts',
  notes: 'Papildus piezīmes',
  date: '2025-01-08',
  time: '14:30'
}
```

---

## Zarošanās Punkti

| Solis | Izvēles |
|-------|---------|
| **LeadDetailsView** | Sākt konsultāciju \| Atcelt |
| **WaitingForDecision** | Aizpildīt aptauju \| Pievienot rindai \| Atcelt |
| **OfferReviewView** | Izveidot līgumu \| Pievienot rindai \| Atcelt |
| **AgreementSuccess** | Rezervēt gultu \| Skatīt sarakstu \| Pievienot jaunu |
| **QueueListView** | Pieņemt piedāvājumu \| Nosūtīt piedāvājumu \| Atcelt |

---

## Gala Rezultāti

| Gala stāvoklis | Apraksts | Turpmākās darbības |
|----------------|----------|-------------------|
| **AGREEMENT** | Līgums izveidots | Var rezervēt gultu, var atcelt |
| **QUEUE** | Gaida rindā | Var pieņemt piedāvājumu vai atcelt |
| **CANCELLED** | Beigu stāvoklis | Nevar mainīt, tikai lasāms |

---

## Vizuālā Diagramma

```
                    ┌─────────────────────────────────────┐
                    │           NewLeadForm               │
                    └──────────────┬──────────────────────┘
                                   ↓
                    ┌─────────────────────────────────────┐
                    │   LeadDetailsView [PROSPECT]        │──→ [CANCELLED]
                    └──────────────┬──────────────────────┘
                                   ↓
                    ┌─────────────────────────────────────┐
                    │   ConsultationStep                  │
                    └──────────────┬──────────────────────┘
                                   ↓
                    ┌─────────────────────────────────────┐
                    │ WaitingForDecision [CONSULTATION]   │──→ [CANCELLED]
                    └───────┬─────────────────┬───────────┘
                            ↓                 ↓
              ┌─────────────────┐    ┌─────────────────┐
              │   SurveyView    │    │  QueueSuccess   │──→ [CANCELLED]
              └────────┬────────┘    │    [QUEUE]      │
                       ↓             └────────┬────────┘
              ┌─────────────────┐             │
              │ OfferReviewView │──→ [CANCELLED]
              │ [SURVEY_FILLED] │             │
              └───────┬───┬─────┘             │
                      │   └───────────────────┤
                      ↓                       ↓
              ┌─────────────────────────────────────────┐
              │        AgreementSuccess [AGREEMENT]     │──→ [CANCELLED]
              └───────────────────┬─────────────────────┘
                                  ↓ (optional)
              ┌─────────────────────────────────────────┐
              │           BedBookingView                │
              └─────────────────────────────────────────┘
```

---

## Konsultācijas Scenāriji

### Klātienē (in-person)
```
ConsultationStep [fillScenario = 'in-person']
    ↓
WaitingForDecision
    ↓ Var uzreiz aizpildīt aptauju
SurveyView
    ↓
OfferReviewView
    ↓ Var nosūtīt e-pastu klientam (optional)
    ↓
AgreementSuccess
```

### Attālināti (remote)
```
ConsultationStep [fillScenario = 'remote']
    ↓
WaitingForDecision
    ↓ Jānosūta e-pasts klientam
    ↓ Nosūtīt e-pastu → emailSent = true
    ↓
    ↓ [Opcija 1: Admins aizpilda vēlāk]
    ↓→ SurveyView → OfferReviewView → AgreementSuccess
    ↓
    ↓ [Opcija 2: Klients aizpilda caur e-pasta saiti (nākotnes funkcija)]
    ↓→ OfferCustomerView → OfferReviewView → AgreementSuccess
```

---

## Cenu Aprēķins

Cena tiek aprēķināta `ConsultationStep` posmā:

```javascript
calculatePrice({
  careLevel: 'GIR1' | 'GIR2' | 'GIR3' | 'GIR4',
  duration: 'ilgtermiņa' | 'īstermiņa' | 'dienas',
  roomType: 'vienvietīga' | 'divvietīga'
})
```

Rezultāts: `X €/dienā`

---

## Saistītie Faili

| Fails | Apraksts |
|-------|----------|
| `src/constants/steps.js` | STEPS un STATUS konstantes |
| `src/App.jsx` | Navigācijas loģika un handleri |
| `src/domain/leadHelpers.js` | Biznesa loģika (createProspect, upgradeToLead, addToQueue, utt.) |
| `src/domain/pricing.js` | Cenu aprēķins |
| `src/domain/validation.js` | Formu validācija |
| `src/views/NewLeadForm.jsx` | Jauna pieteikuma forma |
| `src/views/LeadDetailsView.jsx` | Pieteikuma detaļas |
| `src/views/ConsultationStep.jsx` | Konsultācijas solis |
| `src/views/WaitingForDecision.jsx` | Gaidīšanas/lēmuma skats |
| `src/views/SurveyView.jsx` | Aptaujas/anketas forma |
| `src/views/OfferReviewView.jsx` | Piedāvājuma pārskats |
| `src/views/AgreementSuccess.jsx` | Līguma veiksmīga izveide |
| `src/views/QueueSuccess.jsx` | Pievienošana rindai |
| `src/views/QueueListView.jsx` | Rindas pārvaldība |
| `src/views/BedBookingView.jsx` | Gultas rezervācija |
