# EdHorizon – Product Requirements Document (PRD)

> [!IMPORTANT]
> **Current Status**: Phase 9 (Advanced Content Studio) is **COMPLETE**.
> **Active Focus**: Documentation Overhaul & Phase 10 Pre-Launch.

## 1. Product Overview

### 1.1 Product Name
**EdHorizon**

### 1.2 Product Vision
EdHorizon is a lightweight, scalable, and engaging learning platform designed to deliver subject-based education (Hindi, Maths, English, Science, Physics, etc.) through a modern, gamified user experience inspired by apps like Duolingo.

The platform is built to support:
- Students and parents as learners
- Teachers as content creators
- Sales teams for demo tracking and conversion
- HR teams for staff and payroll management
- Super Admins (enterprise owners) with full control

The system must work efficiently on low-cost infrastructure while remaining fast, secure, and visually polished.

---

## 2. Goals and Non-Goals

### 2.1 Goals
- Support at least **300 students initially**, scalable to **5,000+ students**
- Provide a **Duolingo-style UX** with animations, feedback, and progress tracking
- Enable **strict role-based access control**
- Allow **teachers to create learning content** without publishing rights
- Enable **sales pipeline tracking** for demos and follow-ups
- Provide **HR controls** for hiring and payroll
- Be **AI-friendly** for development and future feature expansion
- Run smoothly on **Supabase Free + Vercel Free** in early stages

### 2.2 Non-Goals (v1)
- Native mobile apps (Android/iOS)
- Heavy video hosting inside the platform
- Complex AI tutoring in v1
- Payment gateway and subscriptions (planned later)

---

## 3. Target Users and Roles

### 3.1 User Roles & Permissions Strategy
**Strategic Decision:** To ensure platform integrity, strict Role-Based Access Control (RBAC) is enforced.
- **Default Role:** All public signups are automatically assigned the **Student** role.
- **Role Elevation:** Only **Super Admins** can assign or elevate users to privileged roles (Teacher, Admin, Sales, HR) via the Admin Dashboard.
- **Data Architecture:** Authentication (Identity) is handled by Supabase Auth (`auth.users`), while Authorization (Roles & Profile Data) is managed in a separate public table (`public.profiles`) synced via secure database triggers.

#### Role Definitions
- **Super Admin:** Full system access. manages users, billing, and system settings.
- **Admin:** Operational manager. Approves content and manages student reports.
- **Teacher:** Content creator. Can create capsules and view their class analytics.
- **Student:** Content consumer. Can view assigned courses and take quizzes.
- **Parent:** Observer. Read-only access to their child's progress.
- **Sales:** Pipeline manager. Access to CRM and lead management tools.
- **HR:** Staff manager. Access to payroll and staff directory.

### 3.2 Sales Person
- Manage leads and demos
- Track demo status using a pipeline
- Record feedback and follow-ups
- View conversion metrics

### 3.6 HR
- Manage staff records
- Track hiring and onboarding
- Handle payroll status and monthly payouts

---

## 4. Core User Experience (UX)

### 4.1 Design Principles
- Clean, classical, and calm theme
- Smooth micro-animations
- Clear feedback for every interaction
- Minimal page load size
- Mobile-friendly layouts

### 4.2 Gamification Elements
- Progress bars
- Completion states
- Quiz feedback animations
- XP and streak foundations (basic in v1)

---

## 5. Functional Requirements

### 5.1 Authentication
- Email-based login
- Role assigned via database
- Secure session handling

### 5.2 Navigation
- Left sidebar showing allowed subjects
- Dynamic content based on role and access
- No hardcoded routes per user

### 5.3 Learning Structure
- Module (Subject)
- Course (Grade / Level)
- Topic
- Capsule (learning unit)

### 5.4 Capsule Types (v1)
- Video Capsule
- MCQ Quiz Capsule
- Flashcards Capsule

Each capsule supports:
- Draft → Pending → Published workflow
- Progress tracking
- Role-based visibility

---

## 6. Dashboards

### 6.1 Student Dashboard
- Assigned subjects and courses
- Continue learning section
- Progress overview
- Recent activity

### 6.2 Teacher Dashboard
- Capsule creation wizard
- Draft and pending content list
- Analytics for assigned students

### 6.3 Sales Dashboard
- **Kanban Board**: Drag-and-drop pipeline for managing leads.
- **Lead Capture**: Create and edit lead details, including contact info and demo status.
- **Notes & History**: Track interactions and next steps for prospective students.

### 6.4 HR Dashboard
- **Staff Directory**: Registry of all academy staff (Teachers, Admins, Sales) with status tracking.
- **Payroll Pulse**: A high-fidelity module for generating and processing monthly payroll runs.
- **Professional Extension**: Integration with `staff_details` for salary, banking, and joining records.
- **RLS Isolation**: HR data is strictly restricted to HR and Super Admin roles.

### 6.5 Content Studio (LMS Manager)
- **Hierarchy Management**: Manage the full curriculum from Modules (Subjects) down to Topics.
- **Capsule Builder**: A 3-step wizard (Format -> Metadata -> Content) for creating interactive units.
- **Capsule Types**:
    - **Video**: Embedded lessons with pedagogical notes.
    - **Quiz**: Interactive MCQ (Multiple Choice Questions) builders.
    - **Flashcards**: Memory-aid cards with front/back logic.

---

## 7. Technical Stack

### 7.1 Frontend
- Language: **TypeScript**
- Framework: **Next.js (App Router)**
- Styling: **Tailwind CSS**
- UI Components: **shadcn/ui**
- Animations: **Framer Motion**

### 7.2 Backend
- Platform: **Supabase**
- Database: **PostgreSQL**
- Authentication: **Supabase Auth**
- Security: **Row Level Security (RLS)**

### 7.3 Hosting
- Frontend: **Vercel**
- Backend: **Supabase**
- Media: **External video hosting (YouTube/Vimeo unlisted)**

---

## 8. Proposed Project Structure

```bash
/
├── app/
│   ├── (auth)/             # Login, Signup, Forgot Password
│   ├── (dashboard)/        # Protected Interaction Layouts
│   │   ├── super-admin/
│   │   ├── admin/
│   │   ├── teacher/
│   │   ├── student/
│   │   ├── sales/
│   │   └── hr/
│   ├── api/                # Route Handlers (if needed beyond Server Actions)
│   └── layout.tsx          # Root Layout
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── shared/             # Reusable components (Navbar, Sidebar)
│   ├── features/           # Feature-specific components (QuizEngine, PipelineBoard)
│   └── layouts/            # Dashboard specific layouts
├── lib/
│   ├── supabase/           # Client/Server clients
│   ├── utils.ts            # Helpers
│   └── constants.ts        # Config constants
├── types/                  # Global TS interfaces
├── reference/              # Documentation & Design System (Agentic Workflow)
├── commands/               # Reusable Command Files (Agentic Workflow)
└── public/                 # Static assets
```

---

## 9. Database Design (High-Level)

Core entities:
- profiles (users + roles)
- modules
- courses
- topics
- capsules
- enrollments
- access_rules
- progress
- quiz_questions, quiz_attempts
- flashcards
- sales_leads, sales_notes
- **staff_details**: Professional extension of profiles (joining_date, basic_salary, bank_name, status).
- **payroll_runs**: Collection of payouts for a specific month/year.
- **payroll_items**: Individual payout records for staff members within a run.

All tables:
- Use UUID primary keys
- Include created_at timestamps
- Enforce RLS by role

---

## 10. Security Requirements

- RLS enabled on all tables
- Students can access only their own data
- Teachers cannot publish content
- Sales and HR data isolated
- Super Admin has full access
- No direct client-side access to sensitive operations

---

## 11. Performance Requirements

- Page load under 2 seconds on average
- Lazy loading for content
- Pagination for lists
- Indexed database queries
- No heavy media files served directly

---

## 12. Development Workflow

### 12.1 Environments
- Local Development
- QA (test environment)
- Production

### 12.2 Git Strategy
- main → production
- dev → QA
- feature branches → development

### 12.3 AI-Assisted Development
- Small, isolated tasks
- Clear role and permission definitions per task
- AI used for:
  - Schema generation
  - RLS rules
  - UI components
  - Debugging

---

## 13. Release Phases

### Phase 1: Foundation (Completed)
- [x] Tech Stack: Next.js 15, Tailwind v4, Supabase.
- [x] Design System: Playful & Premium aesthetic, Plus Jakarta Sans.

### Phase 2-3: Core Infrastructure (Completed)
- [x] RBAC: 5-Role system (Super Admin, Teacher, Sales, HR, Student).
- [x] Global Layout: Hover-expand sidebar and Obsidian dark mode.

### Phase 4-6: LMS & User Management (Completed)
- [x] Learning Schema: Modules, Courses, Topics, Capsules.
- [x] Admin Suite: Role editor and user management.

### Phase 7: Sales CRM (Completed)
- [x] Kanban Board: Visual lead pipeline.
- [x] Lead Actions: Creation and status updates.

### Phase 8: HR Dashboard (Completed)
- [x] Staff Registry: Full professional staff management.
- [x] Payroll Pulse: Payout run management and status cycles.

### Phase 9: Advanced Content Studio (Completed)
- [x] Unified Studio: Hierarchy-first curriculum manager at `/content`.
- [x] Capsule Wizard: Multi-step builder for multi-format content.

### Phase 10: Launch & Polish (Active)
- [ ] **Performance Audit**: Lighthouse check and bundle optimization.
- [ ] **Production Seed**: Real content for "Hindi Horizon" and "MathHorizon" modules.
- [ ] **Final Vercel Deployment**: Live production environment.

### Phase 11+: Advanced Learning Features (Planned)
- [ ] **Interactive MCQ Builder**: Advanced question logic and media attachments.
- [ ] **Flashcard Deck Editor**: Bulk card creation and AI-assisted descriptions.
- [ ] **Student XP Engine**: XP points, Streaks, and Level-up animations.
- [ ] **Analytics 2.0**: Teacher-facing grade reports and progress heatmaps.

---

## 14. Success Metrics

- Student retention rate
- Quiz completion rate
- Demo-to-conversion ratio
- Teacher content throughput
- Platform stability under load

---

## 15. Open Questions (Future)
- Payment model
- Mobile app strategy
- Advanced AI personalization
- Multi-language UI support

---

**End of PRD**
