import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { lookupApi } from "./api";
interface props {
  queueId?: string;
  groupId?: string;
}
export const useLookupHook = ({ queueId, groupId }: props = {}) => {
  const { orgId } = useParams();
  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryFn: lookupApi.getGroups,
    queryKey: ["lookup", "group", { orgId }],
    enabled: !!orgId,
  });
  const { data: queueData, isLoading: isLoadingQueues } = useQuery({
    queryFn: () => lookupApi.getQueues(groupId!),
    queryKey: ["lookup", "queue", { orgId, groupId }],
    enabled: !!groupId,
  });
  const { data: agentsData, isLoading: isLoadingAgents } = useQuery({
    queryFn: () => lookupApi.getAgents(queueId!),
    queryKey: ["lookup", "agent", { orgId, queueId }],
    enabled: !!queueId,
  });
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryFn: () => lookupApi.getRoles(),
    queryKey: ["lookup", "roles", { orgId }],
    enabled: !!orgId,
  });
  return {
    groupsData,
    isLoadingGroups,
    queueData,
    isLoadingQueues,
    agentsData,
    isLoadingAgents,
    rolesData,
    isLoadingRoles,
  };
};
