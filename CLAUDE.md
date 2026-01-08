# Claude Code Guidelines

## Working Style

1. **Think first, then act** - Read the codebase for relevant files before making changes.
2. **Check in before major changes** - Verify the plan with the user before implementing.
3. **Explain at a high level** - Provide concise summaries of what changes were made.
4. **Keep it simple** - Every change should impact as little code as possible. Avoid massive or complex changes.
5. **Maintain documentation** - Keep ARCHITECTURE.md updated with how the app works.
6. **Never speculate** - Always read files before answering questions about them. Give grounded, hallucination-free answers.

## Project Overview

This is **Adorable Prototype** - a care facility management system for Latvian elderly care homes. The UI is entirely in Latvian.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- localStorage for data persistence (prototype stage)
- Lucide React for icons

## Key Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── prescriptions/   # Medication management components
│   └── queue/           # Queue management components
├── views/            # Page-level components
├── domain/           # Business logic and data helpers
├── constants/        # Shared constants
└── App.jsx           # Main app with routing
```

## Current Features

- **Resident Management** - View and manage care home residents
- **Prescriptions (Ordinācijas plāns)** - Medication scheduling with:
  - Today view (Šodien) - Current day's medications
  - Weekly view (Nedēļa) - 7-day schedule
  - History view (Vēsture) - Administration records with filtering
- **Queue Management** - Resident queue tracking

## Data Storage

All data persisted to localStorage with keys:
- `adorable-prescription-residents`
- `adorable-prescriptions`
- `adorable-administration-logs`

## Latvian UI Terms

| Latvian | English |
|---------|---------|
| Rezidents | Resident |
| Ordinācija | Prescription |
| Iedota | Given |
| Atteikums | Refusal |
| Rīts/Diena/Vakars/Nakts | Morning/Noon/Evening/Night |
| Nedēļa | Week |
| Vēsture | History |
| Šodien | Today |

## Session Notes

### 2025-01-07
**Completed:**
- Added Weekly view (Nedēļa) and History view (Vēsture) to prescriptions
- Implemented visible X button for refusals (red cross on white background)
- Removed edit pencil (doctors-only feature)
- Widened PageShell from max-w-4xl to max-w-6xl to match Adoro production
- Created CLAUDE.md and ARCHITECTURE.md
- Cleaned up outdated markdown files (STATUS_FLOW.md, PHASE2_ENHANCEMENTS.md, REFACTORING_SUMMARY.md, DARBA_KOPSAVILKUMS_2025-12-24.local.md, TODO.local.md, FUNKCIONALITĀTE.md)
- Updated README.md to current state

**Current state:** Prescriptions module fully functional with Today/Week/History views. Refusal workflow working with visible X buttons.
