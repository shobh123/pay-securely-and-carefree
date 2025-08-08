# Digital Wallet — React + Vite + shadcn/ui

A beautiful, mobile-first digital wallet experience built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. Send money, scan QR codes, review recipients, and track complaints — all in a sleek, responsive interface.

- **Tech stack**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), React Router, React Query, lucide-react
- **Key features**: Send Money (contacts/phone/UPI/bank), QR Pay (simulated), Reviews with category flags, Complaint tracking with timeline, Transaction history, Profile & theme toggle

---

### Highlights
- **Modern UI**: shadcn/ui components + Tailwind for clean, accessible design
- **Fast DX**: Vite for instant dev server and optimized builds
- **State & data**: Context providers for Auth, Transactions, Complaints; React Query ready
- **Mobile-first**: Optimized layouts for phones; smooth interactions

---

### Quick start
```bash
# 1) Install dependencies (Node.js 18+ recommended)
npm install

# 2) Start the dev server
npm run dev

# 3) Build for production
npm run build

# 4) Preview the production build
npm run preview

# 5) Lint & test
npm run lint
npm run test
```

---

### Features
- **Dashboard**: Account overview, balance visibility toggle, quick actions, insights, and recent transactions
- **Send Money**: 
  - Methods: contacts, phone number, UPI, bank account
  - Validation for inputs and amounts
  - Contact list with trust signals, flags, and ratings
  - Optional note and one-tap quick amounts
  - Integrated actions: raise complaint, view reviews
- **QR Scanner (simulated)**: Mock camera scanning flow, payment request details, and one-tap pay
- **Reviews & Flags**: Rate recipients, leave comments, and optionally flag categories (spam, fraud, criminal). Submitting a review deducts $5 from your balance
- **Complaints**: View complaint status with authority replies, evidence, and an investigation timeline
- **Transactions**: History with meta details and status
- **Profile**: Edit profile, toggle notifications/biometrics, manage theme, and sign out

Explore detailed docs in `docs/`:
- [Overview](./docs/overview.md)
- [Features](./docs/features.md)
- [User Guide](./docs/user-guide.md)
- [Developer Guide](./docs/developer-guide.md)
- [Architecture](./docs/architecture.md)
- [Roadmap](./docs/roadmap.md)

---

### Tech stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui (Radix), lucide-react icons
- **Routing**: React Router
- **Data Layer**: React Query (configured), Context providers
- **Testing**: Vitest, Testing Library, Playwright (configured)

---

### Project structure (selected)
```
src/
  pages/                 # Route-level pages (Auth, Index, 404)
  components/            # UI & feature components
    ui/                  # shadcn/ui primitives
  contexts/              # Auth, Transaction, Complaint providers
  hooks/                 # Reusable hooks
public/                  # Static assets
```

Key providers and routes are wired in `src/App.tsx`.

---

### Notes & assumptions
- The app uses in-memory data for users, transactions, and complaints. No backend is required to run the demo.
- Authentication, QR scan, and transfers are simulated for demonstration purposes.

---

### License
If you plan to open-source, add a license here. Otherwise, keep this section private/internal.
