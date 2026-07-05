import PageHeader from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import QueryBoundary from "@/components/QueryError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounceValue } from "@/hooks/useDebounce";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import ActivityMatrices from "./ActivityMatrices";
import { ActivityRow } from "./ActivityRow";
import { useActivity } from "@org/core";

const ActivityPage = () => {
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
  });
  const [search, setSearch] = useState<string | undefined>();
  const searchItem = useDebounceValue(search);
  const { activity, isLoadingActivity, activityError } = useActivity({
    filterOptions: {
      ...pagination,
      search: {
        searchBy: "event",
        search: searchItem,
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Activity Log"
        description=" Audit trail of all actions performed within your organization."
      />

      {/* Stats strip */}
      <ActivityMatrices />

      {/* Table card header */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">Events</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search events…"
              className="h-9 w-56 pl-8 text-sm"
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoadingActivity} // Prevents interaction glitches during layout refreshes
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" disabled={isLoadingActivity}>
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <QueryBoundary error={activityError}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8" />
                <TableHead className="w-40">Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-24">Severity</TableHead>
                <TableHead className="w-32 text-right">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingActivity ? (
                // Renders proportional layout skeleton lines to mitigate frame layout shifts
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="w-8">
                      <Skeleton className="h-3.5 w-3.5 rounded" />{" "}
                      {/* Chevron expander placeholder */}
                    </TableCell>
                    <TableCell className="w-40">
                      <Skeleton className="h-4 w-32" /> {/* Timestamp field */}
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-44" /> {/* Event Name field */}
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-11/12" /> {/* Description message string */}
                    </TableCell>
                    <TableCell className="w-24">
                      <Skeleton className="h-5 w-16 rounded-full" /> {/* Severity Pill Badge */}
                    </TableCell>
                    <TableCell className="w-32">
                      <Skeleton className="ml-auto h-4 w-16" /> {/* Numeric/Hash ID token */}
                    </TableCell>
                  </TableRow>
                ))
              ) : activity?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground py-16 text-center">
                    No activity found.
                  </TableCell>
                </TableRow>
              ) : (
                activity?.data.map((log) => <ActivityRow key={log.id} log={log} />)
              )}
            </TableBody>
          </Table>
        </QueryBoundary>
      </ScrollArea>

      {activity && !isLoadingActivity && (
        <Pagination
          limit={activity?.limit}
          offset={activity?.offset}
          total={activity?.total}
          onChange={setPagination}
        />
      )}
    </>
  );
};

export default ActivityPage;
