-- Foto de perfil do colaborador (tela 8.1). O arquivo vive no bucket privado
-- `avatares` em "{auth.uid()}/avatar.<ext>"; a coluna guarda apenas o caminho.

alter table public.colaboradores
  add column if not exists foto_perfil text;

-- O trabalhador edita o proprio contato e agora tambem a propria foto.
-- Demais colunas seguem somente-leitura (mantidas pelo gestor).
grant update (telefone, email, foto_perfil) on public.colaboradores to authenticated;

insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', false)
on conflict (id) do nothing;

-- Substituir a foto usa upsert, entao precisa de insert + update.
drop policy if exists avatares_insert_own on storage.objects;
create policy avatares_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatares_update_own on storage.objects;
create policy avatares_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatares_select_own on storage.objects;
create policy avatares_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatares_delete_own on storage.objects;
create policy avatares_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
