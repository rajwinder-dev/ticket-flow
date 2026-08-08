// Level 3 — FAKE TIMERS & Date, A DIFFERENT MOCKING API
// Goal: learn vi.useFakeTimers(), vi.setSystemTime(), vi.advanceTimersByTime(),
// and vi.useRealTimers(). This is NOT vi.mock() — it's a separate API for a
// separate problem (controlling time instead of controlling a dependency).
//
// Note isTrialExpired() takes `now` as an optional injected argument (an
// easy escape hatch you could use instead of faking time), but
// scheduleExpiryWarning() calls setTimeout()/Date.now() internally with no
// way to inject them — for THAT one you have no choice but to use fake
// timers. Practice both approaches and notice which one you reach for first.

export const TRIAL_LENGTH_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
export const WARNING_BEFORE_EXPIRY_MS = 2 * 24 * 60 * 60 * 1000; // 2 days before

export function isTrialExpired(trialStartedAt: Date, now: Date = new Date()): boolean {
  const elapsed = now.getTime() - trialStartedAt.getTime();
  return elapsed >= TRIAL_LENGTH_MS;
}

export function daysRemaining(trialStartedAt: Date, now: Date = new Date()): number {
  const elapsed = now.getTime() - trialStartedAt.getTime();
  const remainingMs = TRIAL_LENGTH_MS - elapsed;
  return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
}

export class TrialScheduler {
  private timers: ReturnType<typeof setTimeout>[] = [];

  scheduleExpiryWarning(trialStartedAt: Date, onWarning: () => void): void {
    const expiresAt = trialStartedAt.getTime() + TRIAL_LENGTH_MS;
    const warnAt = expiresAt - WARNING_BEFORE_EXPIRY_MS;
    const delay = Math.max(0, warnAt - Date.now());
    const timer = setTimeout(() => onWarning(), delay);
    this.timers.push(timer);
  }

  clearAll(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}
