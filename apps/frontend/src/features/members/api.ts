import { getRequest, getRequestMany, postRequest } from "@/utils/axis";
import type { InviteMemberDetailsResponse, InviteUserOrganizationInput, MemberSchemaResponse } from "@repo/schemas";

export const memberApi = {
  getMembers: async () => {
    const data = await getRequestMany<MemberSchemaResponse>({
      path: `/org/member`,
    });
    return data;
  },
   getInviteDetails: async (token: string) => {
    const data = await getRequest<InviteMemberDetailsResponse>({
      path: `/org/${token}/invite`,
    });
    return data;
  },
  inviteUser: async (input: InviteUserOrganizationInput) => {
    const data = await postRequest({
      path: `/org/invite`,
      data: input,
    });
    return data;
  },
  acceptInvite: async (token: string) => {
    const data = await postRequest<{organizationId: string}>({
      path: `/org/${token}/invite`,
    });
    return data;
  },
};
