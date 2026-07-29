import { QueryKey, useQueryClient } from '@tanstack/react-query';

const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  /**
   * Optimistic update with custom updater
   * Example: add comment to paginated list
   */
  async function updateCache<T>({
    queryKey,
    updater,
  }: {
    queryKey: QueryKey;
    updater: (oldData: T | undefined) => T;
  }) {
    warnUndefinedQueryKey(queryKey)
    await queryClient.cancelQueries({
      queryKey,
    });

    const previousData = queryClient.getQueryData<T>(queryKey);
    queryClient.setQueryData<T>(queryKey, (old) => updater(old));

    return { previousData };
  }

  /**
   * Rollback helper
   */
  function rollback<T>({
    queryKey,
    previousData,
  }: {
    queryKey: QueryKey;
    previousData: T | undefined;
  }) {
    warnUndefinedQueryKey(queryKey)
    queryClient.setQueryData<T>(queryKey, previousData);
  }

  return {
    updateCache,
    rollback,
  };
};

export default useOptimisticUpdates;




function warnUndefinedQueryKey(queryKey: QueryKey): boolean {
  const undefinedValues: string[] = [];

  function scan(value: unknown, path: string): void {
    if (value === undefined) {
      undefinedValues.push(path);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        scan(item, `${path}[${index}]`);
      });
      return;
    }

    if (value !== null && typeof value === "object") {
      Object.entries(value).forEach(([key, val]) => {
        scan(val, `${path}.${key}`);
      });
    }
  }

  scan(queryKey, "queryKey");

  if (undefinedValues.length > 0) {
    console.warn(
      "⚠️ React Query key contains undefined values:",
      undefinedValues,
      "\nQueryKey:",
      queryKey
    );

    return false;
  }

  return true;
}

