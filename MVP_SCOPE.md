# Adorable MVP Scope - 1. Kārta

**Deadline:** 2 mēneši (līdz ~2026-03-14)
**Klients:** Adoro (aprūpes centrs)
**Statuss:** Dokumenta versija 1.0

---

## MUST HAVE - Obligāti 1. kārtā

### 1. Rezidentu sadaļa (AD-10)
**Status: Lielākā daļa test stage**

| Funkcija | Status | Piezīmes |
|----------|--------|----------|
| Rezidentu saraksts ar filtriem | ✅ Test stage | Stāvi, nodaļas, demence |
| Pamatinformācija | ✅ Test stage | |
| Izmitināšana | ✅ Test stage | |
| Diagnozes | ✅ Test stage | SSK klasifikators |
| Māsas apskate | ✅ Test stage | |
| Ārsta apskate | 🔄 In progress | Uzlabojumi |
| Psihiatra apskate | 🔄 In progress | Uzlabojumi |
| Fizioterapeita apskate (SFK) | ✅ Test stage | |
| Rezidenta parametri | ✅ Test stage | |
| Bradena skala (izgulējumi) | ✅ Test stage | |
| Morsa skala (kritieni) | ✅ Test stage | |
| Bartela indekss | ✅ Test stage | |
| Tehniskie palīglīdzekļi | ✅ Test stage | |
| Vakcinācija | ✅ Test stage | |
| Aprūpes līmeņa noteikšana | ✅ Test stage | |
| Psihologa atzinums/konsultācija | ✅ Test stage | |
| RUD skala (pašnāvības risks) | ✅ Test stage | |
| Mini Mental Status tests | ✅ Test stage | |
| Sociālā darbinieka atskaite | ✅ Test stage | |
| Aprūpes plāns | ✅ Test stage | |
| Krišanas protokols | ✅ Test stage | |

**TRŪKST 1. kārtai:**
- [ ] **Ordinācijas plāns - plānošana** (AD-17) - ⚠️ KRITISKS
- [ ] Medmāsas kvartāla dati (svars, ĶMI) - JAUNS
- [ ] Papildpakalpojumi (fizioterapeits, frizieris) - gaida cenrādi no Adoro

---

### 2. Administrācija / CRM (AD-45)
**Status: In progress**

| Funkcija | Status | Piezīmes |
|----------|--------|----------|
| Klientu saraksts | ✅ Test stage | |
| Jauna klienta pievienošana | ✅ Test stage | |
| Klienta forma | ✅ Test stage | |
| Istabas izvēle | ✅ Test stage | Gultu pieejamība pēc datuma! |
| Klients - Komunikācija | ✅ Test stage | |
| Klients - Finansējums | ✅ Test stage | Pensijas, pabalsti, RD līdzfinansējums |
| Klients - Pielikumi | ✅ Test stage | |
| Pieteikumu sadaļa | ❌ To do | AD-95 |

**TRŪKST 1. kārtai:**
- [ ] **Līguma izveide** (AD-58) - ⚠️ KRITISKS
  - Pamata līgums
  - Pielikums
  - Melnraksta saglabāšana (nepilnīgi dati OK)
  - Poga "Saglabāt un drukāt"
  - Līguma parakstīšanas ķeksis
  - Rezidenta iebraucināšana ar pogu
- [ ] Gultas vietu datubāze (AD-59) - gaida cenrādi
- [ ] Vairāku rezidentu piesaiste klientam (AD-66)
- [ ] 10% atlaide (daktera ģimene vai 2 cilvēki)
- [ ] Vienošanās par mantu glabāšanu seifā (drukājams PN akts)

---

### 3. Gultu fonds (AD-60)
**Status: To do**

| Funkcija | Status | Piezīmes |
|----------|--------|----------|
| Gultas vietu datubāze | ❌ To do | Gaida cenrādi 2026 |
| UI sadaļai | ❌ To do | |
| Demences nodaļa atsevišķi | ❌ To do | 3. stāvs = demence |
| Rezervēšana pēc datuma | ❌ To do | KRITISKS - līguma sākuma datums |

**Prasības (no 12.01 tikšanās):**
- Demences nodaļa rāda tikai demences istabas
- Gultu pieejamība jāskatās uz līguma sākuma datumu, ne šodienu
- Dashboard: "Kad būs tuvākā brīvā vieta?"

---

### 4. Zāļu noliktava (AD-69)
**Status: To do - VAR ATLIKT?**

| Funkcija | Status | Prioritāte |
|----------|--------|------------|
| Zāļu avoti (Adoro/klienta atnests) | ❌ To do | Must |
| Manuāla zāļu pievienošana | ❌ To do | Must |
| XML rēķinu apstrāde | ❌ To do | Nice to have |
| Automātiska patēriņa reģistrēšana | ❓ | Nav vienošanās! |
| Inventarizācija | ❌ To do | Nice to have |

---

### 5. Ordinācijas plāns
**Status: ⚠️ KRITISKI NEPABEIIGTS**

**Prototipā jau ir:**
- Šodien skats (Today)
- Nedēļas skats
- Mēneša skats (30 dienas)
- Vēstures skats
- Zāļu iedošana/atteikums
- Zāļu pauze/atcelšana

**TRŪKST 1. kārtai:**
- [ ] **Ordinācijas plāna IZVEIDE** (dakteru funkcija)
- [ ] Drukājams mēneša skats vienam rezidentam
- [ ] Plānošana uz priekšu
- [ ] Atteikumu saraksts zem mēneša skata
- [ ] Zāļu labošana (deva, pārtraukšana)

---

## NICE TO HAVE - Var atlikt

### 6. Atskaites
- RD 500/800 EUR līdzfinansējuma pieteikums
- CFO atskaites (nav specifikācija)
- Gultas vietu noslodze
- Rezidentu pārskati

### 7. Moneo integrācija
- Pamatdatu padošana (rezidents, tarifs, dienas)
- Gaida kontaktpersonu no Moneo

### 8. Grupu pasākumi
- Nav detalizēti plānots

---

## BLOĶĒTĀJI - Gaida info no Adoro

| Kas trūkst | Atbildīgais | Status |
|------------|-------------|--------|
| Cenrādis 2026 + istabu DB | Adoro/Anna | Saņemts fails, jāimportē |
| Moneo kontakti | Adoro/Anna | Gaida |
| Līguma šabloni/pielikumi | Adoro | AD-65 |
| Papildpakalpojumu saraksts | Adoro | Gaida |
| RD līdzfinansējuma formula | Adoro/Kristens | AD-88 |

---

## KOMANDA

| Persona | Loma | Status |
|---------|------|--------|
| Gints Fricbergs | Founder / PM | Aktīvs |
| Ivo Zibens | Backend dev | Aktīvs |
| Edžus Kašs | Frontend dev | Aktīvs |
| Ivars Šaudinis | Dev | Aktīvs |
| Armands Līsmanis | Dizains | Pieejams |
| Kristens Blūms | Ex-PM | Aizgāja |

---

## PROTOTIPS (šis repo)

Prototips `adorable-prototype` satur funkcionālu UI priekš:
- Rezidentu saraksts ar filtriem
- Ordinācijas plāna skati (Today/Week/Month/History)
- Zāļu iedošana/atteikums/pauze
- Gultu fonds ar statistiku
- Līgumu izveide/rediģēšana
- Medmāsas kvartāla dati ar ĶMI

**Nav savienots ar backend** - viss localStorage.

---

## NĀKAMIE SOĻI

### Šonedēļ (14-17.01):
1. [ ] Saskaņot šo dokumentu ar komandu
2. [ ] Importēt cenrādi 2026 gultu DB
3. [ ] Definēt Ordinācijas plāna izveides flow

### Līdz janvāra beigām:
1. [ ] Līguma izveides pilns flow
2. [ ] Gultu fonds ar demences nodaļu
3. [ ] Ordinācijas plāna izveide (dakteru UI)

### Februārī:
1. [ ] Integrācijas testi
2. [ ] UAT ar Adoro
3. [ ] Zāļu noliktava (ja laiks atļauj)

---

## SAITES

- **Testa vide:** https://adoro-dev.ict.lv/
- **Dizains:** [Figma](https://www.figma.com/design/KmRNXTdEl4jlrHk3wMn3Rf/Adoro)
- **Shēma:** [FigJam](https://www.figma.com/board/C0BKsaYfnZbMhNEW5FufhS/AdoroERP)
- **Optima ERP docs:** [Google Drive](https://drive.google.com/drive/folders/1RFjYozHYQGHEz2nEgiyi8geOoEo0WoGw)
- **ClickUp:** Adorable space

---

*Dokuments ģenerēts 2026-01-14 no ClickUp datiem*
