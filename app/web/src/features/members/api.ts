import type { FilterOptions } from "@/types/axis.types";
import { deleteRequest, getRequest, getRequestMany, postRequest } from "@/utils/axis";
import type {
  InviteMemberDetailsResponse,
  InviteUserOrganizationInput,
  MemberSchemaResponse,
} from "@org/zod";

export const memberApi = {
  getMembers: async (filterOptions: FilterOptions) => {
    const data = await getRequestMany<MemberSchemaResponse>({
      path: `/member`,
      filterOptions,
    });
    return data;
  },
  assignQueue: async ({ queueId, userId }: { queueId: string; userId: string }) => {
    const data = await postRequest({
      path: `/member/${queueId}/agents/${userId}`,
    });
    return data;
  },
  unassignQueue: async ({ queueId, userId }: { queueId: string; userId: string }) => {
    const data = await deleteRequest({
      path: `/member/${queueId}/agents/${userId}/unassign`,
    });
    return data;
  },
  updateRole: async ({ roleId, userId }: { roleId: string; userId: string }) => {
    const data = await postRequest({
      path: `/member/${roleId}/roles/${userId}`,
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
    const data = await postRequest<{ organizationId: string }>({
      path: `/org/${token}/invite`,
    });
    return data;
  },
};
