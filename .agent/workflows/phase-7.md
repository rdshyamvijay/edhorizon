# Phase 7: Sales CRM & Pipeline (Lead Engine)

## 1. Overview
Phase 7 introduced the Sales functionality to EdHorizon. The goal was to provide a visual lead management system (CRM) that allows sales representatives to track prospective students through various stages of the conversion funnel, from "New" to "Closed Won".

## 2. Development Done
- **Lead Management Schema**: Designed the `leads` table with professional fields (Name, Phone, Email, Value).
- **Kanban Status Pipeline**: Created a `lead_status` enum to track the demo and conversion lifecycle.
- **Granular RLS Security**: Implemented sophisticated Row Level Security to isolate leads by the assigned sales representative.
- **Audit Logging**: Added a PostgreSQL trigger to automatically track `updated_at` timestamps for lead activity monitoring.

## 3. Technical Details
### Database & Schema
- **Status Enum**: Includes stages: `new`, `contacted`, `demo_scheduled`, `closed_won`, `closed_lost`.
- **Value Tracking**: Every lead has a `numeric` value associated with it to help forecast academy revenue.
- **Assignment Logic**: Leads can be assigned to specific users in the `profiles` table using the `assigned_to` foreign key.

### Security (RLS)
- **Sales Isolation**: `Sales can view and manage their assigned leads` ensures that sales staff cannot see or tamper with each other's pipelines.
- **Super Admin Oversight**: Granted full bypass rights to Super Admins for global reporting.
- **Admin Visibility**: Admins can `SELECT` all leads but cannot modify them, facilitating managerial oversight.

## 4. Implementation Specs
### Pipeline Transition Logic
1. When a lead moves status (e.g., from Contacted to Demo Scheduled), the `updated_at` trigger fires.
2. The frontend uses optimistic updates to move the lead card between Kanban columns.
3. RLS ensures that the `UPDATE` request is signed by the correct owner.

### Data Fetching
- The Sales dashboard fetches leads filtered by `assigned_to = auth.uid()` for Sales roles, and a total count for Admins.

## 5. Impact
- **Conversion Efficiency**: Sales reps have a clear view of their daily tasks and follow-ups.
- **Security & Privacy**: Lead contact information (PII) is protected by database-level security, preventing unauthorized data exfiltration.
- **Growth Velocity**: The structured pipeline allows the academy to identify bottlenecks in the enrollment process (e.g., leads getting stuck in the "Contacted" phase).
