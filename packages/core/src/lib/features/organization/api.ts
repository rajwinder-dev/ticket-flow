import type {
  CreateOrganizationInput,
  CreateOrganizationResponse,
  OnboardingStatusResponse,
  OrganizationSchemaResponse,
  UpdateOrganizationInput,
} from "@org/zod";
import type { InviteDetails, Organization } from "./types.js";
import { api } from "../../api.js";

export const orgApi = {
  checkInvite: async (token: string) => {
    const data = await api.get<InviteDetails>({
      path: `/org/token/${token}`,
    });
    return data;
  },

  getMine: async () => {
    const data = await api.getMany<Organization>({
      path: `/org/me`,
    });
    return data;
  },
  getCurrent: async () => {
    const data = await api.get<OrganizationSchemaResponse>({
      path: "/org/current",
    });
    return data;
  },
  create: async (input: CreateOrganizationInput) => {
    const data = await api.post<CreateOrganizationResponse>({
      path: `/org`,
      data: input,
    });
    return data;
  },

  update: async (input: UpdateOrganizationInput) => {
    const data = await api.patch<Organization>({
      path: `/org`,
      data: input,
    });
    return data;
  },

  delete: async (organizationId: string) => {
    const data = await api.delete<Organization>({
      path: `/org/${organizationId}`,
    });
    return data;
  },
  onboardStatus: async () => {
    const data = await api.get<OnboardingStatusResponse>({
      path: `/org/onboardStatus`
    })
    return data
  }
};
