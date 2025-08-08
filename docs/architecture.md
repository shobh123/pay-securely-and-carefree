## Architecture

### App composition
- `src/App.tsx`
  - Wraps app with providers: `QueryClientProvider`, `ThemeProvider`, `AuthProvider`, `TransactionProvider`, `ComplaintsProvider`, `TooltipProvider`
  - Sets up `BrowserRouter` with protected routes

### Providers
- `AuthContext`
  - Users stored in memory (with a few demo accounts)
  - Login, signup, demo login, logout, and `updateProfile`
  - Session persisted to `localStorage`
- `TransactionContext`
  - In-memory list of transactions
  - `addTransaction` and `deductBalance` (delegates to `AuthContext.updateProfile`)
- `ComplaintContext`
  - In-memory complaints with investigation metadata and timeline
  - `addComplaint` API returns the created complaint

### Feature modules
- `Dashboard`: Overview, balance, quick actions, insights, and recent transactions
- `SendMoney`: Multi-destination send flow + trust indicators, notes, review/complaint actions
- `QRScanner`: Simulated scanner UX and payment confirmation
- `ReviewSystem`: Ratings, comments, category flags; charges $5 per review
- `ComplaintStatus`: Case list with details in dialogs
- `Profile`: Settings, theme toggle, sign out

### UI system
- Tailwind CSS for styling
- shadcn/ui primitives in `src/components/ui/` for accessible, composable components
- lucide-react icons

### Routing
- `react-router-dom` with a `ProtectedRoute` wrapper that shows a loading state while auth resolves and redirects to auth when needed

### Data & async
- Minimal async via timeouts for simulated API delay
- `@tanstack/react-query` is configured for future server data

### Testing
- Unit/UI tests with Vitest and Testing Library
- Playwright config present for e2e (extend as needed)