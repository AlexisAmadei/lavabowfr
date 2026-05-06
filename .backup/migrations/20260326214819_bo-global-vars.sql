create table if not exists global_variables (
  id serial primary key,
  name text not null unique,
  value text not null
);

ALTER TABLE global_variables ENABLE ROW LEVEL SECURITY;

create policy "Allow read access to all users" on global_variables
  for select
  using (true);

create policy "Allow insert to authenticated users" on global_variables
    for insert
    with check (auth.role() is not null);

create policy "Allow update to authenticated users" on global_variables
    for update
    using (auth.role() is not null);

create policy "Allow delete to authenticated users" on global_variables
    for delete
    using (auth.role() is not null);
