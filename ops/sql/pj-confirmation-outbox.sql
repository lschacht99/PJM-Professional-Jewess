-- The Jewish Mutual: transactional confirmation outbox.
-- Scoped only to pj_* intake tables; disabled until a verified mail provider is configured.
-- The webhook token is generated in the database, never copied into public JS or GitHub.
create extension if not exists pg_net;

create table if not exists public.pj_mail_settings (
  id smallint primary key default 1 check (id=1),
  webhook_token text not null default encode(gen_random_bytes(32),'hex'),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.pj_mail_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.pj_mail_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_table text not null check(source_table in ('pj_interest_shortlists','pj_applications','pj_inquiries')),
  source_id uuid not null,
  kind text not null check(kind in ('participant','professional','volunteer','workplace','contact','collaboration')),
  recipient_email text not null,
  recipient_name text not null,
  selected_idea_ids text[] not null default array[]::text[],
  status text not null default 'waiting_for_setup'
    check(status in ('waiting_for_setup','queued','sending','sent','failed')),
  attempts smallint not null default 0 check(attempts between 0 and 10),
  last_error text,
  provider_message_id text,
  sent_at timestamptz,
  claimed_at timestamptz,
  unique(source_table,source_id)
);
create index if not exists pj_mail_jobs_status_created on public.pj_mail_jobs(status,created_at);
alter table public.pj_mail_settings enable row level security;
alter table public.pj_mail_jobs enable row level security;
revoke all on public.pj_mail_settings from public, anon, authenticated;
revoke all on public.pj_mail_jobs from public, anon, authenticated;
grant select on public.pj_mail_settings to service_role;
grant select,update on public.pj_mail_jobs to service_role;

-- Runs after the intake record is committed; the asynchronous pg_net request
-- does not expose applicant information in the webhook payload (only a job UUID).
create or replace function public.pj_enqueue_confirmation()
returns trigger
language plpgsql security definer set search_path=''
as $fn$
declare
  v_name text;
  v_email text;
  v_kind text;
  v_selected text[]:=array[]::text[];
  v_source text;
  v_enabled boolean;
  v_token text;
  v_job uuid;
begin
  if TG_OP <> 'INSERT' then return NEW; end if;
  v_email:=lower(btrim(NEW.email));
  if v_email is null or length(v_email)>254
     or v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return NEW;
  end if;

  if TG_TABLE_NAME='pj_interest_shortlists' then
    if NEW.consent is distinct from true then return NEW; end if;
    v_name:=coalesce(nullif(split_part(btrim(NEW.full_name),' ',1),''),'there');
    v_kind:='participant';
    v_selected:=coalesce(NEW.idea_ids,array[]::text[]);
  elsif TG_TABLE_NAME='pj_applications' then
    if NEW.privacy_ack is distinct from true then return NEW; end if;
    v_name:=coalesce(nullif(btrim(NEW.first_name),''),'there');
    v_source:=lower(coalesce(NEW.source,''));
    v_kind:=case
      when v_source like '%workplace%' then 'workplace'
      when NEW.role='mentor' then 'professional'
      else 'participant' end;
    v_selected:=coalesce(NEW.experience_ids,array[]::text[]);
  elsif TG_TABLE_NAME='pj_inquiries' then
    v_name:=coalesce(nullif(split_part(btrim(NEW.full_name),' ',1),''),'there');
    v_source:=lower(coalesce(NEW.source,''));
    v_kind:=case
      when v_source like '%volunteer%' then 'volunteer'
      when v_source like '%expert%' or v_source like '%partner%' then 'professional'
      when v_source like '%contact%' then 'contact'
      else 'collaboration' end;
  else
    return NEW;
  end if;

  -- Limit accidental duplicates and simple confirmation-email abuse.
  -- Every application is still saved; only rapid repeat receipts are suppressed.
  if exists (
    select 1 from public.pj_mail_jobs
    where recipient_email=v_email and kind=v_kind
      and created_at>now()-interval '10 minutes'
  ) then return NEW; end if;

  select enabled,webhook_token into v_enabled,v_token
  from public.pj_mail_settings where id=1;
  insert into public.pj_mail_jobs
    (source_table,source_id,kind,recipient_email,recipient_name,selected_idea_ids,status)
  values
    (TG_TABLE_NAME,NEW.id,v_kind,v_email,left(v_name,120),v_selected,
     case when coalesce(v_enabled,false) then 'queued' else 'waiting_for_setup' end)
  on conflict(source_table,source_id) do nothing returning id into v_job;

  if v_job is not null and coalesce(v_enabled,false) then
    begin
      perform net.http_post(
        url:='https://vvveenntewwtyhnmimal.supabase.co/functions/v1/jm-confirmation',
        body:=jsonb_build_object('job_id',v_job::text),
        headers:=jsonb_build_object('Content-Type','application/json','x-jm-hook-token',v_token),
        timeout_milliseconds:=10000
      );
    exception when others then
      -- An email delivery issue must never invalidate an accepted signup.
      update public.pj_mail_jobs set status='failed',
        last_error='Unable to enqueue confirmation webhook' where id=v_job;
    end;
  end if;
  return NEW;
end
$fn$;

revoke all on function public.pj_enqueue_confirmation() from public,anon,authenticated;
drop trigger if exists pj_applications_mail_confirmation on public.pj_applications;
create trigger pj_applications_mail_confirmation after insert on public.pj_applications
for each row execute function public.pj_enqueue_confirmation();
drop trigger if exists pj_inquiries_mail_confirmation on public.pj_inquiries;
create trigger pj_inquiries_mail_confirmation after insert on public.pj_inquiries
for each row execute function public.pj_enqueue_confirmation();
drop trigger if exists pj_interest_shortlists_mail_confirmation on public.pj_interest_shortlists;
create trigger pj_interest_shortlists_mail_confirmation after insert on public.pj_interest_shortlists
for each row execute function public.pj_enqueue_confirmation();

comment on table public.pj_mail_jobs is
'The Jewish Mutual confirmation outbox. Private to backend; no public select/insert policies.';
comment on table public.pj_mail_settings is
'Private configuration. Enable only after provider credentials and sender-domain verification.';

-- Administrative retry for failures only; never callable with the anonymous API.
-- Check the provider's delivery log first if an HTTP response was ambiguous.
create or replace function public.pj_retry_confirmation(p_job_id uuid)
returns boolean
language plpgsql security definer set search_path=''
as $fn$
declare
  v_enabled boolean;
  v_token text;
  v_id uuid;
begin
  select enabled,webhook_token into v_enabled,v_token
  from public.pj_mail_settings where id=1;
  if v_enabled is distinct from true then return false; end if;
  update public.pj_mail_jobs
  set status='queued',last_error=null,claimed_at=null,attempts=attempts+1
  where id=p_job_id and status='failed' and attempts<3
  returning id into v_id;
  if v_id is null then return false; end if;
  begin
    perform net.http_post(
      url:='https://vvveenntewwtyhnmimal.supabase.co/functions/v1/jm-confirmation',
      body:=jsonb_build_object('job_id',v_id::text),
      headers:=jsonb_build_object('Content-Type','application/json','x-jm-hook-token',v_token),
      timeout_milliseconds:=10000
    );
  exception when others then
    update public.pj_mail_jobs set status='failed',
      last_error='Unable to re-enqueue confirmation' where id=v_id;
    return false;
  end;
  return true;
end
$fn$;
revoke all on function public.pj_retry_confirmation(uuid) from public,anon,authenticated;
