import type { FilterOptions } from "@org/web-utils";
import type {
  InviteMemberDetailsResponse,
  InviteUserOrganizationInput,
  MemberSchemaResponse,
} from "@org/zod";
import { api } from "../../api.js";

export const memberApi = {
  getMembers: async (filterOptions: FilterOptions) => {
    const data = await api.getMany<MemberSchemaResponse>({
      path: `/member`,
      filterOptions,
    });
    return data;
  },
  assignQueue: async ({ queueId, userId }: { queueId: string; userId: string }) => {
    const data = await api.post({
      path: `/member/${queueId}/agents/${userId}`,
    });
    return data;
  },
  unassignQueue: async ({ queueId, userId }: { queueId: string; userId: string }) => {
    const data = await api.delete({
      path: `/member/${queueId}/agents/${userId}/unassign`,
    });
    return data;
  },
  updateRole: async ({ roleId, userId }: { roleId: string; userId: string }) => {
    const data = await api.post({
      path: `/member/${roleId}/roles/${userId}`,
    });
    return data;
  },
  getInviteDetails: async (token: string) => {
    const data = await api.get<InviteMemberDetailsResponse>({
      path: `/org/${token}/invite`,
    });
    return data;
  },
  inviteUser: async (input: InviteUserOrganizationInput) => {
    const data = await api.post({
      path: `/org/invite`,
      data: input,
    });
    return data;
  },
  acceptInvite: async (token: string) => {
    const data = await api.post<{ organizationId: string }>({
      path: `/org/${token}/invite`,
    });
    return data;
  },
};
