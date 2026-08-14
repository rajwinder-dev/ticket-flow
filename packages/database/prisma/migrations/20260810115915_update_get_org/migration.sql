-- AlterEnum
ALTER TYPE "TicketAction"
ADD VALUE 'GROUP_CHANGED';

CREATE OR REPLACE FUNCTION get_my_organizations (
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  logo TEXT,
  "createdBy" UUID,
  "roleName" TEXT,
  "isOwner" BOOLEAN,
  total_count BIGINT
) SECURITY DEFINER
SET
  search_path = public LANGUAGE sql STABLE AS $$
  SELECT
    o.id,
    o.name,
    o.logo,
    o."createdBy",
    r.name AS "roleName",
    (o."createdBy" = p_user_id) AS "isOwner",
    COUNT(*) OVER() AS total_count
  FROM "Membership" m
  JOIN "Organization" o
    ON o.id = m."organizationId"
  JOIN "Role" r
    ON r.id = m."roleId"
  WHERE m."userId" = p_user_id
    AND o.active = TRUE
  ORDER BY o.name
  LIMIT p_limit
  OFFSET p_offset;
$$;
