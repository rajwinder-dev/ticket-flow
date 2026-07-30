-- Function must be owned by a role that bypasses RLS,
-- otherwise FORCE ROW LEVEL SECURITY still blocks it even in SECURITY DEFINER.
-- Typically your migration/superuser role already has BYPASSRLS.

CREATE OR REPLACE FUNCTION get_my_organizations(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  logo TEXT,
  "createdBy" UUID,
  "roleName" TEXT,
  "isOwner" BOOLEAN,    
  total_count BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT
    o.id,
    o.name,
    o.logo,
    o."createdBy",
    r.name AS "roleName",
    (o."createdBy" = p_user_id) AS "isOwner",
    COUNT(*) OVER() AS total_count
  FROM "Membership" m
  JOIN "Organization" o ON o.id = m."organizationId"
  JOIN "Role" r ON r.id = m."roleId"
  WHERE m."userId" = p_user_id
  ORDER BY o.name
  LIMIT p_limit
  OFFSET p_offset;
$$;

