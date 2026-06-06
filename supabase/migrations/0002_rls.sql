alter table properties enable row level security;
alter table rooms enable row level security;
alter table rate_plans enable row level security;
alter table availability enable row level security;
alter table bookings enable row level security;
alter table inquiries enable row level security;
alter table tracking_events enable row level security;
alter table audit_log enable row level security;

create policy policy_properties_select_anon
  on properties
  for select
  to anon
  using (true);

create policy policy_properties_select_authenticated
  on properties
  for select
  to authenticated
  using (true);

create policy policy_rooms_select_anon
  on rooms
  for select
  to anon
  using (active = true);

create policy policy_rooms_select_authenticated
  on rooms
  for select
  to authenticated
  using (
    active = true
    or property_id::text = auth.jwt() ->> 'property_id'
  );

create policy policy_rate_plans_select_anon
  on rate_plans
  for select
  to anon
  using (
    active = true
    and exists (
      select 1
      from rooms
      where rooms.id = rate_plans.room_id
        and rooms.active = true
    )
  );

create policy policy_rate_plans_select_authenticated
  on rate_plans
  for select
  to authenticated
  using (
    exists (
      select 1
      from rooms
      where rooms.id = rate_plans.room_id
        and (
          rate_plans.active = true
          or rooms.property_id::text = auth.jwt() ->> 'property_id'
        )
    )
  );

create policy policy_availability_select_anon
  on availability
  for select
  to anon
  using (
    exists (
      select 1
      from rooms
      where rooms.id = availability.room_id
        and rooms.active = true
    )
  );

create policy policy_availability_select_authenticated
  on availability
  for select
  to authenticated
  using (
    exists (
      select 1
      from rooms
      where rooms.id = availability.room_id
        and (
          rooms.active = true
          or rooms.property_id::text = auth.jwt() ->> 'property_id'
        )
    )
  );

create policy policy_bookings_select_authenticated
  on bookings
  for select
  to authenticated
  using (property_id::text = auth.jwt() ->> 'property_id');

create policy policy_inquiries_select_authenticated
  on inquiries
  for select
  to authenticated
  using (property_id::text = auth.jwt() ->> 'property_id');

create policy policy_tracking_events_all_service_role
  on tracking_events
  for all
  to service_role
  using (true)
  with check (true);

create policy policy_audit_log_all_service_role
  on audit_log
  for all
  to service_role
  using (true)
  with check (true);
