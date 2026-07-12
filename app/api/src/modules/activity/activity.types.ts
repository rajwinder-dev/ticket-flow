import { ActorType, EntryType, LogSeverity } from "@org/database";

export interface ActivityLogService {
  organizationId?: string;
  actorId?: string;
  entityType: EntryType;
  event: string;
  entityId?: string;
  actorType?: ActorType;
  severity?: LogSeverity;
  oldData?: any;
  newData?: any;
  message: string;
  metadata?: any;
  ipAddress?: string;
}
