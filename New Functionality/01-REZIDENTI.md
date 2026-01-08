# Rezidenti (Residents)

**ClickUp Task:** AD-10 (Sadaļa - "Rezidenti")
**Status:** Partially Built

---

## Overview

Section for displaying, filtering, and searching care center resident profiles ("cards").

### Display Modes
- **List view** (default)
- **Grid view** (switchable)

### Information Displayed (both views)
- Vārds (Name) - first name, last name
- Aprūpes līmenis (Care level)
- Dzimšanas datums (Birth date) - with age in parentheses
- Rezidence (Residence)
- Istaba (Room) - Floor, room, bed

### Filters
| Filter | Values |
|--------|--------|
| Rezidence | Melodija / Šampēteris |
| Aprūpes līmenis | 1 / 2 / 3 / 4 |
| Stāvs (Floor) | Room-specific floors |

### Search
Search across resident AND linked client profiles:
- Vārds Uzvārds (Name)
- Tel.nr (Phone)
- E-pasts (Email)
- Personas kods (Personal ID)

---

## Subsections

### 1. Pamatinformācija (Basic Information)
**ClickUp ID:** AD-11 | **Status:** Test Stage

Basic resident profile information.

---

### 2. Izmitināšana (Accommodation)
**ClickUp ID:** AD-12 | **Status:** Test Stage

Room and bed assignment information.

---

### 3. Veselības aprūpe (Health Care)
**ClickUp ID:** AD-13 | **Status:** To Do (parent)

#### 3.1 Diagnozes (Diagnoses)
**AD-14** | Test Stage

#### 3.2 Māsas apskate (Nurse Examination)
**AD-15** | Test Stage
- Subtask AD-28: Precizēt info ar Adoro

#### 3.3 Ārsta apskate (Doctor Examination)
**AD-16** | Test Stage
- Subtask AD-27: Precizēt info ar Adoro
- **AD-53: Ārsta apskate - uzlabojumi** | In Progress

#### 3.4 Ordinācijas plāns - plānošana (Prescription Planning)
**AD-17** | To Do
- AD-67: Noskaidrot - vai jāspēj printēt
- AD-68: Noskaidrot - zāļu mērvienības (mg, g, gab.)

#### 3.5 Psihiatra apskate (Psychiatrist Examination)
**AD-18** | Test Stage
- Subtask AD-29: Precizēt info ar Adoro
- **AD-54: Psihiatra apskate - uzlabojumi** | In Progress

#### 3.6 Fizioterapeita apskate (SFK)
**AD-19** | Test Stage
- **AD-55: Fizioterapeita apskate - uzlabojumi** | Test Stage

#### 3.7 Rezidenta parametri (Resident Parameters)
**AD-21** | Test Stage

Vital signs and measurements.

#### 3.8 Izgulējumu riska noteikšana (Braden Scale)
**AD-22** | Test Stage

Pressure ulcer risk assessment.

#### 3.9 Kritienu riska izvērtējums (Morse Scale)
**AD-23** | Test Stage

Fall risk assessment.

#### 3.10 Bartela indekss (Barthel Index)
**AD-24** | Test Stage

Self-care and mobility assessment.

#### 3.11 Tehniskie palīglīdzekļi (Technical Aids)
**AD-25** | Test Stage

Assistive devices usage.

#### 3.12 Vakcinācija (Vaccination)
**AD-26** | Test Stage

Vaccination records.

#### 3.13 Aprūpes līmeņa noteikšana (Care Level Determination)
**AD-30** | Test Stage
- AD-52: Aprūpes līmeņa noteikšana - dizains | Done

**Process (from AD-86):**
1. Pieteikuma stadijā - Aptuvens aprūpes līmenis
2. Pirmās 10 dienas - Precīzs līmenis (AGGIR novērtējums)
3. Ik pēc 3 mēnešiem - Pārvērtēšana

Uses AGGIR scale (GIR1-GIR6).

---

### 4. Sociālā aprūpe (Social Care)
**ClickUp ID:** AD-34 | **Status:** To Do (parent)

#### 4.1 Psihologa atzinums (Psychologist Assessment)
**AD-35** | Test Stage

#### 4.2 Psihologa konsultācija (Psychologist Consultation)
**AD-36** | Test Stage

#### 4.3 Pašnāvības riska noteikšana (RUD Scale)
**AD-37** | Test Stage

Suicide risk assessment.

#### 4.4 Mini Mental Status tests
**AD-40** | Test Stage

Cognitive assessment.

#### 4.5 Sociālā darbinieka atskaite (Social Worker Report)
**AD-41** | Test Stage

#### 4.6 Starpprofesionāļu komandas atzinums
**AD-38** | Test Stage

Interprofessional team assessment.

#### 4.7 Sociālās aprūpes plāns (Social Care Plan)
**AD-39** | Test Stage

---

### 5. Aprūpe (Care)
**ClickUp ID:** AD-42 | **Status:** To Do (parent)

#### 5.1 Aprūpes plāns (Care Plan)
**AD-44** | Test Stage

#### 5.2 Krišanas protokols (Fall Protocol)
**AD-43** | Test Stage

---

## Prototype Status

### Built
- ResidentListView.jsx - List/grid view with search
- ResidentProfileView.jsx - Tabbed profile view
- ProfileSection.jsx, DiagnosesSection.jsx, VitalsSection.jsx
- ResidentHeader.jsx

### Missing from Prototype
- Full AGGIR assessment form
- Braden/Morse/Barthel scale forms
- Social care plan forms
- Interprofessional team forms

---

## Open Questions (from ClickUp)

1. **AD-27, AD-28, AD-29:** Precizēt trūkstošo info ar Adoro
2. **AD-67:** Vai Ordinācijas plāns ir jāspēj printēt?
3. **AD-68:** Nepieciešamās zāļu mērvienības?

---

*Source: ClickUp AD-10 and subtasks*
