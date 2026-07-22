-- Run this entire file once in Supabase: SQL Editor -> New query -> Run.
-- First create your admin login in Authentication -> Users -> Add user.
-- Then replace admin@example.com below with that login email before running.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'student')) default 'student',
  student_id uuid unique,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo text,
  contact_number text,
  parent_guardian text,
  monthly_fee numeric not null default 0,
  schedule text,
  date_enrolled date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_student_id_fkey foreign key (student_id) references public.students(id) on delete set null;

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null,
  status text not null check (status in ('Present', 'Absent', 'Late', 'Make-up')),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null,
  amount numeric not null check (amount >= 0),
  method text,
  status text not null check (status in ('Paid', 'Partial', 'Unpaid')),
  receipt text,
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  message text not null,
  type text not null default 'warning',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

-- Also create profiles for accounts made before this script was run.
insert into public.profiles (id)
select id from auth.users on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;
alter table public.payments enable row level security;
alter table public.reminders enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles visible to owner or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage students" on public.students for all using (public.is_admin()) with check (public.is_admin());
create policy "Students view own record" on public.students for select using (id = (select student_id from public.profiles where id = auth.uid()));
create policy "Admins manage attendance" on public.attendance for all using (public.is_admin()) with check (public.is_admin());
create policy "Students view own attendance" on public.attendance for select using (student_id = (select student_id from public.profiles where id = auth.uid()));
create policy "Admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "Students view own payments" on public.payments for select using (student_id = (select student_id from public.profiles where id = auth.uid()));
create policy "Admins manage reminders" on public.reminders for all using (public.is_admin()) with check (public.is_admin());
create policy "Students view reminders" on public.reminders for select using (auth.uid() is not null);
create policy "Admins manage notifications" on public.notifications for all using (public.is_admin()) with check (public.is_admin());
create policy "Students view and dismiss own notifications" on public.notifications for select using (student_id = (select student_id from public.profiles where id = auth.uid()));
create policy "Students dismiss own notifications" on public.notifications for update using (student_id = (select student_id from public.profiles where id = auth.uid())) with check (student_id = (select student_id from public.profiles where id = auth.uid()));

-- Promote the first account. Replace the email before running this statement.
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'admin@example.com');
