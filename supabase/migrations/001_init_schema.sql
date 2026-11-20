-- ============================================================================
-- CS Portal (بوابة حاسبات) — Initial PostgreSQL Schema & Row Level Security
-- Migration: 001_init_schema.sql
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  year_level smallint check (year_level is null or year_level between 1 and 4),
  department text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

-- 1.2 Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  year_level smallint not null check (year_level between 1 and 4),
  term smallint not null check (term in (1, 2)),
  is_paid boolean not null default false,
  price numeric(10, 2) not null default 0 check (price >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 1.3 Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  section_title text not null,
  title text not null,
  order_index integer not null default 0,
  video_provider text not null default 'youtube' check (video_provider in ('youtube', 'bunny')),
  video_id text,
  summary_md text,
  resources jsonb not null default '[]'::jsonb,
  is_free_preview boolean not null default false,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  created_at timestamptz not null default now()
);

-- 1.4 Lesson Interactives (HTML labs & external simulators — lazy-loaded)
create table if not exists public.lesson_interactives (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null,
  description text,
  order_index integer not null default 0,
  source_type text not null default 'html_code' check (source_type in ('html_code', 'external_url')),
  html_content text,
  external_url text,
  default_height integer not null default 540 check (default_height > 0),
  created_at timestamptz not null default now()
);

-- 1.5 Quiz Questions
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  question_text text not null,
  code_snippet text,
  code_lang text,
  options jsonb not null default '[]'::jsonb,
  correct_index integer not null check (correct_index >= 0),
  explanation text,
  order_index integer not null default 0
);

-- 1.6 User Progress
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  is_completed boolean not null default false,
  best_quiz_score integer check (best_quiz_score is null or best_quiz_score between 0 and 100),
  updated_at timestamptz not null default now(),
  constraint user_progress_user_lesson_unique unique (user_id, lesson_id)
);

-- 1.7 Enrollments (Phase 3 ready, enforced by RLS from Day 1)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'expired')),
  enrolled_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint enrollments_user_course_unique unique (user_id, course_id)
);

-- ============================================================================
-- 2. PERFORMANCE INDEXES
-- ============================================================================

create index if not exists idx_courses_published_year_term
  on public.courses (is_published, year_level, term);

create index if not exists idx_lessons_course_order
  on public.lessons (course_id, order_index);

create index if not exists idx_lesson_interactives_lesson_order
  on public.lesson_interactives (lesson_id, order_index);

create index if not exists idx_questions_lesson_order
  on public.questions (lesson_id, order_index);

create index if not exists idx_user_progress_user
  on public.user_progress (user_id);

create index if not exists idx_user_progress_lesson
  on public.user_progress (lesson_id);

create index if not exists idx_enrollments_user_course_status
  on public.enrollments (user_id, course_id, status);

create index if not exists idx_enrollments_course
  on public.enrollments (course_id);

-- ============================================================================
-- 3. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Checks whether the currently authenticated user has profiles.role = 'admin'.
-- Uses SECURITY DEFINER to avoid RLS recursion when referenced in policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Automatically create a student profile whenever a new auth.users row is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    'student'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep user_progress.updated_at fresh on updates.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_progress_updated_at on public.user_progress;
create trigger set_user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

-- Public curriculum metadata RPC (returns ONLY syllabus titles & metadata,
-- NEVER summary_md, video_id, or resources) so unenrolled users can preview
-- locked lessons in the syllabus while lessons RLS protects all actual content.
create or replace function public.get_course_curriculum(p_course_id uuid)
returns table (
  id uuid,
  course_id uuid,
  section_title text,
  title text,
  order_index integer,
  is_free_preview boolean,
  duration_minutes integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    l.id,
    l.course_id,
    l.section_title,
    l.title,
    l.order_index,
    l.is_free_preview,
    l.duration_minutes
  from public.lessons l
  join public.courses c on c.id = l.course_id
  where l.course_id = p_course_id
    and (c.is_published = true or public.is_admin())
  order by l.order_index asc;
$$;

-- Public lesson count per published course (lightweight catalog stats).
create or replace function public.get_published_course_lesson_counts()
returns table (
  course_id uuid,
  lesson_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as course_id,
    count(l.id)::bigint as lesson_count
  from public.courses c
  left join public.lessons l on l.course_id = c.id
  where c.is_published = true
  group by c.id;
$$;

grant execute on function public.get_course_curriculum(uuid) to anon, authenticated;
grant execute on function public.get_published_course_lesson_counts() to anon, authenticated;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_interactives enable row level security;
alter table public.questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.enrollments enable row level security;

-- ----------------------------------------------------------------------------
-- 4.1 profiles policies
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id and (role = 'student' or public.is_admin()));

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4.2 courses policies
-- ----------------------------------------------------------------------------
drop policy if exists "courses_select_published" on public.courses;
create policy "courses_select_published"
  on public.courses
  for select
  using (is_published = true or public.is_admin());

drop policy if exists "courses_admin_insert" on public.courses;
create policy "courses_admin_insert"
  on public.courses
  for insert
  with check (public.is_admin());

drop policy if exists "courses_admin_update" on public.courses;
create policy "courses_admin_update"
  on public.courses
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "courses_admin_delete" on public.courses;
create policy "courses_admin_delete"
  on public.courses
  for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4.3 lessons policies
-- Free courses: readable by all when course.is_published = true.
-- Paid courses: readable only if is_free_preview = true OR user has an active,
-- non-expired enrollment (status = 'active' and (expires_at is null or expires_at > now())).
-- ----------------------------------------------------------------------------
drop policy if exists "lessons_select_accessible" on public.lessons;
create policy "lessons_select_accessible"
  on public.lessons
  for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.courses c
      where c.id = lessons.course_id
        and c.is_published = true
        and (
          c.is_paid = false
          or lessons.is_free_preview = true
          or exists (
            select 1
            from public.enrollments e
            where e.course_id = c.id
              and e.user_id = auth.uid()
              and e.status = 'active'
              and (e.expires_at is null or e.expires_at > now())
          )
        )
    )
  );

drop policy if exists "lessons_admin_insert" on public.lessons;
create policy "lessons_admin_insert"
  on public.lessons
  for insert
  with check (public.is_admin());

drop policy if exists "lessons_admin_update" on public.lessons;
create policy "lessons_admin_update"
  on public.lessons
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "lessons_admin_delete" on public.lessons;
create policy "lessons_admin_delete"
  on public.lessons
  for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4.4 lesson_interactives policies (inherits lessons visibility)
-- ----------------------------------------------------------------------------
drop policy if exists "lesson_interactives_select_via_lesson" on public.lesson_interactives;
create policy "lesson_interactives_select_via_lesson"
  on public.lesson_interactives
  for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.lessons l
      where l.id = lesson_interactives.lesson_id
    )
  );

drop policy if exists "lesson_interactives_admin_insert" on public.lesson_interactives;
create policy "lesson_interactives_admin_insert"
  on public.lesson_interactives
  for insert
  with check (public.is_admin());

drop policy if exists "lesson_interactives_admin_update" on public.lesson_interactives;
create policy "lesson_interactives_admin_update"
  on public.lesson_interactives
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "lesson_interactives_admin_delete" on public.lesson_interactives;
create policy "lesson_interactives_admin_delete"
  on public.lesson_interactives
  for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4.5 questions policies (inherits lessons visibility)
-- ----------------------------------------------------------------------------
drop policy if exists "questions_select_via_lesson" on public.questions;
create policy "questions_select_via_lesson"
  on public.questions
  for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.lessons l
      where l.id = questions.lesson_id
    )
  );

drop policy if exists "questions_admin_insert" on public.questions;
create policy "questions_admin_insert"
  on public.questions
  for insert
  with check (public.is_admin());

drop policy if exists "questions_admin_update" on public.questions;
create policy "questions_admin_update"
  on public.questions
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "questions_admin_delete" on public.questions;
create policy "questions_admin_delete"
  on public.questions
  for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4.6 user_progress policies (scoped to auth.uid() = user_id)
-- ----------------------------------------------------------------------------
drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own"
  on public.user_progress
  for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own"
  on public.user_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_progress_delete_own" on public.user_progress;
create policy "user_progress_delete_own"
  on public.user_progress
  for delete
  using (auth.uid() = user_id or public.is_admin());

-- ----------------------------------------------------------------------------
-- 4.7 enrollments policies (students read own; only admins/RPCs write)
-- ----------------------------------------------------------------------------
drop policy if exists "enrollments_select_own" on public.enrollments;
create policy "enrollments_select_own"
  on public.enrollments
  for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrollments_admin_insert" on public.enrollments;
create policy "enrollments_admin_insert"
  on public.enrollments
  for insert
  with check (public.is_admin());

drop policy if exists "enrollments_admin_update" on public.enrollments;
create policy "enrollments_admin_update"
  on public.enrollments
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "enrollments_admin_delete" on public.enrollments;
create policy "enrollments_admin_delete"
  on public.enrollments
  for delete
  using (public.is_admin());
