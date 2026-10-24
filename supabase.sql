create table if not exists orders (
  id bigint generated always as identity primary key,
  reference text unique not null,
  name text,
  email text,
  phone text,
  address text,
  items text,
  amount_kes numeric,
  status text default 'paid',
  created_at timestamptz default now()
);
-- Row level security on with no policies: only your server (service role key) can read or write.
alter table orders enable row level security;
