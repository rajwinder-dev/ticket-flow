import PageHeader from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import QueryBoundary from "@/components/QueryError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import useActivity from "../hooks";
import ActivityMatrices from "./ActivityMatrices";
import { ActivityRow } from "./ActivityRow";

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
      ></PageHeader>

      {/* Stats strip */}
      <ActivityMatrices />

      {/* Table card */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base">Events</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 w-4" />
            <Input
              placeholder="Search events…"
              className="h-9 w-56 pl-8 text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
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
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground py-16 text-center">
                    Loading…
                  </TableCell>
                </TableRow>
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
      {activity && (
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
