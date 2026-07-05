import { useQueueGroupStore } from "@/features/queueGroups/store";
import { beforeEach, describe, expect, it } from "vitest";

describe("queureStore", () => {
  beforeEach(() => {
    useQueueGroupStore.setState({
      selectedId: null,
    });
  });
  it("it should set the storeId", () => {
    const store = useQueueGroupStore.getState();
    store.setGroupId("hello-test");
    expect(useQueueGroupStore.getState().selectedId).toBe("hello-test");
  });

  it("it should clear the storeId", () => {
    const store = useQueueGroupStore.getState();
    store.setGroupId("hello-test");
    store.reset();
    expect(useQueueGroupStore.getState().selectedId).toBe(null);
  });
});
