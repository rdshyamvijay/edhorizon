# Phase 8: HR Dashboard & Payroll (Personnel Engine)

## 1. Overview
Phase 8 focused on the operational and administrative heart of the academy. The goal was to build a comprehensive HR Dashboard to manage professional staff (Teachers, Sales, Admin) and automate the complexities of monthly payroll processing.

## 2. Development Done
- **Staff Professional Registry**: Developed a server-side rendered directory that joins `profiles` with professional and financial metadata.
- **Payroll Pulse Module**: Implemented a "Running State" payroll tracker for the current month.
- **Relational Data Extension**: Created the `staff_details` table to extend basic user profiles with sensitive information (Salary, Joining Date, Bank Info).
- **Staff Retention Analytics**: Added visual indicators for staff health and retention rates.

## 3. Technical Details
### Database & Schema
- **`staff_details` Table**:
  - `id`: UUID foreign key to `profiles`.
  - `basic_salary`: Numeric value for payroll calculation.
  - `status`: Tracking if staff is `Active`, `On Leave`, or `Resigned`.
- **Relational Querying**: [HRDashboard](file:///Users/sk/Downloads/Autup/EdHorizon/app/%28dashboard%29/hr/page.tsx) uses a complex Supabase query to fetch non-student profiles while embedding their `staff_details` in a single request (`select('*, staff_details(*)')`).

### UI Architecture
- **Stats Grid**: Uses cards to highlight "Active Staff", "Payroll Processing Status", and "Pending Onboarding" requests.
- **Directory List**: A responsive list view with dynamic avatars and status badges.
- **Quick Actions**: Prominent buttons for "Add New Staff" and "Generate Payouts" to streamline HR workflows.

## 4. Implementation Specs
### Payroll Generation Workflow
1. **Trigger**: HR clicks "Generate Payouts".
2. **Logic**: The system iterates through all profiles with `role NOT IN ('student', 'parent')` that have an associated `staff_details` record.
3. **Drafting**: Create a "Payroll Run" for the current Month/Year.
4. **Processing**: Status moves from `Draft` → `Processing` → `Paid`.

### Security (RLS)
- **High-Sensitivity Isolation**: `staff_details` is protected by strict RLS, ensuring that even other staff members cannot view salary or bank information. Only the individual, HR, and Super Admin have access.

## 5. Impact
- **Administrative Automation**: Reduces the manual labor required to manage monthly payouts and staff records.
- **Scalability**: The system can support an expanding team of educators and sales professionals without increasing HR overhead.
- **Financial Transparency**: Provides a centralized "Source of Truth" for academy expenses and payroll history.
