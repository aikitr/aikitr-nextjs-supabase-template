create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  is_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create index todos_user_id_created_at_idx
  on public.todos (user_id, created_at desc);

alter table public.todos enable row level security;

grant select, insert, update, delete on public.todos to authenticated;

create policy "Users can read their own todos"
  on public.todos
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own todos"
  on public.todos
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own todos"
  on public.todos
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own todos"
  on public.todos
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
