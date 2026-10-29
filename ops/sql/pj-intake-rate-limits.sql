-- Scoped to The Jewish Mutual intake only, not Hamsa Nomads tables.
-- Store salted hashes, never IP addresses or raw email addresses.
create table if not exists public.pj_intake_limits (
  fingerprint text not null check(fingerprint ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null,
  requests integer not null default 1 check(requests between 1 and 100000),
  primary key(fingerprint,window_start)
);
alter table public.pj_intake_limits enable row level security;
revoke all on public.pj_intake_limits from public,anon,authenticated;
grant select,insert,update,delete on public.pj_intake_limits to service_role;

-- This RPC can ONLY be called using the backend's private service role.
-- Atomic UPSERT enforces budget under concurrent requests.
create or replace function public.pj_claim_intake_quota(
  p_ip_hash text,
  p_email_hash text
) returns boolean
language plpgsql security definer set search_path=''
as $$
declare
  v_count integer;
  v_ip_bucket timestamptz := date_trunc('hour', now());
  v_email_bucket timestamptz := date_trunc('day', now());
begin
  if p_email_hash is null or p_email_hash !~ '^[a-f0-9]{64}$' then return false; end if;
  if p_ip_hash is not null then
    if p_ip_hash !~ '^[a-f0-9]{64}$' then return false; end if;
    -- 8 accepted attempts per hour per network (avoid penalizing shared Wi-Fi too aggressively).
    insert into public.pj_intake_limits (fingerprint,window_start,requests)
    values(p_ip_hash,v_ip_bucket,1)
    on conflict (fingerprint,window_start) do update
    set requests=public.pj_intake_limits.requests+1
    where public.pj_intake_limits.requests < 8
    returning requests into v_count;
    if v_count is null then return false; end if;
  end if;

  v_count:=null;
  -- 3 accepted requests per normalized email each day, across Jewish Mutual forms.
  insert into public.pj_intake_limits (fingerprint,window_start,requests)
  values(p_email_hash,v_email_bucket,1)
  on conflict (fingerprint,window_start) do update
  set requests=public.pj_intake_limits.requests+1
  where public.pj_intake_limits.requests < 3
  returning requests into v_count;
  return v_count is not null;
end
$$;

revoke all on function public.pj_claim_intake_quota(text,text) from public,anon,authenticated;
grant execute on function public.pj_claim_intake_quota(text,text) to service_role;

-- Do not drop anonymous intake privileges until the new endpoint and ALL
-- frontend forms have been tested and deployed. That cutover is separate.
comment on table public.pj_intake_limits is
'The Jewish Mutual anti-spam rate windows. Contains salted fingerprints only.';
