-- Bucket privado dos comprovantes anexados nas justificativas de ausencia (tela 4.4).
-- O caminho e sempre "{auth.uid()}/arquivo.ext", igual ao padrao ja usado em ponto-fotos.
insert into storage.buckets (id, name, public)
values ('comprovantes', 'comprovantes', false)
on conflict (id) do nothing;

-- O trabalhador so enxerga e grava dentro da propria pasta.
drop policy if exists comprovantes_insert_own on storage.objects;
create policy comprovantes_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists comprovantes_select_own on storage.objects;
create policy comprovantes_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists comprovantes_delete_own on storage.objects;
create policy comprovantes_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
