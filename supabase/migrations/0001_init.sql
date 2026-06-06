create extension if not exists "pgcrypto";

create table properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  domain text not null,
  contact_email text not null,
  inquiry_recipient_email text not null,
  timezone text not null default 'Europe/Berlin',
  currency text not null default 'EUR',
  vat_rate numeric(5,2) not null default 19.00,
  city_tax_per_night_per_adult numeric(10,2) default 0,
  stripe_account_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  max_adults int not null default 2,
  max_children int not null default 0,
  base_rate numeric(10,2) not null,
  image_urls text[] not null default '{}',
  amenities jsonb not null default '[]',
  sort_order int not null default 0,
  active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, slug)
);

create table rate_plans (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  rate_modifier_percent numeric(5,2) not null default 0,
  includes jsonb not null default '[]',
  min_stay int not null default 1,
  max_stay int,
  cancellation_policy text,
  active boolean not null default true,
  unique (room_id, slug)
);

create table availability (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  date date not null,
  units_total int not null default 1,
  units_booked int not null default 0,
  rate_override numeric(10,2),
  closed boolean not null default false,
  unique (room_id, date)
);
create index availability_room_date_idx on availability(room_id, date);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id),
  room_id uuid not null references rooms(id),
  rate_plan_id uuid references rate_plans(id),
  booking_reference text unique not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','confirmed','cancelled','checked_in','completed','no_show')),
  check_in date not null,
  check_out date not null,
  adults int not null,
  children int not null default 0,
  guest_first_name text not null,
  guest_last_name text not null,
  guest_email text not null,
  guest_phone text,
  guest_notes text,
  total_amount numeric(10,2) not null,
  vat_amount numeric(10,2) not null,
  city_tax_amount numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  add_ons jsonb not null default '[]',
  stripe_payment_intent_id text,
  stripe_charge_id text,
  attribution jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  check (check_out > check_in)
);
create index bookings_property_status_idx on bookings(property_id, status);
create index bookings_dates_idx on bookings(check_in, check_out);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id),
  inquiry_reference text unique not null,
  segment text not null
    check (segment in ('meeting','executive_retreat','family_residence','wedding','other')),
  status text not null default 'new'
    check (status in ('new','in_review','quoted','accepted','rejected','expired')),
  preferred_start_date date,
  preferred_end_date date,
  flexible_dates boolean not null default false,
  participants int,
  rooms_requested int,
  meeting_room_setup text,
  catering jsonb not null default '[]',
  framework_program jsonb not null default '[]',
  budget_indication text,
  contact_first_name text not null,
  contact_last_name text not null,
  contact_company text,
  contact_email text not null,
  contact_phone text,
  notes text,
  attribution jsonb not null default '{}',
  internal_notes text,
  assigned_to text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index inquiries_property_status_idx on inquiries(property_id, status);

create table tracking_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id),
  event_id text unique not null,
  event_name text not null,
  client_id text,
  session_id text,
  user_agent text,
  ip_hash text,
  page_url text,
  referrer text,
  gclid text,
  fbclid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  consent_state jsonb,
  payload jsonb,
  related_inquiry_id uuid references inquiries(id),
  related_booking_id uuid references bookings(id),
  created_at timestamptz not null default now()
);
create index tracking_events_property_event_idx on tracking_events(property_id, event_name);
create index tracking_events_created_idx on tracking_events(created_at desc);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  changed_by text,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_entity_idx on audit_log(entity_type, entity_id);

-- updated_at trigger function
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_properties_updated_at before update on properties
  for each row execute function set_updated_at();
create trigger trg_rooms_updated_at before update on rooms
  for each row execute function set_updated_at();
create trigger trg_bookings_updated_at before update on bookings
  for each row execute function set_updated_at();
create trigger trg_inquiries_updated_at before update on inquiries
  for each row execute function set_updated_at();
