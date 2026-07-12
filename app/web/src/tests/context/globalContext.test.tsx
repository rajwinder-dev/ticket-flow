// 1. Make sure to import your Context Provider component to wrap the hook!
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalProvider, useGlobalContext } from "../../context/GlobalContext.tsx";
describe("GlobalContext", () => {
  // A helper to wrap our hook in its required Context tree
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GlobalProvider>{children}</GlobalProvider>
  );

  it("Should toggle theme", () => {
    // 2. Wrap the hook using renderHook and passing our provider wrapper
    const { result } = renderHook(() => useGlobalContext(), { wrapper });

    // Initial check: hooks values live inside .current
    expect(result.current.theme).toBe("light");

    // 3. Changing state requires wrapping the action in act()
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("light");
  });

  it("Should set orgId", () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });

    // Verify initial value if it starts as null/empty string
    expect(result.current.orgId).not.toBe("hello");

    act(() => {
      result.current.setOrgId("hello");
    });
    
    expect(result.current.orgId).toBe("hello");
  });
});
