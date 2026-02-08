# Phase 2: Authentication & RBAC (Security Core)

## 1. Overview
Phase 2 focused on securing the platform using Supabase Auth and implementing a robust Role-Based Access Control (RBAC) system. This ensures that users (Students, Teachers, Sales, HR, Admins) only access data and features relevant to their roles.

## 2. Development Done
- **Supabase Integration**: Set up the `auth.users` connection and synchronized it with a `public.profiles` table.
- **RBAC System**: Defined a 7-role enum (`user_role`) and implemented logic to handle role elevation.
- **Profile Auto-Creation**: Created a database trigger to automatically provision user profiles upon signup.
- **Session Middleware**: Implemented Next.js Middleware to handle cross-environment session persistence and route protection.

## 3. Technical Details
### Server-Side Auth
- **Client Factory**: [lib/supabase/server.ts](file:///Users/sk/Downloads/Autup/EdHorizon/lib/supabase/server.ts) provides an async `createClient` that handles cookies in a Next.js 15 compliant way.
- **Middleware**: [middleware.ts](file:///Users/sk/Downloads/Autup/EdHorizon/middleware.ts) ensures that every request refreshes the user session, preventing unauthorized access.
### Multi-Role Logic
- **Profile Synchronization**: The [handle_new_user](file:///Users/sk/Downloads/Autup/EdHorizon/supabase/migrations/20240601000000_init_auth.sql#L25) PostgreSQL function extracts `full_name` and `role` from the auth metadata provided during signup.

## 4. Database & Security
### Tables
- **`public.profiles`**: Extends `auth.users`.
  - `role`: `user_role` enum (Default: 'student').
  - `email`: Cached for easier querying in the public schema.
### RLS Policies
- **Row Level Security**: Enabled by default on all tables.
- **Policies**:
  - Profiles are viewable by everyone (for dashboard display and directory tracking).
  - Users can only update their own profile data.
  - Role elevation is restricted (intended for Super Admin only in Phase 5).

## 5. Implementation Specs
### Authorization Flow
1. User signs up via Supabase Auth.
2. `on_auth_user_created` trigger fires.
3. User meta-data is parsed, and a record is created in `public.profiles`.
4. Middleware detects the new session and allows access to protected `/app/(dashboard)` routes.
5. Frontend components read the `role` from `profiles` to render specific dashboard modules.

## 6. Impact
- **Security**: Zero access to protected data without a valid Supabase JWT.
- **Flexibility**: The system can support different user journeys (Learning, Sales, HR) simply by changing the `role` flag.
- **Automation**: No manual user registration is required for profile creation.
