## Overview

This project is a modern, mobile-first digital wallet UI that demonstrates core money movement flows with an attractive, production-ready component library.

- **Audience**: Product demos, prototypes, onboarding flows, and UI/UX exploration for fintech apps
- **Goals**: Showcase key wallet patterns (send, scan & pay, reviews/flags, complaints, history, profile) with delightful UX
- **Status**: Frontend-only; no backend required (all data is simulated in-memory)

### Core modules
- **Auth & Onboarding**: Email/password login and signup, demo login
- **Dashboard**: Balance visibility, quick actions, monthly insights, recent activity
- **Send Money**: Multi-method sending (contacts, phone, UPI, bank), trust & safety signals, notes
- **QR Pay**: Simulated scanner UX and payment request confirmation
- **Reviews & Flags**: Ratings, comments, category flags (spam/fraud/criminal); $5 charge per review
- **Complaints**: Case list, authority replies, evidence, and investigation timeline
- **Transactions**: List with status, categories, and metadata
- **Profile & Settings**: Edit profile, notifications, biometrics, theme toggle

### Why this stack?
- **Vite + React + TS**: Blazing fast local dev and type safety
- **Tailwind + shadcn/ui**: Accessible, beautifully themed components with composability
- **React Router**: Simple route control with protected routes
- **React Query**: Ready for server-state when you connect a backend

For a deeper look, see the [Architecture](./architecture.md).