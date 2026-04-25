-- Public bucket: anyone can read, only admins can write
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy property_images_public_read on storage.objects
  for select using (bucket_id = 'property-images');

create policy property_images_admin_insert on storage.objects
  for insert with check (bucket_id = 'property-images' and is_admin());

create policy property_images_admin_update on storage.objects
  for update using (bucket_id = 'property-images' and is_admin());

create policy property_images_admin_delete on storage.objects
  for delete using (bucket_id = 'property-images' and is_admin());
