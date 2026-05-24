import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { Plus, Search } from "lucide-react";
import { useState } from "react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import OrganizationList from "@/features/organization/components/OrganizationList";
import useOrganizations from "@/features/organization/hooks";
import { Link } from "react-router-dom";

const OrganizationSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { organizations, isLoadingOrganizations } = useOrganizations();

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Select Organization
        </h1>
      </header>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex flex-1 items-center gap-2 sm:max-w-xs">
          <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
          <Input
            placeholder="Search for an organization"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoadingOrganizations}
          />
        </div>
        <Link to={"/org/new"} className="create-org">
          <Button disabled={isLoadingOrganizations}>
            <Plus className="mr-2 h-4 w-4" />
            New organization
          </Button>
        </Link>
      </div>

      {/* Organization Card Grid Area */}
      {isLoadingOrganizations ? (
        // Grid layout skeleton blocks matching organization card layout sizes
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />{" "}
                {/* Organization Avatar placeholder */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" /> {/* Primary Org Name line */}
                  <Skeleton className="h-3 w-1/3" /> {/* Org short dynamic metric */}
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <Skeleton className="h-3 w-full" /> {/* Profile metadata line 1 */}
                <Skeleton className="h-3 w-4/5" /> {/* Profile metadata line 2 */}
              </div>
            </Card>
          ))}
        </div>
      ) : organizations && organizations.data.length > 0 ? (
        <OrganizationList organizations={organizations?.data} />
      ) : (
        <Card>
          <Empty className="w-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">{/* <IconFolderCode /> */}</EmptyMedia>
              <EmptyTitle>No Organization Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any Organization yet. Get started by creating your first
                Organization.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              <Link to={"org/new"}>
                <Button asChild>Create Organization</Button>
              </Link>
            </EmptyContent>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default OrganizationSection;
