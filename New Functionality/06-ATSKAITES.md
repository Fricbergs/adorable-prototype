# Atskaites (Reports)

**ClickUp Task:** AD-90 (Minimālais atskaišu saraksts)
**Status:** To Do (Not Started)

---

## Overview

18 required reports identified by Anna for the Adorable system.

---

## Report Categories

### 1. Medicīniskās atskaites (Medical Reports) - 8 reports

| # | Report | Latvian | Data Source |
|---|--------|---------|-------------|
| 1 | Doctor's examinations | Ārsta apskates | Rezidenti > Veselības aprūpe |
| 2 | Prescriptions | Ordinācijas | Ordinācijas plāns |
| 3 | Medications | Medikamenti | Zāļu noliktava |
| 4 | Hospitalizations | Hospitalizācijas | Rezidenti > Veselības aprūpe |
| 5 | Medicine delivery | Preparātu piegāde | Zāļu noliktava |
| 6 | Technical aids | Tehniskie palīglīdzekļi | Rezidenti > Veselības aprūpe |
| 7 | Fall protocol | Krišanas protokols | Rezidenti > Aprūpe |
| 8 | Doctors visits report | Ārstu vizīšu atskaite | Rezidenti > Veselības aprūpe |

### 2. Aprūpes un neatkarības līmeņa atskaites (Care/Independence Reports) - 3 reports

| # | Report | Latvian | Data Source |
|---|--------|---------|-------------|
| 9 | Report of independence levels | Neatkarības līmeņu atskaite | Bartela indekss, AGGIR |
| 10 | Individual activities | Individuālās nodarbības | Rezidenti > Sociālā aprūpe |
| 11 | 360 after check-in report | 360° atskaite pēc ierakstīšanās | All assessments |

### 3. Ikdienas atskaites (Daily Reports) - 3 reports

| # | Report | Latvian | Data Source |
|---|--------|---------|-------------|
| 12 | Flash report | Ātrā atskaite | Daily summary |
| 13 | Daily report | Dienas atskaite | Full daily log |
| 14 | Room report | Istabu atskaite | Gultu fonds |

### 4. Administratīvās atskaites (Administrative Reports) - 4 reports

| # | Report | Latvian | Data Source |
|---|--------|---------|-------------|
| 15 | Birthday report | Dzimšanas dienu atskaite | Rezidenti |
| 16 | Contract product | Līguma produktu atskaite | Administrācija |
| 17 | Resident days | Rezidentu dienu atskaite | Occupancy data |
| 18 | Check-in / Check-out | Ierakstīšanās / Izrakstīšanās | Administrācija |

---

## Additional KPIs (from ClickUp)

### AD-79: Tenure of Stay (Uzturēšanās ilgums)

```
Rādītājs, kas parāda visu rezidentu vidējo uzturēšanās dienu skaitu rezidencē.

Formula:
Vidējais uzturēšanās ilgums = Σ (Katra rezidenta uzturēšanās dienas) / Rezidentu skaits

Kur:
- Uzturēšanās dienas = (Izbraukšanas datums vai Šodiena) - Iebraukšanas datums
```

**Open Questions:**
1. Vai rēķinām tikai aktīvos rezidentus?
2. Vai iekļaujam bijušos/mirušos?
3. Vai sadalījums pēc rezidences (Melodija vs Šampēteris)?
4. Vai sadalījums pēc aprūpes līmeņa (GIR1-GIR6)?
5. Vai nepieciešams mediānas rādītājs?
6. Laika periods - visu laiku vai noteiktu periodu?

**Proposed SQL:**
```sql
SELECT
  AVG(DATEDIFF(COALESCE(checkout_date, CURDATE()), checkin_date)) as avg_tenure_days,
  COUNT(*) as total_residents,
  MIN(DATEDIFF(COALESCE(checkout_date, CURDATE()), checkin_date)) as min_tenure,
  MAX(DATEDIFF(COALESCE(checkout_date, CURDATE()), checkin_date)) as max_tenure
FROM residents
WHERE checkin_date IS NOT NULL
  AND status IN ('active', 'discharged');
```

**UI Location (proposed):**
- Dashboard > KPI widgets
- Analytics > Rezidentu statistika
- Reports > Occupation metrics

---

## Prototype Status

### Built
- Reports placeholder in InventoryDashboardView
- Basic data structures for most data sources

### Missing
- All 18 reports
- Report generation engine
- Export functionality (PDF, Excel)
- Scheduled report delivery
- Dashboard KPI widgets

---

## Implementation Priority

**MVP Phase (suggested):**
1. Daily report - operational necessity
2. Prescriptions report - medication tracking
3. Check-in/Check-out - administrative need
4. Room report - occupancy tracking

**Phase 2:**
5. Doctor's examinations
6. Medications report
7. Birthday report
8. Resident days

**Phase 3:**
9-18. Remaining reports

---

## Action Items (from AD-90)

- [ ] Prioritizēt atskaites pēc svarīguma
- [ ] Definēt katras atskaites struktūru un datu avotus
- [ ] Plānot implementācijas secību
- [ ] Noskaidrot, kuras atskaites ir obligātas MVP fāzē

---

*Source: ClickUp AD-90*
