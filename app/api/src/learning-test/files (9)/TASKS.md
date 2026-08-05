# Vitest Mocking — Muscle Memory Practice

Rule for all of these: **write the test, run it, read the error, fix it
yourself.** Only check the hint if you're stuck for 10+ minutes. Don't
ask AI to write the test — bring what you wrote back for a review instead.

Create each test file next to its source file, e.g.
`1-pure/pricing.spec.ts`, `2-injected/notifier.service.spec.ts`, etc.

---

## Level 1 — `1-pure/pricing.ts`
**No `vi.mock()` should appear anywhere in this test file.**

- [ ] Test `calculateDiscount` at 0%, 50%, 100%, and confirm it throws for 101% and -1%.
- [ ] Test `formatCurrency` for both `'USD'` and the default parameter case.
- [ ] Test `chunkArray` with a size that divides evenly, one that doesn't, and `size <= 0` throwing.
- [ ] Test `slugify` with mixed case, punctuation, and multiple spaces.

**Checkpoint:** if you found yourself wanting to mock anything, stop and
ask why — pure functions never need it.

---

## Level 2 — `2-injected/notifier.service.ts`
**No `vi.mock()` here either — build plain objects as fakes.**

- [ ] Construct `NotifierService` with `{ send: vi.fn() }` and a fake logger, and test the success path.
- [ ] Test the failure path using `.mockRejectedValue(new Error(...))` — assert `logger.error` was called, and that `notifyUser` returns `false` instead of throwing.
- [ ] Test `notifyMany` with a mix of resolved and rejected mailer calls; assert the `{ sent, failed }` counts are correct.
- [ ] Assert `mailer.send` was called with the exact arguments you expect (`toHaveBeenCalledWith`).

**Checkpoint:** you should be comfortable with `.mockResolvedValue`,
`.mockRejectedValue`, and reading `.mock.calls` before moving on.

---

## Level 3 — `3-timers/trial.service.ts`
This introduces a *different* mocking API — timers, not modules.

- [ ] Test `isTrialExpired` / `daysRemaining` by just passing different `now` values as arguments — no fake timers needed here.
- [ ] Now test `TrialScheduler.scheduleExpiryWarning` using `vi.useFakeTimers()` and `vi.setSystemTime(...)`, then `vi.advanceTimersByTime(...)` to jump forward and confirm the callback fires at the right moment (and doesn't fire early).
- [ ] Confirm `clearAll()` prevents the callback from firing even after advancing time.
- [ ] Remember to call `vi.useRealTimers()` in `afterEach` — predict what breaks in later tests if you forget.

**Checkpoint:** notice how `isTrialExpired` was easy because time was
injectable, and `scheduleExpiryWarning` was harder because it wasn't.
That contrast is the whole lesson of this level.

---

## Level 4 — `4-constructor-wrap/payment.service.ts`
First real `vi.mock()` of a class. Mock `./payment-sdk.js`.

- [ ] Mock `PaymentSdk` as a real `class` whose methods are `vi.fn()`s, and get `charge()`'s success path working.
- [ ] Test `charge()`'s failure path (SDK returns `status: 'failed'`).
- [ ] Test `charge()` throws for `amountCents <= 0` — and confirm the SDK's `createCharge` was *never* called in that case.
- [ ] Test `refund()` similarly.

**Checkpoint:** you should NOT have needed `vi.hoisted()` here — the SDK
is only constructed inside the method, at call time, not at import time.
If you reached for `vi.hoisted()` anyway, that's fine, but notice it
wasn't required — good instinct to build for Level 5.

---

## Level 5 — `5-singleton-module/search.service.ts`
The hard one. Before writing any code, answer these two questions on paper:

1. When does `new SearchServiceClass(...)` actually run, relative to your test file's own top-level code?
2. If your mock factory for `SearchSdk` references an outside `vi.fn()`, what has to be true about *when* that `vi.fn()` was created?

Then:
- [ ] Mock `./search-sdk.js`'s `SearchSdk` export as a real `class`, using `vi.hoisted()` for any shared mock functions.
- [ ] Test `search()`'s empty-string short-circuit — assert the SDK's `query` was never called.
- [ ] Test `search()` sorts hits by `score` descending.
- [ ] Test `rebuildIndex()` for both `'ok'` and `'error'` statuses.
- [ ] Delete your `vi.hoisted()` wrapper on purpose and confirm you get the exact "Cannot access before initialization" error from before. Put it back.
- [ ] Mock `SearchSdk` as `vi.fn().mockImplementation(...)` instead of a `class` on purpose and see if it breaks — reason about why it does or doesn't.

**Checkpoint:** if you can explain, without looking anything up, why
`vi.hoisted()` is needed here but wasn't in Level 4, you've internalized
the actual mental model — not just a working snippet.

---

## After finishing all 5

Go find one file in your **real** codebase that mixes 2+ of these
patterns (e.g. a singleton service with an injected logger) and write
its test from scratch, cold. That's the real test of whether this
transferred.
