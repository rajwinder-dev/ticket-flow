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
import { Link } from "react-router-dom";
// Mock data based on the image
const MOCK_ORGS = [
  { id: "1", name: "rajwindersxxx's projects", plan: "Free Plan", projects: 2 },
  { id: "2", name: "tiven.xyz", plan: "Free Plan", projects: 2 },
];

const OrganizationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrgs = MOCK_ORGS.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    // Wrap the page in 'dark' to get the dark theme
    <div className="mt-20">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrgs.length > 0 &&
            filteredOrgs.map((org) => (
              <Link to={`/dashboard/org/${org.id}`}>
                <Card key={org.id} className="p-4 cursor-pointer">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-foreground text-xl font-medium">{org.name}</h3>
                    <p className="text-muted-foreground text-sm">
                       22 members
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
        </div>
        {filteredOrgs.length <= 0 && (
          <Card>
            <Empty className="w-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">{/* <IconFolderCode /> */}</EmptyMedia>
                <EmptyTitle>No Organization Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any projects yet. Get started by creating your first
                  project.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <Button>Create Organization</Button>
              </EmptyContent>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizationPage;
