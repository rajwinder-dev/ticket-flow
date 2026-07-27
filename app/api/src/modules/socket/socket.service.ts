import { io } from '../../main';
export class SocketServiceClass {
  invlidUserQuery({
    recipientId,
    keys,
  }: {
    recipientId: string;
    keys: string[];
  }) {
    io.to(`user:${recipientId}`).emit('event', {
      type: 'invalidate',
      keys,
    });
  }
  invlidOrganizationQuery({
    organizationId,
    keys,
  }: {
    organizationId: string;
    keys: string[];
  }) {
    io.to(`org:${organizationId}`).emit('event', {
      type: 'invalidate',
      keys, 
    });
  }
}
export const SocketService = new SocketServiceClass();
