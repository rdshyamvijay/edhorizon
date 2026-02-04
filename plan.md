# EdHorizon Project Master Plan

This document serves as the "Source of Truth" for the EdHorizon project, detailing the architecture, implementation history, and future roadmap.

---

## 🏗️ Technical Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | Core application framework. |
| **Styling** | Tailwind CSS + shadcn/ui | "Playful & Premium" design system. |
| **Database** | Supabase (PostgreSQL) | Data persistence and RLS security. |
| **Auth** | Supabase Auth | Role-based authentication (RBAC). |
| **State** | Server Actions + React State | Data fetching and interactive UI flows. |
| **Typography** | Plus Jakarta Sans | Modern, geometric, and friendly brand feel. |

---

## 📉 Implementation Roadmap

### Phase 1: Foundation (COMPLETED)
- **Goal**: Establish the tech stack and design system.
- **Technical Info**: Configured Tailwind v4 and shadcn/ui with a soft beige/charcoal palette.
- **Feature Info**: Global Layout, Sidebar framework, and Typography system.

### Phase 2-3: Auth & Core Navigation (COMPLETED)
- **Goal**: Secure multi-role access and high-fidelity navigation.
- **Workflow**: Middleware-level route protection; Profile-based role triggers.
- **Technical Info**: Created `profiles` table and `auth_sync` database triggers.

### Phase 4-6: LMS Core & Admin (COMPLETED)
- **Goal**: Develop the Learning Engine and User Management.
- **Technical Info**: Implemented the hierarchical DB schema: `modules` -> `courses` -> `topics` -> `capsules`.
- **Feature Info**: Super Admin User List with Role Switcher; Basic Video/Quiz components.

### Phase 7: Sales CRM (COMPLETED)
- **Goal**: Enable lead tracking for demo conversions.
- **Workflow**: Kanban-style pipeline interaction (`Drag-and-drop` logic simulated via status buttons).
- **Technical Info**: Created `leads` and `sales_notes` tables with RLS for Sales role.

### Phase 8: HR Dashboard & Payroll (COMPLETED)
- **Goal**: Manage professional staff and automate payroll calculations.
- **Technical Info**: Joined `profiles` with `staff_details` for a unified HR view.
- **Feature Info**: Staff Directory (Registry) and Payroll Pulse (Run Manager).

### Phase 9: Advanced Content Studio (COMPLETED)
- **Goal**: Unified curriculum management for Teachers and Admins.
- **Workflow**: 3-Step Capsule Creation Wizard (**Format** -> **Metadata** -> **Content**).
- **Technical Info**: Refactored sub-resource fetching in `actions.ts` for efficient hierarchy navigation.

### Phase 10: Launch & Polish (IN PROGRESS)
- **Goal**: Ensure production readiness and data integrity.
- **Tasks**:
    - [ ] Lighthouse Performance Audit (Target: 90+ Score).
    - [ ] Real Content Seeding (Subjects: Hindi, Math).
    - [ ] Final Vercel Deployment & SSL config.

### Phase 11: Content Depth (PLANNED)
- **Goal**: Move from placeholders to high-fidelity content editors.
- **Technical Info**:
    - **Advanced MCQ Builder**: Support for images in questions and branch logic.
    - **Flashcard Deck Editor**: Bulk creation interface for memory cards.
    - **Video Annotation**: Overlay questions on top of embedded videos.

### Phase 12: Gamification & XP (PLANNED)
- **Goal**: Student engagement and retention.
- **Feature Info**: XP Points for completions; Daily Streaks; Global Leaderboards.
- **Technical Info**: New `streaks` and `leaderboards` tables with Realtime Supabase updates.

---

## 🛠️ Database Schema Deep-Dive

### Learning Hierarchy
- `modules`: Top-level subjects (e.g., Science).
- `courses`: Level/Grade within a module (e.g., Grade 9).
- `topics`: Specific textbook topics (e.g., Photosynthesis).
- `capsules`: Individual learning units (Video, MCQ, Flashcards).

### HR & Staff
- `staff_details`: Extends `profiles` with salary, bank_details, and joining_date.
- `payroll_runs`: Group payouts by Month/Year.
- `payroll_items`: Individual payout records linked to staff and runs.

### Sales CRM
- `leads`: Contact info, source, and demo status.
- `sales_notes`: Interaction history for leads.

---

## 📖 Feature Workflows

### 1. Capsule Creation Workflow (Teacher)
1. **Initiate**: Teacher clicks "New Capsule" in the Content Studio.
2. **Step 1: Format**: Select between Video, Quiz, or Flashcards.
3. **Step 2: Metadata**: Assign Title and link to a Topic in the syllabus.
4. **Step 3: Content**: Add specific data (Video URL, Questions, etc.).
5. **Persistence**: Save to `capsules` table with `status = 'draft'`.
6. **Publishing**: Admin reviews and flips status to `published`.

### 2. Payroll Payout Workflow (HR)
1. **Create Run**: HR starts a new "Payroll Run" for the current month.
2. **Auto-Populate**: System fetches all active staff and their `basic_salary`.
3. **Review**: HR adjusts bonuses or deductions for individuals.
4. **Approve**: Run status moves to `processed`.
5. **Finalize**: Payouts marked as `paid` once bank transfers are confirmed.
