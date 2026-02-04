-- Create Enum for Lead Status
create type lead_status as enum (
  'new',
  'contacted',
  'demo_scheduled',
  'closed_won',
  'closed_lost'
);

-- Create Leads Table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  status lead_status default 'new'::lead_status not null,
  value numeric default 0 not null,
  notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.leads enable row level security;

-- RLS Policies
-- Super Admin: Full Access
create policy "Super Admins have full access to leads"
  on leads for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- Sales: View and manage assigned leads
create policy "Sales can view and manage their assigned leads"
  on leads for all
  using (
    assigned_to = auth.uid()
  );

-- Admin: View all leads
create policy "Admins can view all leads"
  on leads for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to update updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_lead_updated
  before update on public.leads
  for each row execute procedure handle_updated_at();
