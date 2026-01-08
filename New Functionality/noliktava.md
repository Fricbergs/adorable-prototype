# Zāļu noliktavas sistēma - Biznesa prasības

## 1. Pārskats

### 1.1. Mērķis
Izveidot zāļu krājumu uzskaites sistēmu senioriem aprūpes centriem, kas:
- Uztur precīzu zāļu daudzumu uzskaiti
- Atspoguļo 2 noliktavu struktūru (A un B)
- Automātiski mīnuso krājumus pēc ordinācijas plāna
- Apstrādā atteikumus un atjauno krājumus
- Nodrošina pilnu audit trail
- Ģenerē brīdinājumus par zemiem krājumiem un beidzošos derīguma termiņiem

### 1.2. Saistītie moduļi
- **AD-69**: Zāļu noliktava (šis dokuments)
- **AD-70**: XML rēķinu automātiska apstrāde no Recipe Plus
- **AD-71**: Manuāla zāļu ievade
- **AD-17**: Ordinācijas plāns - plānošana
- **Līgumu sistēma**: Zāļu izmaksu iekļaušana rezidenta rēķinā

---

## 2. Noliktavu struktūra

### 2.1. Arhitektūras pārskats

```
┌─────────────────────────────────────────────────────┐
│              IEPLŪDES AVOTI                          │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
         ↓                      ↓
   ┌──────────────┐      ┌─────────────────┐
   │ Recipe Plus  │      │ Radinieks atnes │
   │ XML imports  │      │ zāles konkrētam │
   │              │      │ rezidentam      │
   └──────┬───────┘      └────────┬────────┘
          │                       │
          ↓                       │
   ┌─────────────────────────┐   │
   │ (A) LIELĀ NOLIKTAVA     │   │
   │                         │   │
   │ • Centrālā noliktava    │   │
   │ • Visu medikamentu      │   │
   │   bulk krājumi          │   │
   │ • FIFO uzskaite         │   │
   │ • Batch tracking        │   │
   └──────────┬──────────────┘   │
              │                   │
              │ Transfer          │
              │ (4 dienu deva)    │
              │                   │
              ↓                   ↓
   ┌─────────────────────────────────────────┐
   │ (B) REZIDENTA NOLIKTAVAS                │
   │                                         │
   │ • Individuāla katram rezidentam         │
   │ • 2 ieplūdes kanāli:                    │
   │   1) No (A) - medmāsa sagatavo          │
   │   2) Tieši - radinieks atnes            │
   │ • AUTOMĀTISKA mīnusošana pēc            │
   │   ordinācijas grafika                   │
   └──────────────┬──────────────────────────┘
                  │
                  │ Automātiska izsniegšana
                  ↓
           [ Rezidents pieņem ]
                  │
                  ↓
        ┌──────────────────┐
        │ Ja ATTEIKUMS     │
        │ → Atjauno (B)    │
        └──────────────────┘
```

### 2.2. Noliktavu apraksts

#### (A) Lielā noliktava (Bulk noliktava)

**Atrašanās vieta**: Pie galvenās medmāsas

**Funkcijas**:
- Centralizēta visu medikamentu glabāšana
- Saņem zāles no Recipe Plus (XML imports)
- Saņem manuāli ievadītas zāles
- Transfer uz rezidentu noliktavām (B)

**Īpašības**:
- **FIFO princips**: Vecākās zāles tiek izmantotas pirmās (pēc saņemšanas datuma)
- **Batch tracking**: Katrai partijai ir numurs un derīguma termiņš
- **Brīdinājumi**:
  - Zemi krājumi (zem minimālā līmeņa)
  - Derīguma termiņš beidzas (< 30 dienas)
  - Zāles beigušās (quantity = 0)

#### (B) Rezidenta noliktavas

**Atrašanās vieta**: Pie stāva medmāsas / rezidenta tuvumā

**Funkcijas**:
- Individuāla noliktava katram rezidentam
- Saņem zāles no 2 avotiem:
  1. **Transfer no (A)**: Medmāsa sagatavo 4 dienu devu
  2. **Tieši**: Radinieks atnes zāles konkrētam rezidentam
- Automātiska mīnusošana pēc ordinācijas plāna izpildes
- Atteikuma gadījumā - daudzuma atjaunošana

**Īpašības**:
- **FIFO princips**: Mantots no (A) noliktavas
- **Brīdinājumi**:
  - Nav pietiekami zāļu nākamajām 4 dienām
  - Trūkst kādu ordinētu medikamentu

### 2.3. Kas NAV noliktava

❌ **Dienas zāļu rati / medicīnas ratiņi**
- Fizisks konteiners zāļu transportēšanai no (B) uz rezidentu
- Sistēmā NAV uzskaites vienība
- Netiek trackots/mīnusots/plusots
- Medmāsa fizisk pārvieto, bet sistēmā nereģistrē

---

## 3. Galvenie biznesa procesi

### 3.1. Zāļu ieplūde sistēmā

#### 3.1.1. Recipe Plus XML imports → (A)

**Kad notiek**: 
- Pēc zāļu pasūtījuma saņemšanas no Recipe Plus
- Regulāri (piemēram, 1-2 reizes nedēļā)

**Process**:
1. Sistēma saņem XML failu no Recipe Plus (AD-70)
2. Automātiski parsē un reģistrē:
   - Medikamenta nosaukums
   - Daudzums (tabletes, ml, ampulas)
   - Batch (partijas) numurs
   - Derīguma termiņš
   - Vienības izmaksas
   - Receptes numurs (ja attiecas)
3. Pievieno zāles noliktavai (A)
4. Ja XML saturēja rezidenta ID → saista ar rezidentu rēķinā

**Rezultāts**:
- Noliktava (A): daudzums palielinās
- Vēsture: ieraksts par pirkumu
- Ja saistīts ar rezidentu → atzīmēts rēķinam

#### 3.1.2. Transfer (A) → (B): 4 dienu zāļu sagatavošana

**Kad notiek**:
- Ik pēc 4 dienām (automātisks atgādinājums vai grafiks)
- Medmāsa var iniciēt manuāli

**Process**:
1. Sistēma aprēķina nākamo 4 dienu vajadzības katram rezidentam:
   - Skatās ordinācijas plānā aktīvos ierakstus
   - Reizina: deva × reizes dienā × 4 dienas
   - Summē pa medikamentiem

2. Sistēma pārbauda pieejamību (A):
   - Ja NAV pietiekami → brīdinājums medmāsai
   - Ja IR pietiekami → rāda sagatavošanas sarakstu

3. Medmāsa apstiprina sagatavošanu:
   - Sistēma rāda, ko ņemt no (A)
   - Izmanto FIFO - vecākās zāles pirmās
   - Fizisk pārvieto no (A) uz (B) kastītes

4. Sistēma reģistrē transferu:
   - Noliktava (A): daudzums samazinās
   - Noliktava (B): daudzums palielinās
   - Vēsture: transfer ieraksts

**UI medmāsai**:
```
╔═══════════════════════════════════════════╗
║  4 DIENU ZĀĻU SAGATAVOŠANA               ║
║  Datums: 2025-01-08                      ║
╠═══════════════════════════════════════════╣
║                                           ║
║  📋 Jānis Bērziņš (Istaba 12)           ║
║  ───────────────────────────────────────  ║
║  ☐ Aspirin 100mg - 8 tabletes           ║
║     Batch: B2024-089, derīgs līdz 08/26 ║
║  ☐ Enalapril 10mg - 4 tabletes          ║
║     Batch: B2024-145, derīgs līdz 03/26 ║
║  ☐ Metformin 500mg - 8 tabletes         ║
║     Batch: B2024-201, derīgs līdz 11/26 ║
║                                           ║
║  📋 Anna Liepa (Istaba 15)              ║
║  ───────────────────────────────────────  ║
║  ☐ Simvastatin 20mg - 4 tabletes        ║
║  ☐ Losartan 50mg - 4 tabletes           ║
║                                           ║
║  [✓ Apstiprināt visu]  [⏭ Izlaist]     ║
╚═══════════════════════════════════════════╝
```

#### 3.1.3. Radinieks atnes → (B)

**Kad notiek**:
- Radinieks atnes zāles rezidentam
- Jebkurā laikā (neplānots)

**Process**:
1. Radinieks nodod zāles medmāsai
2. Medmāsa atver rezidenta profilu sistēmā
3. Izvēlas: "Radinieks atnesa zāles"
4. Aizpilda formu:
   - Medikamenta nosaukums (no kataloga vai autocomplete)
   - Daudzums
   - Batch numurs (ja ir uz iepakojuma)
   - Derīguma termiņš (ja ir uz iepakojuma)
   - Piezīmes

5. Sistēma reģistrē:
   - Noliktava (B_rezidents): daudzums palielinās
   - Noliktava (A): NAV izmaiņu (apiet (A))
   - Vēsture: "radinieks_atnesa" ieraksts
   - Avots: atzīmēts kā "radinieks"

**UI medmāsai**:
```
╔═══════════════════════════════════════════╗
║  RADINIEKS ATNESA ZĀLES                  ║
╠═══════════════════════════════════════════╣
║  Rezidents: Anna Liepa                   ║
║  ───────────────────────────────────────  ║
║  Medikaments*: [Aspirin 100mg     ▼]    ║
║  Daudzums*:    [20] [tabletes     ▼]    ║
║  Batch Nr:     [B2025-034________]       ║
║  Derīgums:     [2026-12-31_______]       ║
║  Piezīmes:     [Dēls atnesa, jauns    ] ║
║                [iepakojums____________] ║
║  ───────────────────────────────────────  ║
║  * obligāti lauki                        ║
║                                           ║
║  [✓ Reģistrēt]  [✗ Atcelt]              ║
╚═══════════════════════════════════════════╝
```

**Piezīme**: Ja radinieks atnes medikamentu, kas NAV katalogā, medmāsa var izveidot jaunu medikamentu ierakstu (AD-71).

### 3.2. Zāļu izplūde (patēriņš)

#### 3.2.1. Automātiska izsniegšana pēc ordinācijas plāna

**Kad notiek**:
- Automātiski pēc ordinācijas grafika (AD-17)
- Piemēram: 08:00, 12:00, 18:00, 22:00
- Sistēma darbojas ar cron job vai scheduler

**Process**:
1. Sistēma regulāri (piemēram, katru stundu) pārbauda:
   - Vai ir ordinācijas, kam pienācis izsniegšanas laiks
   - Vai medikaments ir pieejams (B) noliktavā

2. Ja laiks pienācis UN pieejams:
   - Sistēma automātiski "pieņem", ka zāles izsniegtas
   - Mīnuso no (B) noliktavas
   - Izveido izsniegšanas ierakstu (dispensing_log)
   - Status: "auto_dispensed"

3. Fiziskā realitāte:
   - Medmāsa fizisk izsniegs no ratiņiem/kastītes
   - Sistēma jau pieņēmusi, ka izsniegts

**Piemērs**:
```
2025-01-08 08:00 → Aspirin 100mg (1 tab)
  Noliktava (B_Jānis): 40 → 39
  Status: auto_dispensed

2025-01-08 12:00 → Enalapril 10mg (1 tab)
  Noliktava (B_Jānis): 20 → 19
  Status: auto_dispensed
```

**Brīdinājumi**:
- Ja (B) daudzums < deva → ALERT medmāsai
- Ja (A) ir zemas rezerves → ALERT galvenajai māsai

#### 3.2.2. Atteikums un daudzuma atjaunošana

**Kad notiek**:
- Rezidents atsakās pieņemt zāles
- Jebkurš iemesls (slikta dūša, aizmirsa, negrib, slikti jūtas)

**Process**:
1. Medmāsa atver izsniegšanas vēsturi
2. Redz šodienas izsniegšanas ar statusu "auto_dispensed"
3. Atzīmē konkrēto ierakstu kā "Atteicās"
4. Izvēles: norāda atteikuma iemeslu
5. Sistēma automātiski:
   - Maina statusu: "auto_dispensed" → "refused"
   - ATJAUNO (B) daudzumu: pievieno atpakaļ atteikto devu
   - Reģistrē vēsturē: reversal/atgriešanas ieraksts

**Rezultāts**:
- Noliktava (B): daudzums palielinās par atteikto devu
- Vēsture: ieraksts par atteikumu un daudzuma atjaunošanu
- Rēķins: zāles NAV jāapmaksā (nav izsniegtas)

**UI medmāsai**:
```
╔═══════════════════════════════════════════╗
║  IZSNIEGŠANAS VĒSTURE                    ║
║  Rezidents: Jānis Bērziņš                ║
║  Datums: 2025-01-08                      ║
╠═══════════════════════════════════════════╣
║  08:00 ✓ Aspirin 100mg (1 tab)          ║
║         Pieņēma                           ║
║                                           ║
║  12:00 ✗ Enalapril 10mg (1 tab)         ║
║         Atteicās                          ║
║         Iemesls: [Slikta dūša      ▼]    ║
║         [↩ Atsaukt atteikumu]            ║
║                                           ║
║  18:00 ⏳ Aspirin 100mg (1 tab)          ║
║         Plānots                           ║
║         [✓ Atzīmēt kā pieņēmu]           ║
║         [✗ Atzīmēt kā atteikumu]         ║
║                                           ║
║  22:00 ⏳ Metformin 500mg (1 tab)        ║
║         Plānots                           ║
║  ───────────────────────────────────────  ║
║  Leģenda:                                 ║
║  ✓ Pieņēma  ✗ Atteicās  ⏳ Plānots      ║
╚═══════════════════════════════════════════╝
```

**Biznesa noteikumi**:
- Atteikto zāļu daudzums VIENMĒR atgriežas (B)
- Var atsaukt atteikumu (ja kļūda)
- Atteikuma iemesls palīdz analīzē (kāpēc bieži atteikas)

---

## 4. Krājumu pārvaldība

### 4.1. FIFO (First In, First Out) princips

**Definīcija**: Vecākās zāles (pēc saņemšanas datuma) tiek izmantotas pirmās.

**Kāpēc svarīgi**:
- Novērš zāļu derīguma termiņa beigšanos
- Samazina izšķērdēšanu
- Atbilst farmācijas labai praksei

**Kā darbojas**:

1. **Noliktavā (A)**:
   - Katrai zāļu partijai ir saņemšanas datums
   - Kad medmāsa sagatavo 4 dienas (transfer uz B), sistēma automātiski:
     - Izvēlas vecāko partiju (oldest batch)
     - Ja nepietiek vecākajā → ņem no nākamās vecākās
   
2. **Noliktavā (B)**:
   - FIFO tiek mantots no (A)
   - Rezidenta kastītē ir zāles ar konkrētu batch info
   - Automātiska mīnusošana ņem vērā batch secību

**Piemērs**:
```
Noliktava (A) - Aspirin 100mg:

Batch B2024-089, derīgs līdz 2026-08-15, 500 tab (saņemts 2024-12-01)
Batch B2024-145, derīgs līdz 2026-10-20, 300 tab (saņemts 2024-12-15)
Batch B2025-001, derīgs līdz 2027-01-10, 400 tab (saņemts 2025-01-05)

Medmāsa sagatavo 4 dienas Jānim: vajag 8 tabletes

Sistēma automātiski izvēlas:
✓ Batch B2024-089 (vecākais) → ņem 8 tab
✗ Batch B2024-145 (netiek izmantots vēl)
✗ Batch B2025-001 (jaunākais, lieto pēdējo)

Rezultāts (B_Jānis):
  Aspirin 100mg, Batch B2024-089, 8 tab
```

### 4.2. Batch tracking (Partiju uzskaite)

**Definīcija**: Katra zāļu partija tiek identificēta ar unikālu numuru un derīguma termiņu.

**Informācija par batch**:
- Batch numurs (piemēram, "B2024-089")
- Derīguma termiņš (piemēram, "2026-08-15")
- Saņemšanas datums
- Daudzums
- Ražotājs (ja zināms)

**Kāpēc svarīgi**:
- Zāļu atsaukšana (recall): ja batch bojāts, var izsekot
- Derīguma kontrole: brīdinājumi par beidzošos zālēm
- Juridiska prasība
- Kvalitātes kontrole

**Batch dzīves cikls**:
```
1. Saņemšana (A):
   Recipe Plus XML → Batch B2024-089, 500 tab, derīgs 2026-08
   
2. Transfer (A)→(B):
   Jānim sagatavo → Batch B2024-089, 8 tab
   
3. Izsniegšana:
   Jānis pieņem → Batch B2024-089, 1 tab (8 reizes)
   
4. Pārskati:
   Kuras zāles ar kuru batch rezidentiem izsniegtas
```

### 4.3. Brīdinājumi un alerti

#### 4.3.1. Zemi krājumi (A) noliktavā

**Triggers**: Daudzums nokrītas zem minimālā limita

**Brīdinājuma veidi**:
- 🟡 **Warning**: Daudzums < 2 nedēļu vidējais patēriņš
- 🔴 **Critical**: Daudzums < 4 dienu vidējais patēriņš
- ⚫ **Out of stock**: Daudzums = 0

**Kam redzams**: Galvenā medmāsa

**Piemērs**:
```
╔═══════════════════════════════════════════╗
║  ⚠️ ZEMI KRĀJUMI NOLIKTAVĀ (A)          ║
╠═══════════════════════════════════════════╣
║  🔴 Aspirin 100mg                        ║
║     Atlikums: 30 tab                     ║
║     Vidējais patēriņš: 15 tab/dienā      ║
║     Pietiek: ~2 dienas                   ║
║     [📦 Pasūtīt]                         ║
║                                           ║
║  🟡 Enalapril 10mg                       ║
║     Atlikums: 80 tab                     ║
║     Vidējais patēriņš: 8 tab/dienā       ║
║     Pietiek: ~10 dienas                  ║
║     [📦 Pasūtīt]                         ║
╚═══════════════════════════════════════════╝
```

#### 4.3.2. Beidzas derīguma termiņš

**Triggers**: Derīguma termiņš < 30 dienas

**Brīdinājuma veidi**:
- 🟡 **Warning**: < 30 dienas līdz termiņam
- 🔴 **Urgent**: < 7 dienas līdz termiņam
- ⚫ **Expired**: Termiņš beidzies

**Kam redzams**: Galvenā medmāsa

**Darbības**:
- Izmantot šīs zāles pirmās (manuāla prioritāte)
- Ja nevar izmantot → norakstīt/utilizēt
- Nekad neizsniegt beigušās zāles

**Piemērs**:
```
╔═══════════════════════════════════════════╗
║  ⏰ BEIDZAS DERĪGUMA TERMIŅŠ             ║
╠═══════════════════════════════════════════╣
║  🔴 Metformin 500mg                      ║
║     Batch: B2024-056                     ║
║     Derīgs līdz: 2025-01-15 (5 dienas)  ║
║     Atlikums: 45 tab                     ║
║     [📋 Izmantot pirmās]                 ║
║     [🗑️ Norakstīt]                      ║
║                                           ║
║  🟡 Simvastatin 20mg                     ║
║     Batch: B2024-078                     ║
║     Derīgs līdz: 2025-02-01 (25 dienas) ║
║     Atlikums: 120 tab                    ║
╚═══════════════════════════════════════════╝
```

#### 4.3.3. Nav zāļu rezidenta (B) noliktavā

**Triggers**: 
- Ordinācijas plāns nav izpildīts jo nav zāļu
- Nākamajām 4 dienām nepietiek

**Brīdinājuma veidi**:
- 🔴 **Critical**: Nav zāļu TAGAD (nevar izsniegt)
- 🟡 **Warning**: Nākamajām 4 dienām nepietiks

**Kam redzams**: Stāva medmāsa

**Darbības**:
- Pārbaudīt (A) pieejamību
- Ja (A) ir → transfer uz (B)
- Ja (A) NAV → brīdināt galveno māsu

**Piemērs**:
```
╔═══════════════════════════════════════════╗
║  🚨 NAV ZĀĻU REZIDENTAM                  ║
╠═══════════════════════════════════════════╣
║  Rezidents: Jānis Bērziņš (Istaba 12)   ║
║                                           ║
║  🔴 Aspirin 100mg                        ║
║     Plānots: 18:00 (šodien)              ║
║     Vajag: 1 tab                          ║
║     (B) atlikums: 0 tab                  ║
║     (A) atlikums: 500 tab ✓              ║
║     [⚡ Transfer no (A) tagad]           ║
║                                           ║
║  🟡 Enalapril 10mg                       ║
║     (B) atlikums: 2 tab                  ║
║     Vajag nākamajām 4 dienām: 4 tab      ║
║     (A) atlikums: 80 tab ✓               ║
║     [📋 Sagatavot 4 dienas]              ║
╚═══════════════════════════════════════════╝
```

---

## 5. Reporti un pārskati

### 5.1. Krājumu pārskats

**Mērķis**: Redzēt pašreizējo situāciju noliktavā

**Saturs**:
- Visu medikamentu saraksts
- Daudzumi pa noliktavām (A un B)
- Batch informācija
- Derīguma termiņi
- Vidējais patēriņš
- Novērtējums: cik dienām pietiks

**Filtrēšana**:
- Pēc medikamenta
- Pēc noliktavas
- Pēc rezidenta
- Tikai zemie krājumi
- Tikai beidzošās zāles

**Piemērs**:
```
╔═══════════════════════════════════════════════════════════╗
║  KRĀJUMU PĀRSKATS (A) NOLIKTAVA                          ║
║  Datums: 2025-01-08                                      ║
╠═══════════════════════════════════════════════════════════╣
║  Medikaments       │ Batch      │ Derīgs  │ Daudzums     ║
║  ─────────────────┼────────────┼─────────┼──────────────  ║
║  Aspirin 100mg    │ B2024-089  │ 08/2026 │ 500 tab      ║
║                   │ B2024-145  │ 10/2026 │ 300 tab      ║
║                   │            │ KOPĀ:   │ 800 tab      ║
║                   │            │ Patēriņš│ 15 tab/dienā ║
║                   │            │ Pietiek:│ ~53 dienas   ║
║  ─────────────────┼────────────┼─────────┼──────────────  ║
║  Enalapril 10mg   │ B2024-201  │ 03/2026 │ 80 tab  🟡   ║
║                   │            │ Patēriņš│ 8 tab/dienā  ║
║                   │            │ Pietiek:│ ~10 dienas   ║
║  ─────────────────┼────────────┼─────────┼──────────────  ║
║  Metformin 500mg  │ B2024-056  │ 01/2025 │ 45 tab  🔴   ║
║                   │            │         │ Derīgs: 5d   ║
╚═══════════════════════════════════════════════════════════╝
```

### 5.2. Patēriņa analīze

**Mērķis**: Saprast patēriņa tendences un optimizēt pasūtījumus

**Saturs**:
- Medikamenti ar lielāko patēriņu
- Patēriņa izmaiņas laika gaitā
- Salīdzinājums: plānotais vs faktiskais
- Atteikumu statistika

**Periods**: Pēdējā nedēļa / mēnesis / ceturksnis

**Piemērs**:
```
╔═══════════════════════════════════════════╗
║  PATĒRIŅA ANALĪZE - DECEMBRIS 2024       ║
╠═══════════════════════════════════════════╣
║  TOP 10 MEDIKAMENTI:                     ║
║                                           ║
║  1. Aspirin 100mg                        ║
║     Plānots: 450 tab                     ║
║     Izsniegts: 430 tab (95.6%)           ║
║     Atteikumi: 20 (4.4%)                 ║
║                                           ║
║  2. Enalapril 10mg                       ║
║     Plānots: 240 tab                     ║
║     Izsniegts: 236 tab (98.3%)           ║
║     Atteikumi: 4 (1.7%)                  ║
║                                           ║
║  Atteikumu iemesli:                      ║
║  • Slikta dūša: 45%                      ║
║  • Aizmirsa: 30%                         ║
║  • Cits: 25%                             ║
╚═══════════════════════════════════════════╝
```

### 5.3. Rezidenta zāļu izmaksas

**Mērķis**: Aprēķināt, cik rezidents maksā par zālēm

**Saturs**:
- Visi rezidentam izsniegti medikamenti
- Daudzums un vienības cena
- Kopējā summa
- Sadalījums: Recipe Plus vs radinieks atnesa

**Periods**: Pa mēnešiem (rēķina periods)

**Piemērs**:
```
╔═══════════════════════════════════════════╗
║  ZĀĻU IZMAKSAS - JĀNIS BĒRZIŅŠ          ║
║  Periods: Decembris 2024                 ║
╠═══════════════════════════════════════════╣
║  RECIPE PLUS ZĀLES:                      ║
║  ─────────────────────────────────────    ║
║  Aspirin 100mg                           ║
║    30 tab × €0.15 = €4.50                ║
║                                           ║
║  Enalapril 10mg                          ║
║    30 tab × €0.35 = €10.50               ║
║                                           ║
║  Metformin 500mg                         ║
║    60 tab × €0.25 = €15.00               ║
║  ─────────────────────────────────────    ║
║  Recipe Plus KOPĀ: €30.00                ║
║                                           ║
║  RADINIEKS ATNESA:                       ║
║  ─────────────────────────────────────    ║
║  Simvastatin 20mg                        ║
║    20 tab × €0.00 = €0.00                ║
║  ─────────────────────────────────────    ║
║  Radinieks KOPĀ: €0.00                   ║
║                                           ║
║  ═════════════════════════════════════    ║
║  KOPĀ MAKSĀT: €30.00                     ║
╚═══════════════════════════════════════════╝
```

**Piezīme**: Radinieku atnestas zāles parasti netiek iekļautas rēķinā (rezidents jau samaksāja).

### 5.4. Transfer vēsture

**Mērķis**: Audit trail - kas, kad, cik pārvietoja

**Saturs**:
- Visi transferi no (A) uz (B)
- Datums un laiks
- Medikaments un daudzums
- Batch informācija
- Kas veica (medmāsas vārds)

**Filtrēšana**:
- Pēc rezidenta
- Pēc medikamenta
- Pēc datuma perioda

---

## 6. Lietotāju lomas un piekļuve

### 6.1. Galvenā medmāsa

**Atbildība**: Lielās noliktavas (A) pārvaldība

**Piekļuve**:
- ✅ Skatīt un pārvaldīt (A) krājumus
- ✅ Reģistrēt Recipe Plus imports (AD-70)
- ✅ Reģistrēt manuālus pirkumus (AD-71)
- ✅ Skatīt visus pārskatus
- ✅ Konfigurēt brīdinājumu limitus
- ✅ Saskatīt visu (B) noliktavu statusu
- ✅ Norakstīt beigušās/bojātas zāles
- ⛔ Nevar mainīt (B) krājumus tieši

**Galvenie uzdevumi**:
- Pasūtīt zāles, kad zemi krājumi
- Kontrolēt derīguma termiņus
- Nodrošināt, ka pietiek zāļu 4 dienu sagatavošanai

### 6.2. Stāva medmāsa

**Atbildība**: Rezidentu (B) noliktavu pārvaldība

**Piekļuve**:
- ✅ Skatīt sava stāva rezidentu (B) krājumus
- ✅ Veikt transferus no (A) uz (B)
- ✅ Reģistrēt "radinieks atnesa"
- ✅ Atzīmēt atteikumus
- ✅ Skatīt izsniegšanas vēsturi
- ✅ Saskatīt brīdinājumus (nav zāļu)
- ⛔ Nevar mainīt (A) krājumus
- ⛔ Nevar skatīt citu stāvu rezidentus

**Galvenie uzdevumi**:
- Ik pēc 4 dienām sagatavot zāles
- Reģistrēt atteikumus
- Reģistrēt radinieku atnestas zāles

### 6.3. Administrators / Vadība

**Atbildība**: Pārskati, analīze, konfigurācija

**Piekļuve**:
- ✅ Visi pārskati un analīze
- ✅ Skatīt visu sistēmu (A un B)
- ✅ Eksportēt datus (Excel, PDF)
- ✅ Konfigurēt sistēmu
- ⛔ Parasti neveic ikdienas operācijas

**Galvenie uzdevumi**:
- Izmaksu analīze
- Patēriņa tendences
- Optimizācijas iespējas

---

## 7. Integrācija ar citiem moduļiem

### 7.1. Ordinācijas plāns (AD-17)

**Saistība**: Ordinācijas plāns nosaka, kad un cik zāles izsniegt

**Datu plūsma**:
```
Ordinācijas plāns → Noliktava
  • Grafiks (08:00, 12:00, 18:00, 22:00)
  • Medikaments + deva
  • Triggers automātisko mīnusošanu
```

**Biznesa loģika**:
- Ja ordinācija aktīva → sistēma automātiski mīnuso (B)
- Ja ordinācija deaktivēta → sistēma nemīnuso
- Ja ordinācija mainīta → pārrēķina 4 dienu vajadzības

### 7.2. Recipe Plus XML imports (AD-70)

**Saistība**: Recipe Plus piegādā zāles → tās ieiet (A) noliktavā

**Datu plūsma**:
```
Recipe Plus XML → Noliktava (A)
  • Medikaments
  • Daudzums
  • Batch + derīgums
  • Cena
  • Receptes Nr (ja ir)
  • Rezidenta ID (ja saistīts)
```

**Biznesa loģika**:
- XML tiek parsēts automātiski
- Ja rezidenta ID ir → saista ar rēķinu
- Ja batch jau eksistē → pieskaita daudzumu
- Ja jauns batch → izveido jaunu ierakstu

### 7.3. Manuāla zāļu ievade (AD-71)

**Saistība**: Ja zāles nopirktas citur (ne Recipe Plus)

**Datu plūsma**:
```
Medmāsas ievade → Noliktava (A)
  • Medikaments (no kataloga vai jauns)
  • Daudzums
  • Batch + derīgums (optional)
  • Cena
  • Čeka numurs / piezīmes
```

### 7.4. Līgumu sistēma / Rēķini

**Saistība**: Zāļu izmaksas iekļaujas rezidenta rēķinā

**Datu plūsma**:
```
Noliktava → Rēķins
  • Izsniegtas zāles (faktiskais patēriņš)
  • Recipe Plus zāles → maksā rezidents
  • Radinieks atnesa → nemaksā
  • Atteiktas zāles → nemaksā
```

**Biznesa loģika**:
- Mēneša beigās sistēma summē
- Tikai faktiski izsniegtas zāles
- Cena no Recipe Plus XML vai manuālās ievades
- Rezidents redz detalizētu sadalījumu rēķinā

---

## 8. Edge cases un izņēmumi

### 8.1. Rezidents izceļo / mirst

**Situācija**: Rezidentam (B) noliktavā paliek zāles

**Risinājums**:
1. Sistēma atzīmē rezidentu kā "neaktīvs"
2. (B) noliktava tiek "iesaldēta"
3. Opcijas:
   - **Atgriezt (A)**: Ja zāles derīgas un neatvērtas
   - **Nodot radiniekiem**: Reģistrē kā "nodots"
   - **Utilizēt**: Ja atvērtas vai nederīgas

**Process**:
```
╔═══════════════════════════════════════════╗
║  REZIDENTS IZCEĻO - JĀNIS BĒRZIŅŠ       ║
║  (B) Noliktavas atlikums:                ║
╠═══════════════════════════════════════════╣
║  ☐ Aspirin 100mg - 5 tab                ║
║     [↩ Atgriezt (A)] [👤 Nodot] [🗑️ Util]║
║                                           ║
║  ☐ Enalapril 10mg - 3 tab               ║
║     [↩ Atgriezt (A)] [👤 Nodot] [🗑️ Util]║
║                                           ║
║  [✓ Apstiprināt visu]                   ║
╚═══════════════════════════════════════════╝
```

### 8.2. Zāles beidzas pirms laika

**Situācija**: (A) nav pietiekami, lai sagatavotu 4 dienas

**Risinājums**:
1. Sistēma brīdina medmāsu
2. Sagatavo, cik ir pieejams
3. URGENT alerts: pasūtīt nekavējoties
4. Medmāsa var manuāli samazināt sagatavošanas dienas (piemēram, 2 dienas)

**Prioritāte**: Ja trūkst vairākām rezidentiem, sistēma piedāvā:
- Sadalīt proporcionāli
- Dot prioritāti smagākiem gadījumiem (pēc GIR)

### 8.3. Radinieks atnes medikamentu, kas NAV katalogā

**Situācija**: Jauns, reti sastopams medikaments

**Risinājums**:
1. Medmāsa izvēlas "Jauns medikaments"
2. Aizpilda formu:
   - Nosaukums
   - Forma (tabletes, kapsulas, šķidrums)
   - Stiprums (mg, ml)
   - ATC kods (ja zina)
3. Sistēma izveido jaunu medikamenta ierakstu
4. Piesaista (B) noliktavai

**Validācija**: Administrators vēlāk var papildināt informāciju

### 8.4. Batch recall (zāļu atsaukšana)

**Situācija**: Ražotājs atsauc konkrētu batch (kvalitātes problēma)

**Risinājums**:
1. Administrators ievada batch numuru
2. Sistēma atrod visās noliktavās (A un B)
3. Rāda, kuriem rezidentiem izsniegts
4. Atzīmē kā "atsaukts" (recall)
5. Generē pārskatu: kas jādara

**Process**:
```
╔═══════════════════════════════════════════╗
║  🚨 BATCH RECALL                         ║
║  Metformin 500mg, Batch B2024-056        ║
╠═══════════════════════════════════════════╣
║  ATRASTS:                                ║
║  • (A) Noliktava: 45 tab                 ║
║  • (B) Jānis Bērziņš: 4 tab             ║
║  • (B) Anna Liepa: 3 tab                 ║
║                                           ║
║  IZSNIEGTS (pēdējā mēnesī):              ║
║  • Jānis Bērziņš: 30 tab                ║
║  • Anna Liepa: 25 tab                    ║
║  • Pēteris Kalns: 20 tab                 ║
║                                           ║
║  DARBĪBAS:                               ║
║  [🗑️ Utilizēt visu]                     ║
║  [📋 Drukāt pārskatu]                   ║
║  [📧 Informēt ārstus]                   ║
╚═══════════════════════════════════════════╝
```

### 8.5. Sistēmas kļūda / atjaunošana

**Situācija**: Tehnisku iemeslu dēļ nevar pierakstīt

**Risinājums**:
- Sistēma ļauj medmāsai turpināt strādāt "offline"
- Vēlāk sinhronizē (ja iespējams)
- Manuāla korekcija caur "Manuāla transakcija"

---

## 9. Īstenošanas prioritātes

### 9.1. Fāze 1 (MVP - Minimālā versija)

**Jāievieš obligāti**:
- ✅ (A) un (B) noliktavu struktūra
- ✅ Recipe Plus XML imports → (A)
- ✅ Transfer (A) → (B) - 4 dienu sagatavošana
- ✅ Automātiska mīnusošana pēc ordinācijas plāna
- ✅ Atteikumu reģistrēšana un atjaunošana
- ✅ Pamata brīdinājumi (nav zāļu)
- ✅ Vienkāršs krājumu pārskats

**Var atlikt vēlāk**:
- 🔶 FIFO loģika (vienkāršojums: ņem jebkuru batch)
- 🔶 Derīguma termiņa brīdinājumi
- 🔶 Patēriņa analīze
- 🔶 Radinieks atnes → (B) (var reģistrēt manuāli caur (A))

### 9.2. Fāze 2 (Pilnvērtīga sistēma)

**Jāpievieno**:
- ✅ FIFO pilna implementācija
- ✅ Batch tracking visur
- ✅ Derīguma brīdinājumi
- ✅ "Radinieks atnes" → (B) tiešā kanāla
- ✅ Detalizēti pārskati un analīze
- ✅ Batch recall funkcionalitāte

### 9.3. Fāze 3 (Optimizācija)

**Jāuzlabo**:
- ✅ AI prognozēšana: kad pasūtīt
- ✅ Automatizēta 4 dienu sagatavošana
- ✅ Integrācija ar citām aptiekām (ne tikai Recipe Plus)
- ✅ Mobilā app medmāsām (skenēt batch QR kodus)

---

## 10. Glosārijs

**Termins** | **Skaidrojums**
---|---
**(A) Lielā noliktava** | Centrālā bulk noliktava pie galvenās medmāsas
**(B) Rezidenta noliktava** | Individuāla virtuāla/fiziska noliktava katram rezidentam
**FIFO** | First In, First Out - vecākās zāles izmanto pirmās
**Batch** | Zāļu partija ar unikālu numuru un derīgumu
**Transfer** | Pārcelšana no (A) uz (B)
**Dispensing** | Zāļu izsniegšana rezidentam
**Auto-dispensed** | Automātiski mīnusots pēc ordinācijas grafika
**Refused** | Rezidents atteicās pieņemt zāles
**Reversal** | Atteikuma gadījumā daudzuma atgriešana
**Recipe Plus** | Aptieka, no kuras importē XML rēķinus
**GIR** | Aprūpes līmenis pēc AGGIR skalas
**Recall** | Zāļu atsaukšana (kvalitātes problēma)

---

## 11. Kontaktpersonas un lēmumu pieņēmēji

**Biznesa puse**:
- **Anna**: Prasību apkopošana, feedback
- **Kristens**: Dokumentācija no sanāksmēm
- **Mārtiņš** (Adoro financists): Izmaksu aprēķini
- **Žanete**: [loma?]
- **Rezidences vadītājas**: AM, AŠ - procesa validācija

**Tehniskā puse**:
- **Gints**: Projekta vadība, UX, analīze

---

**Dokuments izveidots**: 2025-01-08  
**Versija**: 1.0  
**Statuss**: Gatavs apspriešanai ar komandu