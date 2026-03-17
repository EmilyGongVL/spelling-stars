# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

No test runner is configured.

## Architecture

**SpellingStars** is a React 19 + Vite 8 + TailwindCSS 4 educational spelling app for primary school children (Years 1–6).

### Routing & Pages

`src/router.jsx` defines 6 routes rendered via React Router DOM 7:

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Create/select student profile |
| `/dashboard` | StudentDashboard | View progress, select mode/grade |
| `/check` | CheckMode | Spelling quiz (`?grade=yearN`) |
| `/learn` | LearnMode | Word study mode |
| `/results` | ResultsSummary | Post-quiz summary |
| `/parent` | ParentDashboard | PIN-protected teacher view (default PIN: `1234`) |

### State Management

**Global state** lives in `src/context/UserContext.jsx` (React Context):
- `currentStudent`, `isParent` flag
- `selectStudent()`, `enterParentMode()`, `logout()`
- Persisted in `sessionStorage`

**Persistent data** is managed by `src/hooks/useProgress.js` via localStorage key `'spelling_app_data'`:
- All student profiles (name, grade, avatar)
- Session history (max 200 sessions per student)

**Quiz logic** lives in `src/hooks/useQuiz.js` — a state machine cycling through: `IDLE → PLAYING → FEEDBACK → COMPLETE`. It draws 10 random words for the selected grade and normalizes answers (lowercase, trim, strip punctuation).

**Speech** is handled by `src/hooks/useSpeech.js` using the Web Speech Synthesis API.

### Data

`src/data/wordLists.js` contains 30 words per year group (year1–year6). Each word has: `id`, `word`, `sentence`, `hint`, `difficulty`, `definition`, `synonyms`.

### Scoring

- 3 stars: ≥90% correct
- 2 stars: 60–89% correct
- 1 star: <60% correct
- Streak: consecutive sessions ≥60%

### Component Layout

```
src/components/
├── shared/   # Feature components: AppShell, WordInput, FeedbackBanner, GradeSelector
└── ui/       # Pure UI: Button, Card, Modal, ProgressBar, StarRating
```

Styling uses TailwindCSS utility classes with a purple gradient theme (`#667eea → #764ba2`).
