insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
('cylinder-images', 'cylinder-images', true, 5242880, array['image/jpeg','image/png','image/webp']),
('damage-reports', 'damage-reports', true, 5242880, array['image/jpeg','image/png','image/webp']),
('delivery-proofs', 'delivery-proofs', true, 5242880, array['image/jpeg','image/png','image/webp']),
('receipts', 'receipts', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Authenticated users can upload LPG images"
on storage.objects for insert to authenticated
with check (bucket_id in ('cylinder-images', 'damage-reports', 'delivery-proofs', 'receipts'));

create policy "Authenticated users can update LPG images"
on storage.objects for update to authenticated
using (bucket_id in ('cylinder-images', 'damage-reports', 'delivery-proofs', 'receipts'))
with check (bucket_id in ('cylinder-images', 'damage-reports', 'delivery-proofs', 'receipts'));

create policy "Authenticated users can delete LPG images"
on storage.objects for delete to authenticated
using (bucket_id in ('cylinder-images', 'damage-reports', 'delivery-proofs', 'receipts'));

create policy "Public can read LPG images"
on storage.objects for select to public
using (bucket_id in ('cylinder-images', 'damage-reports', 'delivery-proofs', 'receipts'));
