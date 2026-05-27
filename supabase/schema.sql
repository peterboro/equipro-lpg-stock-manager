create extension if not exists "pgcrypto";

create type public.user_role as enum ('Admin', 'Staff', 'Driver');
create type public.cylinder_brand as enum ('Total', 'K-Gas', 'ProGas', 'Hashi', 'Afrigas', 'Other');
create type public.cylinder_size as enum ('3kg', '6kg', '13kg', '50kg');
create type public.cylinder_status as enum ('Full', 'Empty', 'In Store', 'Sold', 'Delivered', 'Returned', 'Refill Needed');
create type public.cylinder_condition as enum ('Good', 'Damaged', 'Leaking', 'Needs Inspection');
create type public.cylinder_location as enum ('Store', 'Office', 'Vehicle', 'Client Site');
create type public.transaction_type as enum ('Sale', 'Delivery', 'Return', 'Refill', 'Stock Adjustment');
create type public.payment_status as enum ('Paid', 'Partial', 'Unpaid');
create type public.payment_method as enum ('Cash', 'M-Pesa', 'Bank Transfer');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role public.user_role not null default 'Staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cylinders (
  id uuid primary key default gen_random_uuid(),
  cylinder_id text not null unique,
  serial_number text not null unique,
  brand public.cylinder_brand not null,
  size public.cylinder_size not null,
  status public.cylinder_status not null default 'In Store',
  condition public.cylinder_condition not null default 'Good',
  location public.cylinder_location not null default 'Store',
  buying_price numeric(12,2) not null default 0,
  selling_price numeric(12,2) not null default 0,
  date_added date not null default current_date,
  main_image_url text,
  damage_image_url text,
  delivery_proof_url text,
  receipt_url text,
  notes text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  location text not null,
  delivery_address text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  type public.transaction_type not null,
  cylinder_id uuid not null references public.cylinders(id) on delete restrict,
  customer_id uuid references public.customers(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  amount_paid numeric(12,2) not null default 0,
  payment_status public.payment_status not null default 'Unpaid',
  payment_method public.payment_method not null default 'M-Pesa',
  delivery_location text,
  driver_name text,
  delivery_proof_url text,
  receipt_url text,
  transaction_date date not null default current_date,
  notes text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  cylinder_id uuid not null references public.cylinders(id) on delete cascade,
  previous_status public.cylinder_status,
  new_status public.cylinder_status not null,
  previous_condition public.cylinder_condition,
  new_condition public.cylinder_condition,
  reason text not null,
  adjusted_by uuid references public.users(id) on delete set null,
  adjusted_at timestamptz not null default now()
);

create index idx_cylinders_status on public.cylinders(status);
create index idx_cylinders_size on public.cylinders(size);
create index idx_cylinders_brand on public.cylinders(brand);
create index idx_cylinders_condition on public.cylinders(condition);
create index idx_customers_phone on public.customers(phone);
create index idx_transactions_type on public.transactions(type);
create index idx_transactions_date on public.transactions(transaction_date);
create index idx_transactions_cylinder on public.transactions(cylinder_id);
create index idx_transactions_customer on public.transactions(customer_id);
create index idx_stock_adjustments_cylinder on public.stock_adjustments(cylinder_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_users_updated_at before update on public.users for each row execute function public.touch_updated_at();
create trigger touch_cylinders_updated_at before update on public.cylinders for each row execute function public.touch_updated_at();
create trigger touch_customers_updated_at before update on public.customers for each row execute function public.touch_updated_at();
create trigger touch_transactions_updated_at before update on public.transactions for each row execute function public.touch_updated_at();

create or replace function public.apply_transaction_status()
returns trigger language plpgsql as $$
begin
  update public.cylinders
  set status = case new.type
    when 'Sale' then 'Sold'::public.cylinder_status
    when 'Delivery' then 'Delivered'::public.cylinder_status
    when 'Return' then 'Returned'::public.cylinder_status
    when 'Refill' then 'Full'::public.cylinder_status
    else status
  end
  where id = new.cylinder_id;
  return new;
end;
$$;

create trigger update_cylinder_after_transaction
after insert on public.transactions
for each row execute function public.apply_transaction_status();

alter table public.users enable row level security;
alter table public.cylinders enable row level security;
alter table public.customers enable row level security;
alter table public.transactions enable row level security;
alter table public.stock_adjustments enable row level security;

create policy "Authenticated users can read users" on public.users for select to authenticated using (true);
create policy "Users can insert own profile" on public.users for insert to authenticated with check (id = auth.uid());
create policy "Users can update own profile" on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Authenticated users can manage cylinders" on public.cylinders for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage customers" on public.customers for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage transactions" on public.transactions for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage stock adjustments" on public.stock_adjustments for all to authenticated using (true) with check (true);

insert into public.cylinders (cylinder_id, serial_number, brand, size, status, condition, location, buying_price, selling_price, date_added, notes) values
('EQP-13-001', 'TOT-1326-001', 'Total', '13kg', 'Full', 'Good', 'Store', 6500, 9800, '2026-05-01', 'Fast moving family-size cylinder.'),
('EQP-06-014', 'KG-0626-014', 'K-Gas', '6kg', 'Delivered', 'Good', 'Client Site', 3300, 5200, '2026-05-03', 'Delivered to Westlands customer.'),
('EQP-50-003', 'PG-5026-003', 'ProGas', '50kg', 'Refill Needed', 'Needs Inspection', 'Store', 22000, 31500, '2026-04-22', 'Returned empty after restaurant delivery.'),
('EQP-03-020', 'HASH-0326-020', 'Hashi', '3kg', 'Sold', 'Good', 'Office', 1800, 2800, '2026-05-06', 'Counter sale.'),
('EQP-13-008', 'AFR-1326-008', 'Afrigas', '13kg', 'Returned', 'Damaged', 'Vehicle', 6100, 9300, '2026-04-29', 'Valve guard dented; needs assessment.');

insert into public.customers (full_name, phone, email, location, delivery_address, notes) values
('Grace Wanjiku', '+254712345678', 'grace@example.com', 'Kilimani', 'Argwings Kodhek Road, Kilimani', 'Prefers M-Pesa payments.'),
('Kamau Restaurant Supplies', '+254733887766', 'orders@kamaufoods.co.ke', 'Westlands', 'Mpaka Road, Westlands', 'Weekly 50kg refill account.'),
('Amina Hassan', '+254701112233', null, 'South C', 'Muhoho Avenue, South C', 'Call before dispatch.');
