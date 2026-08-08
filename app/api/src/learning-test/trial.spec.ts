import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  daysRemaining,
  isTrialExpired,
  TRIAL_LENGTH_MS,
  TrialScheduler,
  WARNING_BEFORE_EXPIRY_MS,
} from './trial.service';

describe('trial', () => {
  it('should test trial Expired', () => {
    const trialStartedAt = new Date();
    const now = new Date();
    const isExpired = isTrialExpired(trialStartedAt, now);
    expect(isExpired).toBe(false);
  });
  it('should test days remaining', () => {
    const trialStartedAt = new Date();
    const now = new Date();
    const days = daysRemaining(trialStartedAt, now);
    expect(days).toBe(14);
  });
});
describe('trial scheduler', () => {
  const now = new Date('2026-01-01T00:00:00Z');
  let callback: any;
  let scheduler: TrialScheduler;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    callback = vi.fn();
    scheduler = new TrialScheduler();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('should schedule expiry warning', () => {
    scheduler.scheduleExpiryWarning(now, callback);
    vi.advanceTimersByTime(12 * 24 * 60 * 60 * 1000);
    expect(callback).toHaveBeenCalled();
  });
  it('should clear all timers even after advanceing time ', () => {
    scheduler.scheduleExpiryWarning(now, callback);
    scheduler.clearAll();
    vi.advanceTimersByTime(12 * 24 * 60 * 60 * 1000);
    expect(callback).not.toHaveBeenCalled();
  });
});
