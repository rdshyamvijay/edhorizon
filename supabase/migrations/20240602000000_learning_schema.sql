
-- 1. Modules (Subjects)
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  title text not null, -- e.g. "MathHorizon"
  slug text unique not null,
  description text,
  icon text, -- lucide icon name
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Courses (Grades/Levels)
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null, -- e.g. "Grade 1"
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Topics (Chapters)
create table public.topics (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null, -- e.g. "Addition 101"
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Capsules (Learning Units)
create type capsule_type as enum ('video', 'quiz', 'flashcards');
create type content_status as enum ('draft', 'pending', 'published', 'rejected');

create table public.capsules (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.topics(id) on delete cascade not null,
  title text not null,
  type capsule_type not null,
  content jsonb default '{}'::jsonb, -- dynamic content based on type
  status content_status default 'draft'::content_status not null,
  author_id uuid references auth.users(id),
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.modules enable row level security;
alter table public.courses enable row level security;
alter table public.topics enable row level security;
alter table public.capsules enable row level security;

-- Policies (Simplified for v1)
-- READ: Public (Authenticated) can read all PUBLISHED content
-- WRITE: Teachers/Admins can write (omitted for now, focusing on consumption)

create policy "Authenticated users can read modules" on modules for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read courses" on courses for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read topics" on topics for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read published capsules" on capsules for select using (auth.role() = 'authenticated' and status = 'published');

-- Allow Teachers to read their own drafts
create policy "Authors can read own capsules" on capsules for select using (auth.uid() = author_id);
create policy "Authors can insert own capsules" on capsules for insert with check (auth.uid() = author_id);
create policy "Authors can update own capsules" on capsules for update using (auth.uid() = author_id);
