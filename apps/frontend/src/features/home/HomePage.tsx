import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Shared inbox",
    description:
      "Keep all support conversations in one place so no ticket gets lost.",
  },
  {
    title: "Smart assignment",
    description:
      "Route tickets to the right queue and owner for faster resolution.",
  },
  {
    title: "Team visibility",
    description:
      "Track open, pending, and resolved issues with a clean dashboard.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-full bg-muted/30">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="mb-2 w-fit">
              TicketFlow MVP
            </Badge>
            <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">
              A simple ticket management SaaS for growing support teams
            </CardTitle>
            <CardDescription className="max-w-2xl text-base md:text-lg">
              Organize customer requests, assign ownership, and keep response
              times under control with a lightweight, team-first workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/org">Go to Organizations</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/org/new">Create Organization</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="gap-2">
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
