with property_upsert as (
  insert into properties (
    slug,
    name,
    domain,
    contact_email,
    inquiry_recipient_email,
    vat_rate,
    city_tax_per_night_per_adult,
    currency
  )
  values (
    'rhoenpark',
    'Rhön Park Hotel',
    'rhoen-park-hotel.de',
    'rph@rhoen-park-hotel.de',
    'rph@rhoen-park-hotel.de',
    19.00,
    2.50,
    'EUR'
  )
  on conflict (slug) do update set
    name = excluded.name,
    domain = excluded.domain,
    contact_email = excluded.contact_email,
    inquiry_recipient_email = excluded.inquiry_recipient_email,
    vat_rate = excluded.vat_rate,
    city_tax_per_night_per_adult = excluded.city_tax_per_night_per_adult,
    currency = excluded.currency
  returning id
),
property_row as (
  select id from property_upsert
),
room_seed(slug, name, base_rate, max_adults, max_children, sort_order) as (
  values
    ('rother-kuppe-suite', 'Suite Rother Kuppe', 320.00::numeric(10,2), 2, 2, 10),
    ('kreuzberg-suite', 'Suite Kreuzberg', 290.00::numeric(10,2), 2, 2, 20),
    ('familien-suite-deluxe', 'Familien Suite Deluxe', 380.00::numeric(10,2), 2, 3, 30),
    ('apartment-deluxe', 'Apartment Deluxe', 260.00::numeric(10,2), 4, 2, 40)
),
rooms_upsert as (
  insert into rooms (
    property_id,
    slug,
    name,
    base_rate,
    max_adults,
    max_children,
    sort_order
  )
  select
    property_row.id,
    room_seed.slug,
    room_seed.name,
    room_seed.base_rate,
    room_seed.max_adults,
    room_seed.max_children,
    room_seed.sort_order
  from property_row
  cross join room_seed
  on conflict (property_id, slug) do update set
    name = excluded.name,
    base_rate = excluded.base_rate,
    max_adults = excluded.max_adults,
    max_children = excluded.max_children,
    sort_order = excluded.sort_order,
    active = true
  returning id
),
rhoenpark_rooms as (
  select id from rooms_upsert
),
rate_plan_upsert as (
  insert into rate_plans (
    room_id,
    slug,
    name,
    rate_modifier_percent,
    min_stay,
    cancellation_policy
  )
  select
    rhoenpark_rooms.id,
    'flexibel',
    'Flexibel stornierbar',
    0,
    1,
    'Kostenlose Stornierung bis 48 Stunden vor Anreise.'
  from rhoenpark_rooms
  on conflict (room_id, slug) do update set
    name = excluded.name,
    rate_modifier_percent = excluded.rate_modifier_percent,
    min_stay = excluded.min_stay,
    cancellation_policy = excluded.cancellation_policy,
    active = true
  returning id
)
insert into availability (
  room_id,
  date,
  units_total,
  units_booked
)
select
  rhoenpark_rooms.id,
  day::date,
  1,
  0
from rhoenpark_rooms
cross join generate_series(current_date, current_date + 364, interval '1 day') as day
where exists (select 1 from rate_plan_upsert)
on conflict (room_id, date) do update set
  units_total = excluded.units_total,
  units_booked = excluded.units_booked,
  closed = false;
