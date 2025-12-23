# Adoro Melodija - Klientu Uzņemšanas Sistēmas Funkcionālā Dokumentācija

## Pārskats

Adoro Melodija klientu uzņemšanas sistēma ir prototips, kas paredzēts, lai automatizētu un optimizētu jaunu rezidentu uzņemšanas procesu aprūpes centrā. Sistēma nodrošina pilnu klienta ceļu no pirmā kontakta līdz līguma parakstīšanai vai iekļaušanai rindā.

## Galvenās Funkcijas

### 1. Navigācijas Sistēma
- **Galvenā izvēlne**: Horizontāla navigācijas josla ar Adoro Melodija logo
- **Pieteikumu sadaļa**: Dropdown izvēlne ar divām apakšsadaļām:
  - Jauni pieteikumi - visu pieteikumu saraksts
  - Rinda - rindā esošie klienti
- **Administratora indikators**: Parāda pašreizējo lietotāja lomu (Admin/Client)

### 2. Klienta Uzņemšanas Process

#### 2.1 Pieteikuma Izveidošana
**Mērķis**: Uztvert sākotnējo kontaktu ar potenciālo klientu

**Ievadāmie dati**:
- Vārds
- Uzvārds
- E-pasta adrese
- Tālruņa numurs
- Komentāri (neobligāti)

**Rezultāts**:
- Izveidots jauns pieteikums ar statusu "Pieteikums"
- Automātiski ģenerēts ID numurs (L-YYYY-XXX formātā)
- Piešķirts atbildīgais darbinieks (pašlaik: Kristens Blūms)

#### 2.2 Konsultācija
**Mērķis**: Novērtēt klienta vajadzības un sagatavot piedāvājumu

**Ievadāmie dati**:
- Filiāle (Melodija / Šampēteris)
- Aprūpes līmenis (1, 2, 3, vai 4)
- Uzturēšanās ilgums (ilglaicīga/īslaicīga)
- Istabas veids (vienvietīga/divvietīga/trīsvietīga)
- Anketas aizpildīšanas veids (klients apmeklēja iestādi / saziņa pa tālruni vai e-pastu)
- Demences pazīme (jā/nē)
- Iekšējās piezīmes (neobligāti)

**Automātiskā Cenu Aprēķināšana**:
Sistēma automātiski aprēķina dienas izmaksas, pamatojoties uz:
- Aprūpes līmeni
- Istabas tipu
- Uzturēšanās ilgumu
- Demences klātbūtni (papildu maksa)

**Rezultāts**:
- Status mainās uz "Piedāvājums nosūtīts"
- Saglabāts konsultācijas rezultāts ar cenu

#### 2.3 Aptaujas Anketa
**Mērķis**: Savākt visu nepieciešamo juridisko un personisko informāciju līguma sagatavošanai

**Rezidenta Informācija**:

*Identitāte*:
- Vārds
- Uzvārds

*Kontakti*:
- Tālrunis
- E-pasts (neobligāti)

*Personas dati*:
- Dzimšanas datums
- Personas kods

*Deklarētā dzīvesvieta*:
- Iela, māja, dzīvoklis
- Pilsēta
- Pasta indekss

*Papildu dati*:
- Dzimums (vīrietis/sieviete)
- Invaliditātes grupa (nav/1/2/3)

*Termiņi*:
- Invaliditāte no (tikai ja ir invaliditāte)
- Invaliditāte līdz (tikai ja ir invaliditāte)
- Plānotais uzturēšanās sākuma datums
- Plānotais uzturēšanās beigu datums (neobligāti)

*Līguma papildus noteikumi*:
- Drošības nauda (ir/nav)
- Drošības naudas summa (EUR, ja piemērojams)
- Maksas termiņš
- Veselības datu nodošana apgādniekam (jā/nē, automātiski "jā" ja līgumu paraksta radinieks)
- Personas dokumentu glabāšana (pie pakalpojuma sniedzēja / pie klienta)

*Papildus pakalpojumi*:
- Veļas mazgāšana un marķēšana (jā/nē)
- Podologs (jā/nē)
- Podologa apmeklējumu skaits mēnesī (ja piemērojams)
- Citi papildus pakalpojumi (jā/nē)
- Citu pakalpojumu apraksts (ja piemērojams)

**Līguma Parakstītāja Izvēle**:

Sistēma atbalsta divus scenārijus:

1. **Rezidents pats**: Līgumu paraksta rezidents personīgi
   - Rēķini tiks sūtīti uz rezidenta e-pastu
   - Nav nepieciešama papildu informācija

2. **Radinieks/Pilnvarotā persona**: Līgumu paraksta cita persona
   - Jāievada parakstītāja informācija:
     - Vārds un uzvārds
     - Radniecība/statuss (dēls/meita, laulātais, pilnvarotā persona, sociālais darbinieks, cits)
     - Tālrunis
     - E-pasts
     - Deklarētā dzīvesvieta (iela, pilsēta, pasta indekss)
     - Personas kods

**Dinamiskās Formas Īpašības**:
- Invaliditātes datumu lauki parādās tikai tad, kad izvēlēta invaliditātes grupa
- Parakstītāja informācijas sadaļa parādās tikai scenārijā "Radinieks/Pilnvarotā persona"
- Lauki automātiski iepriekš aizpildīti no sākotnējā pieteikuma un konsultācijas datiem

**Rezultāts**:
- Status mainās uz "Anketa aizpildīta"
- Visi dati saglabāti un gatavi pārskatam

#### 2.4 Pārskats un Lēmums
**Mērķis**: Pārskatīt savāktos datus un pieņemt lēmumu par tālākajām darbībām

**Attēlotā Informācija**:
- Piedāvājuma kopsavilkums (filiāle, aprūpe, istaba, cena)
- Pilna rezidenta informācija
- Parakstītāja informācija (ja piemērojams)

**Pieejamās Darbības**:

1. **Izveidot līgumu**:
   - Automātiski ģenerē līguma numuru (A-YYYY-XXX formātā)
   - Maina statusu uz "Līgums parakstīts"
   - Pāriet uz sekmīgas līguma izveides ekrānu

2. **Pievienot rindai**:
   - Maina statusu uz "Rindā"
   - Saglabā visus datus rindas pārvaldībai
   - Pāriet uz rindas apstiprinājuma ekrānu

### 3. Progresa Izsekošana

**4-Soļu Progresa Josla**:

1. **Pieteikums** (Zaļš ✓)
   - Aktīvs: Nekad (vienmēr pabeigts, ja skatās)
   - Pabeigts: Vienmēr, kad pieteikums saglabāts

2. **Konsultācija** (Oranžs 🔄 / Zaļš ✓)
   - Aktīvs: Kad statuss = "Pieteikums"
   - Pabeigts: Kad statuss = "Piedāvājums nosūtīts" vai vēlāk

3. **Anketa** (Oranžs 🔄 / Zaļš ✓)
   - Aktīvs: Kad statuss = "Piedāvājums nosūtīts"
   - Pabeigts: Kad statuss = "Anketa aizpildīta" vai vēlāk

4. **Līgums** (Oranžs 🔄)
   - Aktīvs: Kad statuss = "Anketa aizpildīta", "Līgums parakstīts" vai "Rindā"
   - Pabeigts: Nekad (gala stāvoklis)

### 4. Statusu Sistēma

**Statusa Plūsma**:
```
Pieteikums → Konsultācija → Anketa aizpildīta → Līgums parakstīts
                                              → Rindā
                                              → Atcelts (no jebkura posma)
```

**Statusa Apraksti**:

| Status | Latviešu | Apraksts | Krāsa |
|--------|----------|----------|-------|
| `prospect` | Pieteikums | Jauns pieteikums, gaida konsultāciju | Oranžs |
| `consultation` | Konsultācija | Konsultācija notiek vai pabeigta | Dzeltens |
| `survey_filled` | Anketa | Anketa aizpildīta, gatavs līgumam | Violets |
| `agreement` | Līgums | Līgums parakstīts | Zaļš |
| `queue` | Rindā | Pievienots rindai, nav brīvu vietu | Zils |
| `cancelled` | Atcelts | Pieteikums atcelts | Pelēks |

### 5. Saraksta Skats

**Funkcionalitāte**:
- Visu pieteikumu un klientu pārskats
- Filtrēšana pēc skata (Visi pieteikumi / Rinda)
- Statistika pēc statusiem:
  - Pieteikumi skaits
  - Konsultāciju skaits
  - Anketu skaits
  - Līgumu skaits
  - Rindā skaits
  - Atcelto skaits (ar pārslēdzamo filtru)

**Mobilā Versija**:
- Kartīšu izkārtojums mobilajām ierīcēm
- Tabulas izkārtojums darbvirsmas ierīcēm
- Responsīvs dizains visiem ekrānu izmēriem

**Redzamā Informācija**:
- Klienta vārds un uzvārds
- Statusa žetons
- Kontaktinformācija (e-pasts, tālrunis)
- ID numurs
- Izveidošanas datums
- Cena (ja pieejama)

### 6. Datu Saglabāšana

**LocalStorage Integrācija**:
- Visi dati tiek saglabāti pārlūkprogrammas localStorage
- Automātiska datu sinhronizācija
- Dati saglabājas starp sesijām
- Nav nepieciešams serveris prototipa testēšanai

**Saglabātie Dati**:
- Pieteikuma pamata informācija
- Konsultācijas rezultāti
- Aptaujas atbildes
- Līguma numurs (ja izveidots)
- Statusa vēsture
- Atcelšanas informācija (iemesls, datums, piezīmes)

## Lietotāja Plūsmas

### Plūsma 1: Jauns Klients līdz Līgumam

1. Administrators saņem zvanu/e-pastu no potenciālā klienta
2. Pievieno jaunu pieteikumu ar kontaktinformāciju
3. Veic konsultāciju klātienē vai pa tālruni
4. Ievada konsultācijas rezultātus (aprūpes līmenis, istaba, u.c.)
5. Sistēma aprēķina cenu automātiski
6. Administrators aizpilda detalizētu aptaujas anketu
7. Pārskata visu savākto informāciju
8. Izveido līgumu (sistēma ģenerē līguma numuru)
9. Līgums gatavs parakstīšanai

### Plūsma 2: Jauns Klients uz Rindas

1. Administrators saņem pieteikumu
2. Pievieno kontaktinformāciju
3. Veic konsultāciju
4. Aizpilda aptaujas anketu
5. Pārskata informāciju
6. Pievieno rindai (nav brīvu vietu)
7. Klients saglabāts rindā ar visu informāciju

### Plūsma 3: Rindas Pārvaldība

1. Administrators atver "Rinda" skatu
2. Redz visus rindā esošos klientus
3. Var atlasīt klientu un redzēt pilnu informāciju
4. Kad vieta kļūst pieejama, var izveidot līgumu

### Plūsma 4: Pieteikuma Atcelšana

1. Administrators var atcelt pieteikumu no jebkura soļa
2. Atlasa atcelšanas iemeslu no saraksta:
   - Nav vietu
   - Cena pārāk augsta
   - Nepiemērota atrašanās vieta
   - Atrada citu iestādi
   - Pārdomāja lēmumu
   - Nav atbildes no klienta
   - Cits iemesls
3. Var pievienot papildu piezīmes
4. Pieteikums saglabājas ar statusu "Atcelts"
5. Atceltos pieteikumus var skatīt, ieslēdzot attiecīgo filtru

## Tehniskās Īpašības

### Validācija
- Obligāto lauku pārbaude
- E-pasta formāta validācija
- Tālruņa numura validācija
- Personas koda formāta pārbaude
- Trūkstošo datu pārbaude pirms līguma izveides
- Kategorizēta trūkstošo lauku attēlošana (konsultācija, rezidents, apgādnieks)

### Automātizācija
- Automātiska cenu aprēķināšana
- Automātiska ID un līguma numuru ģenerēšana
- Automātiska statusu atjaunināšana
- Automātiska datu priekšaizpildīšana

### Lietotāja Pieredze
- Intuitīva navigācija
- Skaidras progresa indikācijas
- Responsīvs dizains (optimizēts mobilajām ierīcēm)
- Ātras pārejas starp ekrāniem
- Datu saglabāšana reāllaikā
- Automātiska ritināšana uz attiecīgajām sadaļām
- Vizuāli trūkstošo datu izcelšana līguma veidlapā

## Nākotnes Paplašinājumi (Plānots)

1. **E-pasta Integrācija**:
   - Automātiska piedāvājuma e-pasta nosūtīšana klientam
   - Klients aizpilda anketu tiešsaistē caur e-pastu
   - Automātiska paziņojuma nosūtīšana pie statusa izmaiņām

2. **Dokumentu Ģenerēšana**:
   - PDF līguma ģenerēšana
   - Piedāvājuma dokumenta izveide
   - Rēķinu sistēma

3. **Kalendāra Integrācija**:
   - Konsultāciju plānošana
   - Atgādinājumi par sekojošiem soļiem
   - Vietu pieejamības kalendārs

4. **Paplašināta Analītika**:
   - Konversijas rādītāji
   - Vidējais laiks no pieteikuma līdz līgumam
   - Atteikumu iemesli un analīze

## Jaunākās Funkcijas (2025-12-23)

### 1. Atcelšanas Funkcionalitāte
- Iespēja atcelt pieteikumus no jebkura posma
- 7 iepriekš definēti atcelšanas iemesli
- Atcelšanas datuma un piezīmju saglabāšana
- Pārslēdzams filtrs atcelto pieteikumu skatīšanai
- Vizuāla pelēka norāde atceltajiem pieteikumiem

### 2. Trīsvietīgu Istabu Atbalsts
- Pievienota trīsvietīgu istabu opcija konsultācijā
- Automātiska cenu aprēķināšana trīsvietīgām istabām
- Konsekventā attēlošana visos skatos
- Testēta un dokumentēta funkcionalitāte

### 3. Pilnīgi Līguma Lauki
- Drošības naudas pārvaldība
- Veselības datu piekrišanas pārvaldība
- Personas dokumentu glabāšanas izvēle
- Papildus pakalpojumi:
  - Veļas mazgāšana un marķēšana
  - Podologa pakalpojumi ar frekvenču
  - Citi individuāli pakalpojumi

### 4. Uzlabota Datu Validācija
- Automātiska trūkstošo datu pārbaude
- Kategorizēta trūkstošo lauku attēlošana
- Vizuāla trūkstošo datu izcelšana līguma veidlapā
- Intuitīva navigācija uz trūkstošajiem datiem

### 5. Atpakaļsaderība
- Visi uzlabojumi darbojas ar esošajiem datiem
- Automātiska vecāko ierakstu migrācija
- Noklusējuma vērtības trūkstošajiem laukiem

## Sistēmas Ierobežojumi (Prototips)

- Nav autentifikācijas/lietotāju pārvaldības
- Dati tiek glabāti tikai lokāli (localStorage)
- Nav reāla e-pasta nosūtīšanas
- Nav dokumentu ģenerēšanas
- Trīsvietīgu istabu cenas ir placeholders (jāatjaunina ar faktiskajām)
- Nav daudzvalodu atbalsta
- Nav administratīvo lomu (visi lietotāji ir administratori)

## Izmantotās Tehnoloģijas

- **React 18.3.1** - Lietotāja interfeiss
- **Vite 6.0.1** - Izstrādes vide
- **Tailwind CSS** - Stili
- **Lucide React** - Ikonas
- **LocalStorage API** - Datu saglabāšana

---

*Dokumenta versija: 2.0*
*Pēdējo reizi atjaunots: 2025-12-23*
*Sistēmas statuss: Prototips*

## Izmaiņu Vēsture

### Versija 2.0 (2025-12-23)
- Pievienota atcelšanas funkcionalitāte
- Pievienots trīsvietīgu istabu atbalsts
- Paplašināti līguma lauki (drošības nauda, pakalpojumi)
- Uzlabota datu validācija un vizualizācija
- Responsīvie uzlabojumi visiem skatiem
- 11 BugBot labojumi un optimizācijas

### Versija 1.0 (2025-12-22)
- Sākotnējā dokumentācija
- Pamata funkcionalitāte
