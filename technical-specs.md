# EdHorizon Technical Specifications

This document provides a deep-dive into the technical implementation of EdHorizon.

---

## 1. Database Schema (PostgreSQL)

### 1.1 Authentication & Profiles
```sql
-- Profiles table handles role-based authorization
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role public.user_role DEFAULT 'student'::public.user_role,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff extension for HR payroll
CREATE TABLE public.staff_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  basic_salary NUMERIC(12, 2) DEFAULT 0,
  bank_name TEXT,
  account_number TEXT,
  joining_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active'
);
```

### 1.2 Learning Management System (LMS)
```sql
-- Subject-level modules
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades/Levels per module
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics per course
CREATE TABLE public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning units (Video, Quiz, Flashcards)
CREATE TABLE public.capsules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  type public.capsule_type NOT NULL, -- Enum: 'video', 'quiz', 'flashcards'
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  content JSONB, -- Stores type-specific data
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Server Actions (API Layer)

### 2.1 Content Studio (`/app/(dashboard)/content/actions.ts`)
- `getModules()`: Fetches all subjects for the Studio overview.
- `getCoursesByModule(moduleId)`: Fetches grade levels for a specific subject.
- `getTopicsByCourse(courseId)`: Fetches the syllabus for a grade.
- `saveCapsule(payload)`: Inserts a new capsule with the authenticated teacher as author.

### 2.2 HR & Payroll (`/app/(dashboard)/hr/actions.ts`)
- `getStaff()`: Performs a complex join between `profiles` and `staff_details`.
- `createPayrollRun(month, year)`: Initializes a new payout collection.
- `processPayrollItem(itemId, status)`: Transitions individual payouts through the cycle.

---

## 3. UI Component Architecture

### 3.1 Design Tokens (`tailwind.config.ts` & `globals.css`)
- **Primary Color**: Indigo-600 (`#4F46E5`) for actions and branding.
- **Backgrounds**: Soft Beige (`#F8F7F4`) for Light Mode; Deep Obsidian (`#0A0A0A`) for Dark Mode.
- **Cards**: `rounded-[2.5rem]` with subtle `shadow-xl`.

### 3.2 Featured Components
- **Sidebar**: Dynamic filtering based on `user.role`. Uses Framer Motion for hover expansion.
- **CapsuleBuilder**: A controlled state machine managing the 3-step creation wizard.
- **PipelineBoard**: A flexbox-based board with horizontal scrolling for Sales leads.

---

## 4. State Management & Data Fetching

- **Caching**: Leverages Next.js `force-dynamic` for dashboard routes to ensure real-time accuracy.
- **Optimistic UI**: Used in Sales CRM status updates and HR payroll processing.
- **Error Handling**: Implemented robust Zod validation for all form submissions to prevent DB corruption.

---

## 5. Security & RLS Policies

- **Global Student Isolation**: `CREATE POLICY "Students see own results" ON results FOR SELECT USING (auth.uid() = user_id);`
- **HR Data Protection**: `CREATE POLICY "HR only access" ON staff_details FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'hr'));`
- **Content Moderation**: Teachers have `INSERT` and `SELECT` rights, but only Admins have `UPDATE` rights on `capsules.status`.
