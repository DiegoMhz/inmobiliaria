-- Enums
create type property_type as enum ('house', 'apartment', 'penthouse', 'villa', 'estate');
create type property_status as enum ('active', 'sold', 'reserved', 'draft');

-- Trigger function: auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admin_users: FK to auth.users, populated manually via Supabase dashboard
create table admin_users (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text not null,
  created_at timestamptz not null default now()
);

-- properties
create table properties (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) >= 3),
  description text not null default '' check (char_length(description) >= 20 or char_length(description) = 0),
  price       numeric(14, 2) not null check (price >= 0),
  currency    text not null default 'USD' check (currency in ('USD', 'EUR', 'ARS')),
  location    text not null,
  type        property_type not null,
  bedrooms    int not null default 0 check (bedrooms >= 0),
  bathrooms   int not null default 0 check (bathrooms >= 0),
  sqm         numeric(10, 2) not null default 0 check (sqm >= 0),
  images      text[] not null default '{}',
  status      property_status not null default 'draft',
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index properties_status_idx      on properties(status);
create index properties_featured_idx    on properties(featured) where featured = true;
create index properties_type_idx        on properties(type);
create index properties_price_idx       on properties(price);
create index properties_created_at_idx  on properties(created_at desc);

create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();

-- inquiries
create table inquiries (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name        text not null check (char_length(name) >= 2),
  email       text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone       text,
  message     text not null default '',
  created_at  timestamptz not null default now()
);

create index inquiries_property_id_idx  on inquiries(property_id);
create index inquiries_created_at_idx   on inquiries(created_at desc);
