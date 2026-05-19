-- This is an empty migration.
-- slq function for tenant error handling
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

