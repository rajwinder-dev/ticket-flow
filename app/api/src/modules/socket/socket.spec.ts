import { SocketService } from './socket.service';

const { mockEmit, mockTo } = vi.hoisted(() => ({
  mockEmit: vi.fn(),
  mockTo: vi.fn(),
}));

vi.mock('../../main', () => ({
  io: {
    to: mockTo,
  },
}));

describe('SocketService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTo.mockReturnValue({ emit: mockEmit });
  });

  describe('invlidUserQuery', () => {
    it('emits an invalidate event to the recipient user room', () => {
      SocketService.invlidUserQuery({
        recipientId: 'user-1',
        keys: ['notification'],
      });

      expect(mockTo).toHaveBeenCalledWith('user:user-1');
      expect(mockEmit).toHaveBeenCalledWith('event', {
        type: 'invalidate',
        keys: ['notification'],
      });
    });
  });

  describe('invlidOrganizationQuery', () => {
    it('emits an invalidate event to the organization room', () => {
      SocketService.invlidOrganizationQuery({
        organizationId: 'org-1',
        keys: ['tickets', 'queues'],
      });

      expect(mockTo).toHaveBeenCalledWith('org:org-1');
      expect(mockEmit).toHaveBeenCalledWith('event', {
        type: 'invalidate',
        keys: ['tickets', 'queues'],
      });
    });
  });
});
