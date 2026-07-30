-- Migration: enable RLS + tenant isolation policies

BEGIN;

-- Tenant context helper
CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
DECLARE
  org_id TEXT;
BEGIN
  org_id := current_setting('app.current_organization', true);

  IF org_id IS NULL OR org_id = '' THEN
    RAISE EXCEPTION 'Tenant context missing: app.current_organization is not set';
  END IF;

  RETURN org_id::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- Apply RLS to each tenant-scoped table
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'Membership',
    'Role',
    'Ticket',
    'EmailProvider',
    'EmailMessage',
    'Customer',
    'QueueGroup',
    'Queue',
    'QueueAgent',
    'Attachment',
    'TicketComment',
    'TicketTransition',
    'ActivityLog'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);

    EXECUTE format('DROP POLICY IF EXISTS tenant_policy ON %I;', tbl);

    EXECUTE format(
      'CREATE POLICY tenant_policy ON %I
         FOR ALL
         USING ("organizationId" = current_organization_id())
         WITH CHECK ("organizationId" = current_organization_id());',
      tbl
    );
  END LOOP;
END $$;

COMMIT;
