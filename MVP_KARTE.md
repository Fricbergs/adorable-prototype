# MVP Karte - Kur esam, kas trūkst

**Datums:** 2026-01-14
**Deadline:** 2026-03-14 (~2 mēneši)

---

## LEĢENDA

```
✅ = Prototipā strādā (localStorage)
🔄 = Daļēji gatavs
❌ = Nav
⏸️ = Var atlikt pēc MVP
❓ = Jāprecizē ar Adoro
```

---

## 1. ADMINISTRĀCIJA (CRM)

### Pieteikumi → Līgums flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  PIETEIKUMS        ANKETA         PIEDĀVĀJUMS      LĪGUMS          │
│                                                                      │
│  ✅ NewLeadForm    ✅ SurveyView   ✅ OfferReview   ✅ ContractCreate│
│  ✅ AllLeadsView   ✅ CustomerFill                  ✅ ContractList  │
│  ✅ LeadDetails                                     ✅ ContractPrint │
│  ✅ Consultation                                    ✅ BedBooking    │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ✅ GATAVS prototipā**

### Trūkst MVP:
| Funkcija | Status | Prioritāte |
|----------|--------|------------|
| Vairāki rezidenti vienam klientam | ❌ | HIGH |
| Papildpakalpojumi (cenrādis) | ❓ Gaida Adoro | MEDIUM |

---

## 2. REZIDENTI

### Profils un apskates

```
┌─────────────────────────────────────────────────────────────────────┐
│  SARAKSTS          PROFILS              APSKATES                    │
│                                                                      │
│  ✅ ResidentList   ✅ ResidentProfile   ✅ DoctorExamModal          │
│     - Stāvu filtri    - Tabs sistēma    ✅ PsychiatristExamModal    │
│     - Nodaļu filtri   - Diagnozes       ✅ BradenScaleModal         │
│                       - Vitālie         ✅ MorseScaleModal          │
│                       - Vakcinācija     ✅ TechnicalAidsModal       │
│                       - Pielikumi       ✅ VaccinationModal         │
│                                         ✅ QuarterlyNurseData (ĶMI) │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ✅ GATAVS prototipā**

### Trūkst MVP:
| Funkcija | Status | Prioritāte |
|----------|--------|------------|
| Uzturēšanās/prombūtnes reģistrs | 🔄 Daļēji | HIGH |
| Papildpakalpojumu reģistrēšana | ❓ Gaida cenrādi | MEDIUM |

---

## 3. ORDINĀCIJAS PLĀNS

### Skati

```
┌─────────────────────────────────────────────────────────────────────┐
│  ŠODIEN           NEDĒĻA           MĒNESIS          VĒSTURE        │
│                                                                      │
│  ✅ TodayView     ✅ WeeklyView    ✅ MonthlyView   ✅ HistoryView  │
│     - Laika slots    - 7 dienas      - 30 dienas      - Filtri     │
│     - Iedot/Atteikt  - Status        - Status grid    - Eksports?  │
│                                                                      │
│  ✅ PrescriptionModal (pievienot/rediģēt)                          │
│  ✅ CancellationModal (pauze/atcelt)                                │
│  ✅ RefusalModal (atteikuma iemesls)                                │
│  ✅ PrescriptionPrint (druka)                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ✅ GATAVS prototipā**

### Piezīmes:
| Funkcija | Status | Prioritāte |
|----------|--------|------------|
| Ordinācijas IZVEIDE (PrescriptionModal) | ✅ Gatavs | - |
| Plānošana uz priekšu | ✅ Ir datumi | - |
| Saistība ar noliktavu (patēriņš) | ❌ Nav | MEDIUM (var atlikt) |

---

## 4. ZĀĻU NOLIKTAVA

### Skati

```
┌─────────────────────────────────────────────────────────────────────┐
│  NOLIKTAVA (A)              REZIDENTA KRĀJUMS (B)                  │
│                                                                      │
│  ✅ InventoryDashboard      ✅ ResidentInventory                    │
│     - BulkInventoryTable       - ResidentInventoryTable             │
│     - InventoryAlerts          - TransferModal                      │
│                                                                      │
│  ✅ XmlImportModal (XML imports)                                    │
│  ✅ ExternalReceiptModal (manuāla ievade)                           │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: 🔄 DAĻĒJI - UI gatavs, loģika nav pilna**

### Trūkst MVP:
| Funkcija | Status | Prioritāte |
|----------|--------|------------|
| XML parsēšana (reāla) | 🔄 UI ir | HIGH |
| **Automātisks patēriņš no Ordinācijas** | ❌ NAV | 🔴 KRITISKS |
| Inventarizācija | ⏸️ | Var atlikt |

---

## 5. GULTU FONDS

```
┌─────────────────────────────────────────────────────────────────────┐
│  PĀRSKATS                    REZERVĒŠANA                           │
│                                                                      │
│  ✅ BedFundView              ✅ BedBookingView                      │
│     - Nodaļu statistika         - Datuma izvēle                    │
│     - Stāvu skats               - Gultas izvēle                    │
│     - Krāsu kodi                - Saistīts ar līgumu               │
│                                                                      │
│  ✅ RoomManagementView (istabu admin)                               │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ✅ GATAVS prototipā**

### Trūkst MVP:
| Funkcija | Status | Prioritāte |
|----------|--------|------------|
| 2026 cenrāža imports | ❓ Fails saņemts | HIGH |
| Demences nodaļas atdalīšana | ✅ Ir (3. stāvs) | - |

---

## 6. ATSKAITES

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ❌ NAV NEKAS                               │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ❌ NAV**

### MVP prioritātes:
| Atskaite | Prioritāte | Piezīmes |
|----------|------------|----------|
| **RD 500/800 EUR līdzfinansējums** | 🔴 KRITISKS | Must have |
| Gultas vietu noslodze | HIGH | BedFundView var paplašināt |
| Rezidentu dienas | MEDIUM | Moneo vajadzībām |
| Pārējās 15 atskaites | ⏸️ | Pēc MVP |

---

## 7. MONEO INTEGRĀCIJA

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ❌ NAV NEKAS                               │
│                                                                      │
│  Gaida specifikāciju no Signes (grāmatvede)                        │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ❌ BLOĶĒTS**

---

## 8. GRUPU PASĀKUMI

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ❌ NAV NEKAS                               │
│                                                                      │
│  Nav detalizēti plānots - VAR ATLIKT?                              │
└─────────────────────────────────────────────────────────────────────┘
```

**STATUS: ⏸️ ATLIKT**

---

# KOPSAVILKUMS

## ✅ Gatavs prototipā (var testēt):
1. Administrācija - pieteikumi, anketas, līgumi
2. Rezidentu profili un apskates
3. Gultu fonds ar rezervēšanu
4. Ordināciju pilns cikls (izveide + skatīšana + iedošana + atcelšana)
5. Zāļu noliktava UI

## 🔴 Kritisks - jābūvē MVP:
1. **RD līdzfinansējuma atskaite** - eksports/druka
2. **Backend savienošana** - localStorage → DB

## ❓ Bloķēts - gaida Adoro:
1. Moneo specifikācija (Signe)
2. Papildpakalpojumu cenrādis (Anna)
3. CFO atskaišu saturs

## ⏸️ Var droši atlikt pēc MVP:
1. Grupu pasākumi
2. 15 no 18 atskaitēm
3. Inventarizācija
4. XML automātika (var manuāli)

---

# IETEICAMAIS MVP SCOPE

**Ja gribi reāli piegādāt 2 mēnešos:**

| # | Funkcija | Laiks | Kas dara |
|---|----------|-------|----------|
| 1 | Backend savienošana esošajam UI | 2-3 ned | Ivo/Edžus |
| 2 | RD līdzfinansējuma atskaite | 3-5 dienas | ? |
| 3 | 2026 cenrāža imports | 1 diena | Tu/es |

**Kopā: ~3-4 nedēļas darba**

**UI PROTOTIPS GATAVS - tikai backend jāsavieno!**

**ATMET no MVP:**
- Moneo (gaida spec, var pēc tam)
- Grupu pasākumi
- Lielākā daļa atskaišu
- Automātisks patēriņš (var manuāli sākumā)

---

*Vai šī karte palīdz orientēties?*
