# Equipro LPG Stock Manager

Full-stack LPG gas stock taking app for Equipro Investments (K) Ltd. It uses Next.js App Router, TypeScript, Tailwind CSS, and Supabase for auth, database, and image storage.

## Features

- Supabase Auth login screen with Admin, Staff, and Driver role concept.
- Dashboard for total, full, empty, sold, delivered, returned, damaged cylinders, low stock alerts, and recent transactions.
- Cylinder inventory with add, edit, delete, search, filters, status badges, image previews, and mobile image upload controls.
- Customer management for contact details and delivery addresses.
- Sales and delivery transactions with automatic cylinder status updates.
- Returns and refills workflow for returned, empty, refill-needed, full, damaged, and leaking cylinders.
- Reports for daily, weekly, monthly stock, sales, deliveries, damaged, missing/unreturned, and inventory value with CSV export.
- Seed data for Total, K-Gas, ProGas, Hashi, and Afrigas cylinders.

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs with bundled demo data when Supabase environment variables are not configured. This workspace is already connected to the `EquiproLPG` Supabase project through `.env.local`.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=only-use-on-server-if-you-add-admin-jobs
```

## Supabase Setup

1. Create a Supabase project, or use the connected `EquiproLPG` project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Run `supabase/storage.sql` to create these public buckets:
   - `cylinder-images`
   - `damage-reports`
   - `delivery-proofs`
   - `receipts`
4. Create users in Supabase Auth, then add their profile rows in `public.users` with roles: `Admin`, `Staff`, or `Driver`.
5. Put your Supabase URL and publishable/anon key in `.env.local`.

## Project Structure

```text
src/app
  login
  inventory
  customers
  transactions
  returns-refills
  reports
src/components
  image-uploader.tsx
  shell/app-shell.tsx
  ui
src/lib
  supabase
  options.ts
  seed-data.ts
  store.tsx
  types.ts
  utils.ts
supabase
  schema.sql
  storage.sql
```

## Deployment

Deploy to Vercel, add the same Supabase environment variables, and ensure the Supabase SQL scripts have been run before users begin uploading production stock records.
