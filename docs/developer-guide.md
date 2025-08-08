## Developer Guide

### Prerequisites
- Node.js 18+ (recommended)
- npm 9+

### Setup
```bash
npm install
npm run dev
```

### Build & test
```bash
npm run build
npm run preview
npm run lint
npm run test
```

### Tech overview
- React 18 + TypeScript using Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router for routing and protected routes
- React Query ready for server state
- Vitest + Testing Library for unit/UI tests; Playwright configured

### Project layout
- `src/pages/`: Route-level screens (`Index.tsx`, `AuthPage.tsx`, `NotFound.tsx`)
- `src/components/`: Feature and UI components (send money, QR, profile, etc.)
- `src/components/ui/`: shadcn/ui primitives
- `src/contexts/`: `AuthContext`, `TransactionContext`, `ComplaintContext`
- `public/`: Static assets

### State management
- `AuthContext`: in-memory users and auth flows; session persisted to `localStorage`
- `TransactionContext`: add transactions, deduct balance via `AuthContext.updateProfile`
- `ComplaintContext`: complaint list with add API and mock details

### Styling & theming
- Tailwind CSS utility classes throughout
- `ThemeProvider` from `next-themes` configured in `src/App.tsx`
- Use existing shadcn/ui primitives in `src/components/ui/`

### Adding a new route
1. Create a page in `src/pages/YourPage.tsx`
2. Import and add a `<Route />` in `src/App.tsx` before the catch-all
3. If protected, wrap it with the `ProtectedRoute` component

### Adding a UI component
1. Prefer composing from `src/components/ui/`
2. Keep component APIs small and focused
3. Add tests in `src/__tests__/` where reasonable

### Production readiness
- Replace in-memory data with real APIs and persistence
- Wire React Query to your backend
- Add authentication and secure storage
- Add e2e tests for critical flows