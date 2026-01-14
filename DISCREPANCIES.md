  # Dokumentācijas nesakritības ar kodu

**Izveidots:** 2026-01-14
**Mērķis:** Apkopot visas atšķirības starp MD dokumentāciju un faktisko kodu

---

## 1. ARCHITECTURE.md - Trūkstošās komponentes

**Fails:** `/ARCHITECTURE.md`

### Trūkst views:
| Komponente | Apraksts |
|------------|----------|
| `BedFundView.jsx` | Gultu fonda pārskats ar nodaļu statistiku |
| `ContractListView.jsx` | Līgumu saraksts |
| `ContractCreateView.jsx` | Līguma izveide |
| `ContractViewView.jsx` | Līguma apskate |
| `ContractPrintView.jsx` | Līguma drukāšana |

### Trūkst komponentes:
| Komponente | Apraksts |
|------------|----------|
| `MonthlyPrescriptionView.jsx` | 30 dienu ordināciju skats |
| `CancellationModal.jsx` | Zāļu pauze/atcelšana |
| `QuarterlyNurseData.jsx` | ĶMI + svara dinamika |
| `TerminateContractModal.jsx` | Līguma izbeigšana |
| `SafeStorageAgreementModal.jsx` | Seifa līgums |

### Trūkst constants:
| Fails | Apraksts |
|-------|----------|
| `departmentConstants.js` | Nodaļu definīcijas (regular/dementia) |

### Trūkst domain helpers:
| Fails | Apraksts |
|-------|----------|
| `quarterlyDataHelpers.js` | ĶMI aprēķins |
| `roomHelpers.js` | Gultu pieejamības pārbaude pēc datuma |

### Trūkst localStorage atslēgas:
- `adorable-contracts`
- `adorable-quarterly-data`
- `adorable-bed-reservations`

---

## 2. New Functionality/05-ORDINACIJAS.md - Nepilnīgs

**Fails:** `/New Functionality/05-ORDINACIJAS.md`

### Trūkstošās funkcijas:
| Funkcija | Status kodā |
|----------|-------------|
| Monthly view (Mēnesis) | ✅ Eksistē `MonthlyPrescriptionView.jsx` |
| Zāļu pauze | ✅ Eksistē `CancellationModal.jsx` |
| Zāļu atcelšana | ✅ Eksistē `CancellationModal.jsx` |
| Edit/Cancel pogas tabulā | ✅ Implementēts (hover) |

### Dokumentā rakstīts:
```
Views:
- Šodien (Today View)
- Nedēļa (Weekly View)
- Vēsture (History View)
```

### Realitātē kodā:
```
Views:
- Šodien (Today View)
- Nedēļa (Weekly View)
- Mēnesis (Monthly View) ← TRŪKST DOKUMENTĀ
- Vēsture (History View)
```

---

## 3. New Functionality/03-GULTU-FONDS.md - Nepareizs statuss

**Fails:** `/New Functionality/03-GULTU-FONDS.md`

### Dokumentā:
```
Status: To Do (Not Started)
```

### Realitātē:
- `BedFundView.jsx` eksistē un strādā
- Nodaļu statistika implementēta
- Vizuālais gultu režģis pa stāviem strādā
- Krāsu kodējums: sarkans=aizņemta, dzeltens=rezervēta, zaļš=brīva

**Secinājums:** Statuss jāmaina uz "✅ Test stage"

---

## 4. New Functionality/00-OVERVIEW.md - Novecojis

**Fails:** `/New Functionality/00-OVERVIEW.md`

### Problēmas:

| Lauku | Dokumentā | Realitātē |
|-------|-----------|-----------|
| Last updated | 2025-01-08 | Šodien ir 2026-01-14 |
| PM | Kristens Blūms | Aizgāja (skatīt CLAUDE.md) |
| Gultu fonds | "Not implemented" | BedFundView eksistē |

### Komandas sadaļa novecojusi:
```markdown
## Team
- Gints Fricbergs - Founder / PM
- Kristens Blūms - PM ← AIZGĀJA
- Ivo Zibens - Backend
- Edžus Kašs - Frontend
```

---

## 5. New Functionality/01-REZIDENTI.md - Trūkst jaunas funkcijas

**Fails:** `/New Functionality/01-REZIDENTI.md`

### Trūkst:
| Funkcija | Apraksts |
|----------|----------|
| QuarterlyNurseData | Medmāsas kvartāla dati |
| ĶMI aprēķins | Body Mass Index kalkulators |
| Svara dinamika | Svara izmaiņu grafiks |
| Nodaļu filtri | Filtrēšana pēc regular/dementia |
| Stāvu filtri | Filtrēšana pēc stāva |

---

## 6. New Functionality/02-ADMINISTRACIJA.md - Trūkst līgumu flow

**Fails:** `/New Functionality/02-ADMINISTRACIJA.md`

### Dokumentā nav aprakstīts:
- Līgumu saraksta skats (CONTRACT_LIST)
- Līguma izveides process (CONTRACT_CREATE)
- Līguma aktivizēšana
- Līguma izbeigšana ar iemeslu
- Gultas rezervēšana līguma procesā (BED_BOOKING)

### Trūkst steps.js atslēgas:
```javascript
CONTRACT_LIST: 'contract-list',
CONTRACT_CREATE: 'contract-create',
CONTRACT_VIEW: 'contract-view',
CONTRACT_PRINT: 'contract-print',
BED_BOOKING: 'bed-booking'
```

---

## 7. New Functionality/Spec.md - Neatbilst prototipam

**Fails:** `/New Functionality/Spec.md`

### Specifikācijā:
- SQL shēmas (PostgreSQL/MySQL)
- Laravel backend
- PDF ģenerēšana ar dompdf
- API endpoints

### Prototipā:
- localStorage (nav DB)
- Nav backend
- Nav PDF ģenerēšana
- Nav API

**Secinājums:** Spec.md ir mērķa arhitektūra, nevis pašreizējā implementācija. Jānorāda skaidri.

---

## 8. CLAUDE.md vs dokumentācija

**Fails:** `/CLAUDE.md`

CLAUDE.md ir visaktuālākais dokuments ar session notes. Citi dokumenti nav sinhronizēti.

### CLAUDE.md satur:
- 2026-01-13 session: MonthlyPrescriptionView, CancellationModal, BedFundView, QuarterlyNurseData
- 2026-01-09 session: Contract flow, TerminateContractModal, bed colors
- 2025-01-07 session: Weekly/History views

### Citi dokumenti to nezina.

---

## Rekomendācijas

### Opcija A: Minimāla labošana
1. Atjaunot statusus (03-GULTU-FONDS.md → Test stage)
2. Atjaunot datumus un komandu (00-OVERVIEW.md)
3. Pievienot disclaimeri Spec.md (mērķa arhitektūra, ne pašreizējā)

### Opcija B: Pilna sinhronizācija
1. Atjaunot ARCHITECTURE.md ar visām jaunajām komponentēm
2. Atjaunot katru New Functionality/*.md failu
3. Pievienot trūkstošās localStorage atslēgas
4. Pievienot trūkstošās funkcijas katrā modulī

### Opcija C: Konsolidācija
1. Dzēst novecojušos New Functionality/*.md
2. Paturēt tikai: CLAUDE.md, ARCHITECTURE.md, MVP_SCOPE.md
3. CLAUDE.md kā "living document" ar session notes

---

## Prioritāte

| # | Fails | Kritiskums | Darbība |
|---|-------|------------|---------|
| 1 | 03-GULTU-FONDS.md | Augsts | Mainīt statusu |
| 2 | 00-OVERVIEW.md | Augsts | Atjaunot datumu, komandu |
| 3 | ARCHITECTURE.md | Vidējs | Pievienot jaunās komponentes |
| 4 | 05-ORDINACIJAS.md | Vidējs | Pievienot Monthly view |
| 5 | 02-ADMINISTRACIJA.md | Vidējs | Pievienot līgumu flow |
| 6 | 01-REZIDENTI.md | Zems | Pievienot QuarterlyNurseData |
| 7 | Spec.md | Zems | Pievienot disclaimeri |

---

---

## 9. High level handoff.docx - Kristena nodošanas dokuments

**Fails:** `/Users/fritz/Downloads/High level handoff.docx`
**Autors:** Kristens Blūms (bijušais PM)

### Dokuments satur:

#### Galvenās darbības pirms testēšanas:
| ClickUp ID | Uzdevums | Status prototipā |
|------------|----------|------------------|
| AD-17 | Ordinācijas plāna pievienošana | 🔄 Daļēji (nav izveide) |
| AD-53 | Ārsta apskates izmaiņas | 🔄 In progress |
| AD-54 | Psihiatra apskates izmaiņas | 🔄 In progress |
| AD-58 | Līgumi | ✅ Prototipā strādā |
| AD-59 | Gultas vietu datubāze | ✅ BedFundView eksistē |
| AD-66 | Vairāku rezidentu atbalsts | ❌ Nav implementēts |

#### Testēšanas cikls (Annas UAT):
1. Klienta pieteikuma reģistrēšana
2. WEB anketas aizpildīšana
3. Komunikācijas reģistrēšana un statusu maiņa
4. Aprūpes līmeņa izvērtēšana
5. Gultas vietu izvēle
6. Līguma sagatavošana
7. Rezidenta "iebraukšana"
8. Ikdienas/ikmēneša/ikgada apskates
9. Rezidenta izbraukšana

#### Atlikušie darbi:
| ClickUp ID | Uzdevums | MVP prasība |
|------------|----------|-------------|
| AD-69 | Zāļu noliktava | Manuāla reģistrēšana, XML rēķini |
| AD-72 | RD līdzfinansējuma atskaite | Must have |
| - | MONEO integrācija | Gaida kontaktus |

#### Nav jāveido (vienošanās):
- Kustība (OPTIMA sadaļa)
- HRM (OPTIMA sadaļa)

#### Svarīgas piezīmes:
- Ordinācijas plāns ir komplekss - ietekmē noliktavu un rēķinus
- Katram mēnesim savs plāns
- Vēsturiskie plāni jāsaglabā
- Jāspēj printēt

### Nesakritības ar pašreizējo stāvokli:
1. **AD-58 Līgumi** - dokumentā "jāizveido", bet prototipā jau strādā
2. **AD-59 Gultu DB** - dokumentā "jāizveido", bet BedFundView eksistē
3. **AD-66 Multi-rezidenti** - joprojām nav implementēts (kritisks)

---

## 10. Interfeisa precizējumi.docx - UI/UX specifikācija

**Fails:** `/Users/fritz/Downloads/Interfeisa precizējumi.docx`
**Konteksts:** Veselības aprūpes sadaļas detaļas

### Galvenā struktūra:
- **Preview skats** - limitēta informācija
- **Vēstures skats** - visu apskašu vēsture ar tabiem katram apskates veidam

### Māsas apskate

#### "Normas" koncepcija (nav implementēta prototipā):
- Novirze no normas jārāda krāsota (sarkans = slikti, zaļš = labi)
- Piemērs: Temperatūras norma 36.6°C
  - 37.0 → rāda "+0.4" sarkanā
  - 36.8 → rāda "+0.2" sarkanā (joprojām novirze)
- Norma var būt diapazons (36.4-36.9)

#### Vēstures tabula:
| Kolonna | Apraksts |
|---------|----------|
| Apskates datums | Kad veikta |
| Komentārs | Papildus informācija |
| Izveidošanas datums | Kad ievadīts sistēmā |
| Lietotājs | Kas veicis |

### Ārsta apskate (AD-53)

#### Preview bloki (6-7 maksimums):
- Vispārējs stāvoklis
- Sāpju novērtējums
- Nākamais apskates datums ✅ (pievienots)
- + svarīgākie medicīniskie rādījumi

#### Vēstures tabula:
Tāda pati struktūra kā māsas apskatei

### Psihiatra apskate (AD-54)

#### Preview bloki:
- Tā pati situācija kā ārsta apskatei - jādefinē ko rādīt

#### Vēstures tabula:
| Kolonna | Apraksts |
|---------|----------|
| Apskates datums | Kad veikta |
| Diagnoze | Psihiatriskā diagnoze |
| Izveidošanas datums | Kad ievadīts |
| Lietotājs | Kas veicis |

### Fizioterapeita apskate

#### Preview bloki:
- Apskates datums
- Lietotājs
- Mērķis
- Nākamais kontroles datums

#### Piezīmes:
- Trendus grūti rādīt (nav metriski novērtējumi)
- Māsas reģistrētos datus fizioterapeits neredz savā formā

### Finansējums

- Tikai globālā "Atgriež 15%" ir aktīva
- Individuālie bloki ir read-only

### Administrācija - Līgumi

#### Papildus vienošanās:
- Ja iebrauc īstermiņam (piem. 2 nedēļas) un grib palikt ilgāk
- Jauna vienošanās pirms ilgtermiņa līguma

#### Uzturēšanās periods:
- 2 datumi: No - Līdz
- Ja >90 dienas vai "Līdz" nav aizpildīts → **ilgtermiņa līgums**
- Citādi → **īstermiņa līgums**

### Nesakritības ar prototipu:

| Funkcija | Dokumentā | Prototipā |
|----------|-----------|-----------|
| Normas novirzes | Detalizēts | ❌ Nav |
| Krāsu kodējums vitāliem | Sarkanš/zaļš | ❌ Nav |
| Fizioterapeita preview | 4 bloki definēti | ❓ Jāpārbauda |
| Īstermiņa/ilgtermiņa loģika | >90 dienas | ❓ Jāpārbauda |
| Papildus vienošanās | Aprakstīta | ❌ Nav |

---

## 11. MVP Marta vienošanās - GALVENAIS DOKUMENTS

**Avots:** Mutiska vienošanās ar Adoro
**Deadline:** ~2026-03-14 (2 mēneši)
**Konteksts:** Tas, ko +/- bijām vienojušies, lai varētu sākt lietot

---

### Rezidentu sadaļa

| Funkcija | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Rezidentu profili (personīgā info, kontakti) | ✅ | ❓ | |
| Uzturēšanās un prombūtnes reģistrs | ✅ | ❓ | |
| Apskašu, izmeklējumu formas | ✅ | 🔄 | Ārsta/Psihiatra in progress |
| **Ordinācijas plāna IZVEIDE** | ❌ | ❌ | ⚠️ KRITISKS - nav! |
| Pielikumi | ✅ | ❓ | |
| Papildpakalpojumi (fizioterapeits, frizieris) | 🔄 UI gatavs | ❌ | Gaida cenrādi no Adoro |

---

### Administrācija (Optima CRM)

| Funkcija | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Klientu pieteikumu reģistrēšana | ✅ | ❓ | |
| Web forma klienta info padošanai | ✅ | ❓ | |
| Komunikācijas reģistrēšana | ✅ | ❓ | |
| **Līgumu veidošana** | | | |
| → Pamata līgums | ✅ | ❓ | |
| → Pielikums | 🔄 | ❓ | |
| **Finansējums** | | | |
| → Pensijas | ✅ | ❓ | |
| → Pabalsti | ✅ | ❓ | |
| → RD līdzfinansējums | ✅ | ❓ | Formula jāprecizē |
| Pielikumi | ✅ | ❓ | |

---

### Zāļu noliktava

| Funkcija | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Zāļu avotu nodalījums (Adoro/Klienta) | ✅ | ❌ | |
| Manuāla zāļu pievienošana | ✅ | ❌ | |
| **Automātiska pievienošana pēc XML** | ✅ UI | ❌ | Parsēšana jāimplementē |
| **Automātiska patēriņa reģistrēšana** | ❌ | ❌ | ⚠️ Saistīts ar Ordināciju! |
| Neediģēt atlikumu manuāli | ❓ | ❓ | Biznesa loģika |

---

### Gultu fonds

| Funkcija | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Gultu vietu uzskaite | ✅ | ❓ | BedFundView eksistē |
| Rezervēšana | ✅ | ❓ | Pēc datuma |
| Aizņemšana | ✅ | ❓ | |
| Atbrīvošana | ✅ | ❓ | |

---

### Grupu pasākumi

| Funkcija | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Pieejamo pasākumu definēšana | ❌ | ❌ | Nav detalizēti plānots |
| Dalībnieku apmeklējumu reģistrēšana | ❌ | ❌ | Nav detalizēti plānots |

---

### Atskaites

| Atskaite | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| RD 500/800 EUR līdzfinansējums | ❌ | ❌ | Must have |
| CFO atskaites | ❌ | ❌ | Nav specifikācija |
| Gultas vietu noslodze (pa rezidencēm) | 🔄 | ❌ | BedFundView daļēji |
| Kopējs finanšu pārskats | ❌ | ❌ | Jāprecizē |
| Rezidentu pārskati (palīglīdzekļi, utt.) | ❌ | ❌ | Jāprecizē |

---

### Moneo integrācija

| Funkcija | Prototipā | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Pamatdatu padošana uz Moneo | ❌ | ❌ | Gaida info no Signes |
| **Padodamie dati:** | | | |
| → Pamatpakalpojums | - | - | |
| → Gultas vieta un tarifs | - | - | |
| → Uzturēšanās dienu skaits | - | - | |
| → Prombūtnes dienu skaits | - | - | |
| → Finansējums (saņem jā/nē) | - | - | |
| → 15% atgriež (jā/nē) | - | - | |

---

### KRITISKĀS NEPILNĪBAS (bloķē MVP)

| # | Funkcija | Kas trūkst | Atkarības |
|---|----------|------------|-----------|
| 1 | **Ordinācijas plāna IZVEIDE** | Dakteru UI priekš plānošanas | Zāļu noliktava |
| 2 | **Automātiska patēriņa reģistrēšana** | Samazina atlikumus pēc iedošanas | Ordinācijas plāns |
| 3 | **RD līdzfinansējuma atskaite** | Eksports/drukas forma | Finansējuma dati |
| 4 | **Moneo integrācija** | API/datu padošana | Signes specifikācija |

---

### BLOĶĒTĀJI (gaida no Adoro)

| Kas | No kā gaida | Status |
|-----|-------------|--------|
| Papildpakalpojumu cenrādis | Anna | Gaida |
| Moneo kontakti/specifikācija | Signe (grāmatvede) | Gaida |
| CFO atskaišu saturs | CFO | Nav specifikācija |
| Rezidentu pārskatu saturs | Anna | Jāprecizē |

---

*Dokuments ģenerēts 2026-01-14*
