create table if not exists articles (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  author text,
  created_at timestamptz default now()
);