CREATE OR REPLACE FUNCTION get_email_webhook(
  p_to_emails TEXT[],
  p_limit INT DEFAULT 1
)
RETURNS TABLE (
  id TEXT,
  "organizationId" UUID,
  "providerType" TEXT,
  "fromEmail" TEXT,
  domain TEXT,
  "webhookSecret" TEXT,
  credentials JSONB,
  priority INT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT
    id,
    "organizationId",
    "providerType"::TEXT,
    "fromEmail",
    domain,
    "webhookSecret",
    credentials::JSONB,
    priority
  FROM "EmailProvider"
  WHERE "fromEmail" = ANY(p_to_emails)
    AND "providerType" != 'SMTP'
  ORDER BY priority ASC
  LIMIT p_limit;
$$;


