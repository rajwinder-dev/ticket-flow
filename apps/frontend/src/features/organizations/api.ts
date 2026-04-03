import { deleteRequest, getRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import type { CreateOrganizationInput, CreateOrganizationResponse, InviteUserOrganizationInput, OrganizationSchemaResponse, UpdateOrganizationInput } from "@repo/schemas";
import type { InviteDetails, Organization } from "./types";

export const orgApi = {
  checkInvite: async (token: string) => {
    const data = await getRequest<InviteDetails>({
      path: `/org/token/${token}`,
    });
    return data;
  },

  acceptInvite: async (token: string) => {
    const data = await postRequest<InviteDetails>({
      path: `/org/token/${token}`,
    });
    return data;
  },

  getMine: async () => {
    const data = await getRequestMany<Organization>({
      path: `/org/me`,
    });
    return data;
  },
  getCurrent: async () => {
    const data = await getRequest<OrganizationSchemaResponse>({
      path: "/org/current"
    })
    return data
  },
  create: async (input: CreateOrganizationInput) => {
    const data = await postRequest<CreateOrganizationResponse>({
      path: `/org`,
      data: input,
    });
    return data;
  },

  update: async (input: UpdateOrganizationInput) => {
    const data = await patchRequest<Organization>({
      path: `/org`,
      data: input,
    });
    return data;
  },

  delete: async (organizationId: string) => {
    const data = await deleteRequest<Organization>({
      path: `/org/${organizationId}`,
    });
    return data;
  },

  inviteUser: async (input: InviteUserOrganizationInput) => {
    const data = await postRequest<Organization>({
      path: `/organization/invite`,
      data: input,
    });
    return data;
  },
};
