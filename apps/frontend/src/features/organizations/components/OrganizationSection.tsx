import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Spinner } from "@/components/ui/spinner";
import OrganizationList from "@/features/organizations/components/OrganizationList";
import useOrganizations from "@/features/organizations/hooks";

const OrganizationSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { organizations, isLoadingOrganizations } = useOrganizations();

  if (isLoadingOrganizations) return <Spinner />;
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Your Organizations
        </h1>
      </header>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex flex-1 items-center gap-2 sm:max-w-xs">
          <Search />
          <Input
            placeholder="Search for an organization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus />
          New organization
        </Button>
      </div>

      {/* Organization Card Grid */}
      {organizations && organizations.data.length > 0 ? (
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
              <Button>Create Organization</Button>
            </EmptyContent>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default OrganizationSection;
