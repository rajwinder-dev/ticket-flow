import { deleteRequest, getRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import type {
  CreateOrganizationInput,
  CreateOrganizationResponse,
  OnboardingStatusResponse,
  OrganizationSchemaResponse,
  UpdateOrganizationInput,
} from "@org/zod";
import type { InviteDetails, Organization } from "./types";

export const orgApi = {
  checkInvite: async (token: string) => {
    const data = await getRequest<InviteDetails>({
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
      path: "/org/current",
    });
    return data;
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
  onboardStatus: async () => {
    const data = await getRequest<OnboardingStatusResponse>({
      path: `/org/onboardStatus`
    })
    return data
  }
};
