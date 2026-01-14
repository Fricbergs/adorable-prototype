# Prototips vs Backend - Salīdzinājums

**Datums:** 2026-01-14
**Prototips:** `/adorable-prototype` (React + localStorage)
**Backend:** `/adoro` (Laravel + Livewire + DB)

---

## LEĢENDA

```
✅ = Pilnībā implementēts
🔄 = Daļēji / in progress
❌ = Nav
```

---

## 1. REZIDENTI

| Funkcija | Prototips | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Rezidentu saraksts | ✅ | ✅ | `residents-index.blade.php` |
| Rezidenta profils | ✅ | ✅ | `residents-show.blade.php` |
| Pamatinformācija | ✅ | ✅ | `basic-information/` |
| Alerģijas/Diētas | ✅ | ✅ | `allergies-diets/` |
| Izmitināšana | ✅ | ✅ | `accommodation/` |
| Prombūtnes | ✅ | ✅ | `accommodation/absence/` |
| **Veselības aprūpe** | | | |
| → Māsas apskate | ✅ | ✅ | `nurses-examination/` |
| → Ārsta apskate | ✅ | ✅ | `doctors-examination/` |
| → Psihiatra apskate | ✅ | ✅ | `psychiatrists-examination/` |
| → Diagnozes | ✅ | ✅ | `diagnoses/` |
| → Rezidenta parametri | ✅ | ✅ | `resident-parameters/` |
| → Morsa skala | ✅ | ✅ | `morse-scale-examination/` |
| → Bartela indekss | ✅ | ✅ | `barthel-index-examination/` |
| → Bradena skala | ✅ | 🔄 | Backend? |
| → Vakcinācija | ✅ | 🔄 | `Vaccination.php` model ir |
| → Tehniskie palīglīdzekļi | ✅ | 🔄 | |
| **Sociālā aprūpe** | | | |
| → Psihologa atzinums | ✅ | ✅ | `psychologist-conclusion/` |
| → Psihologa konsultācija | ✅ | ✅ | `psychologist-consultation/` |
| → RUD skala | ✅ | ✅ | `suicide-risks/` |
| → Mini Mental Status | ✅ | ✅ | `mini-mental-status/` |
| → Sociālā darbinieka atskaite | ✅ | ✅ | `social-workers-reports/` |
| **Fiziskā aprūpe** | | | |
| → Aprūpes plāns | ✅ | ✅ | `care-plans/` |
| → Krišanas protokols | ✅ | ✅ | `fall-protocols/` |
| **Cits** | | | |
| → Pielikumi | ✅ | ✅ | `attachments/` |
| → Papildpakalpojumi | 🔄 | ✅ | `additional-services/` |
| → Kvartāla dati (ĶMI) | ✅ | ❌ | Tikai prototipā |

**REZIDENTI: ~90% sakrīt**

---

## 2. ADMINISTRĀCIJA (CRM)

| Funkcija | Prototips | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Klientu saraksts | ✅ | ✅ | `clients-index.blade.php` |
| Klienta forma | ✅ | ✅ | `clients-form.blade.php` (756 rindas!) |
| Pamatinformācija | ✅ | ✅ | `basic-information/` |
| Aprūpes līmenis | ✅ | ✅ | `level-of-care/` |
| Komunikācija | ✅ | ✅ | `communication/` |
| Gultas izvēle | ✅ | ✅ | `beds/` |
| Anketa | ✅ | ✅ | `survey/` |
| Finansējums | ✅ | ✅ | `funding/` |
| Pielikumi | ✅ | ✅ | `attachments/` |
| **Līgumi** | ✅ | ❌ | Tikai prototipā! |
| **Līguma druka** | ✅ | ❌ | Tikai prototipā! |

**ADMINISTRĀCIJA: ~80% sakrīt, LĪGUMI tikai prototipā**

---

## 3. ORDINĀCIJAS PLĀNS

| Funkcija | Prototips | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Šodien skats | ✅ | ❌ | |
| Nedēļas skats | ✅ | ❌ | |
| Mēneša skats | ✅ | ❌ | |
| Vēstures skats | ✅ | ❌ | |
| Ordinācijas izveide | ✅ | ❌ | |
| Zāļu iedošana | ✅ | ❌ | |
| Atteikumi | ✅ | ❌ | |
| Pauze/Atcelšana | ✅ | ❌ | |
| Druka | ✅ | ❌ | |

**ORDINĀCIJAS: 100% tikai prototipā, backend NAV**

---

## 4. ZĀĻU NOLIKTAVA

| Funkcija | Prototips | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Bulk noliktava | ✅ | ❌ | |
| Rezidenta krājums | ✅ | ❌ | |
| XML imports | ✅ | ❌ | |
| Manuāla ievade | ✅ | ❌ | |
| Pārvietošana | ✅ | ❌ | |

**NOLIKTAVA: 100% tikai prototipā, backend NAV**

---

## 5. GULTU FONDS

| Funkcija | Prototips | Backend | Piezīmes |
|----------|-----------|---------|----------|
| Gultu pārskats | ✅ | 🔄 | `Bed.php`, `Room.php` ir |
| Rezervēšana | ✅ | ✅ | `BedReservation.php` |
| Istabu admin | ✅ | 🔄 | |

**GULTU FONDS: Backend modeļi ir, UI daļēji**

---

## 6. ATSKAITES

| Funkcija | Prototips | Backend |
|----------|-----------|---------|
| RD līdzfinansējums | ❌ | ❌ |
| CFO atskaites | ❌ | ❌ |
| Gultu noslodze | 🔄 | ❌ |

**ATSKAITES: NAV nevienā**

---

## 7. MONEO INTEGRĀCIJA

| Funkcija | Prototips | Backend |
|----------|-----------|---------|
| Datu eksports | ❌ | ❌ |

**MONEO: NAV nevienā**

---

# KOPSAVILKUMS

## ✅ Sakrīt (prototips = backend):
- Rezidentu profili un apskates (~55 blade faili!)
- Administrācija/CRM (bez līgumiem)
- Gultu modeļi

## 🔴 Tikai prototipā (jākopē uz backend):
1. **Līgumu sistēma** - izveide, druka, aktivizēšana
2. **Ordinācijas plāns** - VISS (4 skati + CRUD + iedošana)
3. **Zāļu noliktava** - VISS

## ❌ Nav nekur:
1. RD līdzfinansējuma atskaite
2. Moneo integrācija
3. Grupu pasākumi

---

# IETEIKUMS

**Backend komandai (Ivo/Edžus) jāpievieno:**

| Prioritāte | Modulis | Avots |
|------------|---------|-------|
| 1 | Līgumi | No prototipa |
| 2 | Ordinācijas plāns | No prototipa |
| 3 | Zāļu noliktava | No prototipa |
| 4 | RD atskaite | Jauns |

**Laika novērtējums:**
- Līgumi: ~3-5 dienas (vienkāršs CRUD + PDF)
- Ordinācijas: ~1-2 nedēļas (komplekss)
- Noliktava: ~1 nedēļa
- RD atskaite: ~2-3 dienas

**Kopā: ~3-4 nedēļas** (reālistisks novērtējums)

---

*Ģenerēts 2026-01-14*
