import { Skeleton } from '@/components/ui/skeleton'; // Import shadcn skeleton
import { useActivity } from '@org/core';
import { useParams } from 'react-router';
const ActivityMatrices = () => {
  const { orgId } = useParams();
  const { activitySummary, isLoadingActivitySummary } = useActivity({ orgId });

  const metrics = [
    { label: 'Total Events', value: activitySummary?.data.total },
    { label: 'INFO', value: activitySummary?.data.info },
    { label: 'WARN', value: activitySummary?.data.warn },
    { label: 'ERROR', value: activitySummary?.data.error },
  ];

  return (
    <div className="grid grid-cols-2 divide-x divide-y border-b sm:grid-cols-4 sm:divide-y-0">
      {metrics.map(({ label, value }) => (
        <div key={label} className="p-2">
          <div className="flex flex-col gap-1 px-4 py-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            {isLoadingActivitySummary ? (
              <Skeleton className="h-7 w-12 rounded" /> // Standard tabular numeric placeholder
            ) : (
              <p className="text-2xl font-bold tabular-nums">{value ?? 0}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityMatrices;
