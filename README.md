# Adorable Prototype

Klientu uzņemšanas un rezidentu pārvaldības prototips Adoro aprūpes centram.

## Quick Start

```bash
npm install
npm run dev
```

Atveras: `http://localhost:5173`

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Lucide React (ikonas)
- localStorage (datu glabāšana)

## Project Structure

```
src/
├── components/          # UI komponentes
│   ├── prescriptions/   # Ordināciju komponentes
│   └── queue/           # Rindas komponentes
├── views/               # Lapu komponentes
├── domain/              # Biznesa loģika
├── constants/           # Konstantes
├── hooks/               # React hooks
└── App.jsx              # Galvenā app ar routing
```

## Modules

### 1. Lead Intake (Klientu uzņemšana)
Pilns process no pieteikuma līdz līgumam:
- Pieteikuma forma
- Konsultācija ar cenu aprēķinu
- Aptaujas anketa
- Līguma izveide vai rinda

### 2. Prescriptions (Ordinācijas plāns)
Medikamentu pārvaldība rezidentiem:
- Šodien - dienas plāns ar 4 laika slotiem
- Nedēļa - 7 dienu pārskats
- Vēsture - administrācijas žurnāls ar filtriem

## Data Storage

localStorage atslēgas:
- `adorable-leads` - klientu pieteikumi
- `adorable-prescription-residents` - rezidenti
- `adorable-prescriptions` - ordinācijas
- `adorable-administration-logs` - medikamentu žurnāls

## Commands

```bash
npm run dev      # Development serveris
npm run build    # Production build
npm run test     # Testi
```

## Documentation

- `CLAUDE.md` - Darba vadlīnijas
- `ARCHITECTURE.md` - Tehniskā arhitektūra
- `FUNKCIONALITĀTE.md` - Pilns funkcionalitātes apraksts
