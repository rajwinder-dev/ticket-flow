import { deleteRequest, getRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import type { CreateOrganizationInput, InviteUserOrganizationInput, UpdateOrganizationInput } from "@repo/schemas";
import type { InviteDetails, Organization } from "./types";

export async function checkInviteLink(token: string) {
  const data = await getRequest<InviteDetails>({
    path: `/org/token/${token}`,
  });
  return data;
}
export async function acceptInviteLink(token: string) {
  const data = await postRequest<InviteDetails>({
    path: `/org/token/${token}`,
  });
  return data;
}
export async function getOrganizations() {
  const data = await getRequestMany<Organization>({
    path: `/org/me`,
  });
  return data;
}
export async function createOrganization(input: CreateOrganizationInput) {
  const data = await postRequest<Organization>({
    path: `/org`,
    data: input,
  });
  return data;
}
export async function updateOrganization(input: UpdateOrganizationInput) {
  const data = await patchRequest<Organization>({
    path: `/org`,
    data: input,
  });
  return data;
}
export async function deleteOrganization(organizationId: string) {
  const data = await deleteRequest<Organization>({
    path: `/org/${organizationId}`,
  });
  return data;
}
export async function CreateOrganizationInvite(input: InviteUserOrganizationInput) {
  const data = await postRequest<Organization>({
    path: `/organization/invite`,
    data: input
  });
  return data;
}
