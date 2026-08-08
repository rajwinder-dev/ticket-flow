import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotifierService } from './notifier.service';

describe('notifier', () => {
  let send: any;
  let info: any;
  let error: any;
  let notifier: NotifierService;
  beforeEach(() => {
    send = vi.fn().mockResolvedValue({ id: '123' });
    info = vi.fn();
    error = vi.fn();
    notifier = new NotifierService({ send }, { info, error });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should notify user', async () => {
    const output = await notifier.notifyUser('test@gmail.com', 'hello world');
    expect(output).toBe(true);
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      'test@gmail.com',
      'Notification',
      'hello world',
    );
  });
  it('should notify many users', async () => {
    const output = await notifier.notifyMany(
      ['test@gmail.com', 'xyz@gmail.com'],
      'hello world',
    );
    expect(output).toEqual({ sent: 2, failed: 0 });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      'test@gmail.com',
      'Notification',
      'hello world',
    );
  });
});

describe('notifier failer', () => {
  let send: any;
  let info: any;
  let error: any;
  let notifier: NotifierService;
  beforeEach(() => {
    send = vi.fn().mockRejectedValue(new Error('test error'));
    info = vi.fn();
    error = vi.fn();
    notifier = new NotifierService({ send }, { info, error });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should fail to notify', async () => {
    const output = await notifier.notifyUser('test@gmail.com', 'hello world');
    expect(output).toBe(false);
    expect(error).toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      'Failed to notify test@gmail.com',
      new Error('test error'),
    );
  });
  it('should fail to notify many mix results', async () => {
    send = vi
      .fn()
      .mockRejectedValueOnce(new Error('test error'))
      .mockResolvedValueOnce({ id: '123' });
    notifier = new NotifierService({ send }, { info, error });
    const output = await notifier.notifyMany(
      ['test@gmail.com', 'xyz@gmail.com'],
      'hello world',
    );
    expect(output).toEqual({ sent: 1, failed: 1 });
    expect(error).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      'test@gmail.com',
      'Notification',
      'hello world',
    );
    expect(info).toHaveBeenCalledTimes(1);
  });
});
