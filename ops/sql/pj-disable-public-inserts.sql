-- FINAL CUTOVER — run only after the secure intake gateway is live and verified.
-- Scope strictly to Jewish Mutual public intake tables; Hamsa is unaffected.
do $$
declare r record;
begin
 for r in
   select table_name,column_name from information_schema.columns
   where table_schema='public' and table_name in
     ('pj_applications','pj_interest_shortlists','pj_inquiries')
 loop
   execute format('revoke insert (%I) on public.%I from anon,authenticated',
     r.column_name,r.table_name);
 end loop;
end $$;
revoke insert on public.pj_applications from anon,authenticated;
revoke insert on public.pj_interest_shortlists from anon,authenticated;
revoke insert on public.pj_inquiries from anon,authenticated;
drop policy if exists pj_public_application_submission on public.pj_applications;
drop policy if exists pj_interest_shortlists_public_insert on public.pj_interest_shortlists;
drop policy if exists pj_public_inquiry_submission on public.pj_inquiries;

-- Verify using both table and column-level grants. Expected zero writable columns.
do $$
declare r record;
begin
 for r in
   select table_name,
    count(*) filter(where has_column_privilege('anon',format('%I.%I',table_schema,table_name),column_name,'INSERT')) n
   from information_schema.columns
   where table_schema='public' and table_name in
     ('pj_applications','pj_interest_shortlists','pj_inquiries')
   group by table_name
 loop
   if r.n<>0 then raise exception 'Anonymous inserts still allowed in %',r.table_name; end if;
 end loop;
end $$;
