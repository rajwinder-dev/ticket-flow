import { useMembersStore } from '@/features/members/store';
import { beforeEach, describe, expect, test } from 'vitest';

describe('useMembersStore', () => {
  // 1. RESET THE STORE BEFORE EVERY SINGLE TEST
  beforeEach(() => {
    useMembersStore.setState({
      selected: new Set(),
      inviteToken: null,
      tokenEmail: null,
    });
  });

  // 2. TEST INVITE TOKEN ACTIONS
  describe('Invite Tokens', () => {
    test('should set invite token and email', () => {
      const store = useMembersStore.getState();
      
      store.setInviteToken({ token: 'abc-123', email: 'user@saas.com' });

      const updatedState = useMembersStore.getState();
      expect(updatedState.inviteToken).toBe('abc-123');
      expect(updatedState.tokenEmail).toBe('user@saas.com');
    });

    test('should clear invite token and email', () => {
      // Manually seed initial state for this specific test
      useMembersStore.setState({ inviteToken: 'abc', tokenEmail: 'test@test.com' });
      
      useMembersStore.getState().clearInvite();

      const updatedState = useMembersStore.getState();
      expect(updatedState.inviteToken).toBeNull();
      expect(updatedState.tokenEmail).toBeNull();
    });
  });

  // 3. TEST SELECTION LOGIC (SET / TOGGLE / CLEAR)
  describe('Member Selection', () => {
    test('should toggle an id ON if it does not exist in the Set', () => {
      const store = useMembersStore.getState();
      
      store.toggle('member-1');

      const { selected } = useMembersStore.getState();
      expect(selected.has('member-1')).toBe(true);
      expect(selected.size).toBe(1);
    });

    test('should toggle an id OFF if it already exists in the Set', () => {
      // Seed the state with an existing item
      useMembersStore.setState({ selected: new Set(['member-1', 'member-2']) });
      const store = useMembersStore.getState();

      store.toggle('member-1'); // Remove it

      const { selected } = useMembersStore.getState();
      expect(selected.has('member-1')).toBe(false);
      expect(selected.has('member-2')).toBe(true);
      expect(selected.size).toBe(1);
    });

    test('should clear all selected items', () => {
      useMembersStore.setState({ selected: new Set(['1', '2', '3']) });
      
      useMembersStore.getState().clear();

      const { selected } = useMembersStore.getState();
      expect(selected.size).toBe(0);
    });

    test('should add all visible rows to the selection', () => {
      useMembersStore.setState({ selected: new Set(['existing-id']) });
      const store = useMembersStore.getState();
      const mockRows = [{ id: 'row-1' }, { id: 'row-2' }];

      store.selectAllVisible(mockRows);

      const { selected } = useMembersStore.getState();
      expect(selected.has('existing-id')).toBe(true);
      expect(selected.has('row-1')).toBe(true);
      expect(selected.has('row-2')).toBe(true);
      expect(selected.size).toBe(3);
    });
  });
});
