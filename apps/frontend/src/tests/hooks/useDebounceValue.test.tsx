import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounceValue } from "@/hooks/useDebounce";

describe("useDebounceValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounceValue("hello", 300));

    expect(result.current).toBe("hello");
  });

  it("should debounce value updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounceValue(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    rerender({ value: "changed", delay: 300 });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    // Fast-forward the final 1ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("changed");
  });

  it("should use the default delay of 300ms if none is provided", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounceValue(value),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "changed" });

    // Move 299ms -> still initial
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    // Move 1ms -> updates to changed
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("changed");
  });

  it("should handle rapid consecutive value changes (only latest value updates)", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounceValue(value, 300),
      { initialProps: { value: "start" } }
    );

    // Simulate keystrokes/rapid changes
    rerender({ value: "a" });
    act(() => { vi.advanceTimersByTime(100); });
    
    rerender({ value: "ab" });
    act(() => { vi.advanceTimersByTime(100); });
    
    rerender({ value: "abc" }); // Latest change at total elapsed time 200ms

    // Fast forward another 200ms (Total 400ms from start, but only 200ms from "abc")
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current).toBe("start"); // Still "start" because "abc" timer needs 300ms total

    // Fast forward the remaining 100ms for "abc"
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe("abc");
  });

  it("should clean up the timeout on unmount", () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounceValue(value, 300),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "changed" });
    
    // Unmount the component wrapping the hook
    unmount();

    // Verify no pending timers throw errors or execute unexpectedly
    expect(() => vi.runAllTimers()).not.toThrow();
  });
});
