# Adorable Client Intake Prototype

Klikšķināms prototips jauna klienta pievienošanas procesam Adorable ERP sistēmai.

## 🚀 Quick Start

### 1. Instalē dependencies

```bash
npm install
```

### 2. Palaid development serveri

```bash
npm run dev
```

Projekts atvērsies browser uz `http://localhost:5173`

### 3. Build production versijai

```bash
npm run build
```

Built files būs `dist/` mapē.

## 📋 Features

### Pilns klienta intake workflow ar 5 soļiem:

1. **Jauna klienta forma**
   - 4 obligātie lauki: vārds, uzvārds, e-pasts, telefons
   - 2 scenāriji: pats/-i sev vai radinieks/-ce
   - Validācija un kļūdu ziņojumi

2. **Lead (potenciālā klienta) karte**
   - Ģenerēts unikāls ID (L-2025-XXX)
   - Status badges
   - Kontaktinformācija
   - Nākamo soļu ceļvedis

3. **Konsultācijas rezultāts**
   - 2 izvēles: izveidot līgumu vai pievienot rindai
   - Vizuāli atšķirīgas path options

4. **Līguma izveides success screen**
   - Zaļš gradients
   - Līguma informācija
   - Nākamie soļi

5. **Gaidīšanas rindas success screen**
   - Zils gradients
   - Pozīcija rindā
   - Gaidīšanas laika novērtējums

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Ikonu bibliotēka

## 📁 Project Structure

```
adorable-prototype/
├── src/
│   ├── App.jsx          # Galvenā komponente ar visu loģiku
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind directives
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite konfigurācija
├── tailwind.config.js   # Tailwind konfigurācija
└── postcss.config.js    # PostCSS konfigurācija
```

## 🔧 Development

### Hot Reload

Izmaiņas `.jsx` failos automātiski redzamas browser bez refresh.

### Kā pievienot jaunas features

Viss kods ir `src/App.jsx` failā. Komponente izmanto React hooks (`useState`) state managementam.

### Integrācija ar backend

Lai integrētu ar reālu API:

1. Pievienot API endpoints `handleSubmit` funkcijā
2. Aizstāt mock data ar real data fetch
3. Pievienot loading states
4. Pievienot error handling

## 🎯 Next Steps

- [ ] Backend API integrācija
- [ ] Form validācija ar email/phone formāta pārbaudi
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error handling
- [ ] Papildu lauki (vecums, personas kods, rezidence preference)
- [ ] File upload functionality
- [ ] Print agreement functionality

## 📝 Notes

Šis ir standalone prototips - visi komponenti un state management ir vienā failā (`App.jsx`) vienkāršības pēc.

Production versijā ieteicams sadalīt pa atsevišķām komponentēm un izmantot state management library (Redux, Zustand, vai Context API).

## 🐛 Troubleshooting

**Ports jau aizņemts?**
```bash
npm run dev -- --port 3000
```

**Tailwind stili nedarbojas?**
Pārliecinies, ka `tailwind.config.js` un `postcss.config.js` ir pareizi konfigurēti.

**Lucide ikonas nedarbojas?**
```bash
npm install lucide-react
```

## 📞 Support

Ja ir jautājumi par Adorable ERP integrāciju, sazinies ar iConcept komandu.
