-- Helper function: is_admin() — STABLE + SECURITY DEFINER avoids per-request overhead
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from admin_users where user_id = auth.uid())
$$;

-- Enable RLS
alter table properties  enable row level security;
alter table inquiries    enable row level security;
alter table admin_users  enable row level security;

-- properties: anon sees only active; admin sees all
create policy properties_select on properties
  for select using (status = 'active' or is_admin());

create policy properties_insert on properties
  for insert with check (is_admin());

create policy properties_update on properties
  for update using (is_admin()) with check (is_admin());

create policy properties_delete on properties
  for delete using (is_admin());

-- inquiries: anon can insert; only admin can read/update/delete
create policy inquiries_insert on inquiries
  for insert with check (true);

create policy inquiries_select on inquiries
  for select using (is_admin());

create policy inquiries_update on inquiries
  for update using (is_admin()) with check (is_admin());

create policy inquiries_delete on inquiries
  for delete using (is_admin());

-- admin_users: readable only by the user themselves or another admin
-- INSERT/UPDATE/DELETE restricted to Supabase dashboard (no API policy)
create policy admin_users_select on admin_users
  for select using (user_id = auth.uid() or is_admin());
