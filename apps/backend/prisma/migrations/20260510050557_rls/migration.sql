-- This is an empty migration.
ALTER TABLE "Ticket" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_policy
ON "Ticket"
FOR ALL
USING (
  "organizationId" =
NULLIF(
  current_setting('app.current_organization', true),
  ''
)::UUID)
WITH CHECK (
  "organizationId" =
NULLIF(
  current_setting('app.current_organization', true),
  ''
)::UUID);

ALTER TABLE "Ticket" FORCE ROW LEVEL SECURITY;
