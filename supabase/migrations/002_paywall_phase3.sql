-- ============================================================================
-- CS Portal (بوابة حاسبات) — Phase 3 Paywall & Code Redemption Migration
-- Migration: 002_paywall_phase3.sql
-- Deferred for Phase 3 monetization (Redeem Codes + InstaPay/Wallet Requests)
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 Redeem Codes (pre-generated activation codes for paid courses)
create table if not exists public.redeem_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  course_id uuid not null references public.courses (id) on delete cascade,
  is_used boolean not null default false,
  used_by uuid references auth.users (id) on delete set null,
  used_at timestamptz,
  duration_days integer check (duration_days is null or duration_days > 0),
  expires_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- 1.2 Payment Requests (manual InstaPay / Vodafone Cash / Fawry receipts)
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  amount numeric(10, 2) not null check (amount >= 0),
  method text not null default 'instapay' check (method in ('instapay', 'vodafone_cash', 'fawry', 'other')),
  reference_number text,
  receipt_url text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

create index if not exists idx_redeem_codes_course_unused
  on public.redeem_codes (course_id, is_used);

create index if not exists idx_redeem_codes_normalized
  on public.redeem_codes (upper(trim(code)));

create index if not exists idx_payment_requests_user
  on public.payment_requests (user_id, created_at desc);

create index if not exists idx_payment_requests_status
  on public.payment_requests (status, created_at desc);

create index if not exists idx_payment_requests_course
  on public.payment_requests (course_id);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table public.redeem_codes enable row level security;
alter table public.payment_requests enable row level security;

-- 3.1 redeem_codes: strictly admin-only direct access (students redeem via RPC)
drop policy if exists "redeem_codes_admin_all" on public.redeem_codes;
create policy "redeem_codes_admin_all"
  on public.redeem_codes
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 3.2 payment_requests: students can view/create own pending requests; admins manage all
drop policy if exists "payment_requests_select_own_or_admin" on public.payment_requests;
create policy "payment_requests_select_own_or_admin"
  on public.payment_requests
  for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "payment_requests_insert_own_pending" on public.payment_requests;
create policy "payment_requests_insert_own_pending"
  on public.payment_requests
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
  );

drop policy if exists "payment_requests_admin_update" on public.payment_requests;
create policy "payment_requests_admin_update"
  on public.payment_requests
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "payment_requests_admin_delete" on public.payment_requests;
create policy "payment_requests_admin_delete"
  on public.payment_requests
  for delete
  using (public.is_admin());

-- ============================================================================
-- 4. ATOMIC CODE REDEMPTION RPC
-- ============================================================================

create or replace function public.redeem_course_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_normalized_code text;
  v_code_row public.redeem_codes%rowtype;
  v_expires_at timestamptz;
  v_enrollment_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'UNAUTHENTICATED',
      'message', 'يجب تسجيل الدخول أولاً لتفعيل الكود.'
    );
  end if;

  v_normalized_code := upper(trim(coalesce(p_code, '')));
  if v_normalized_code = '' then
    return jsonb_build_object(
      'ok', false,
      'error', 'INVALID_CODE',
      'message', 'يرجى إدخال كود تفعيل صحيح.'
    );
  end if;

  -- Lock the matching redeem_codes row to prevent concurrent double-redemption
  select *
  into v_code_row
  from public.redeem_codes
  where upper(trim(code)) = v_normalized_code
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'CODE_NOT_FOUND',
      'message', 'كود التفعيل غير صحيح.'
    );
  end if;

  if v_code_row.is_used then
    return jsonb_build_object(
      'ok', false,
      'error', 'CODE_ALREADY_USED',
      'message', 'تم استخدام هذا الكود من قبل.'
    );
  end if;

  if v_code_row.expires_at is not null and v_code_row.expires_at <= now() then
    return jsonb_build_object(
      'ok', false,
      'error', 'CODE_EXPIRED',
      'message', 'انتهت صلاحية هذا الكود.'
    );
  end if;

  -- Mark code as used atomically
  update public.redeem_codes
  set
    is_used = true,
    used_by = v_user_id,
    used_at = now()
  where id = v_code_row.id;

  -- Calculate enrollment expiration (null = lifetime access)
  v_expires_at := case
    when v_code_row.duration_days is not null then now() + make_interval(days => v_code_row.duration_days)
    else null
  end;

  -- Upsert active enrollment for the user & course
  insert into public.enrollments (user_id, course_id, status, enrolled_at, expires_at)
  values (v_user_id, v_code_row.course_id, 'active', now(), v_expires_at)
  on conflict (user_id, course_id)
  do update set
    status = 'active',
    enrolled_at = now(),
    expires_at = case
      when public.enrollments.expires_at is null or excluded.expires_at is null then null
      else greatest(public.enrollments.expires_at, excluded.expires_at)
    end
  returning id into v_enrollment_id;

  return jsonb_build_object(
    'ok', true,
    'enrollment_id', v_enrollment_id,
    'course_id', v_code_row.course_id,
    'expires_at', v_expires_at
  );
end;
$$;

revoke all on function public.redeem_course_code(text) from public;
grant execute on function public.redeem_course_code(text) to authenticated;
