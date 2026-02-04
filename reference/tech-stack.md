# Tech Stack & Standards

## Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS
  - Use `cn()` utility for class merging.
  - Follow mobile-first breakpoints.
- **Component Library:** shadcn/ui (Radix UI primitives).
- **Icons:** Lucide React.
- **State Management:**
  - Server State: React Server Components / Server Actions.
  - Client State: `useState` / `useReducer` (Keep it local).
  - URL State: Query parameters for filters/pagination.
- **Animations:** Framer Motion (for micro-interactions).

## Backend (Supabase)
- **Database:** PostgreSQL.
- **Auth:** Supabase Auth (Email/Password, Social).
- **Security:** RLS (Row Level Security) is MANDATORY on every table.
- **Type Safety:** Generate types with `supabase gen types typescript`.

## Development Workflow
1.  Read `plan.md`.
2.  Check `PRD.md`.
3.  Create Feature Branch.
4.  Implement & Verify.
5.  Update `PRD.md`.
