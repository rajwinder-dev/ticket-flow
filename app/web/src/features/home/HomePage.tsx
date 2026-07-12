import {
  Mail,
  Terminal,
  ExternalLink,
  Users,
  Scale,
  Lock,
  Building2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";
import { ProjectLogo } from "./ProjectLogo";
import { authClient } from "@/lib/auth-client";
import { UserProfile } from "@/components/UserProfile";

const DeveloperLandingPage = () => {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased">
      {/* --- Navigation --- */}
      <nav className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <ProjectLogo />
          {/* <div className="text-muted-foreground hidden items-center gap-8 text-sm font-medium md:flex"> */}
          {/*   <a href="#logic" className="hover:text-primary transition-colors"> */}
          {/*     How it Works */}
          {/*   </a> */}
          {/*   <a href="#oss" className="hover:text-primary transition-colors"> */}
          {/*     Open Source */}
          {/*   </a> */}
          {/* </div> */}

          <div className="flex items-center gap-3">
            <a href="https://github.com/rajwinder-dev/ticket-flow" target="_blank">
              <Button variant="ghost" size="sm" className="hidden gap-2 sm:flex">
                <HugeiconsIcon icon={Github} size={20} />
                <span>GitHub</span>
              </Button>
            </a>

            {/* Main CTA in Header as/   requested */}
            {session ? (
              <UserProfile />
            ) : (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground shadow-primary/10 px-5 shadow-lg hover:opacity-90"
                onClick={() => navigate("/org")}
              >
                Get Started <ExternalLink size={14} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </nav>
      {/* --- Hero Section --- */}
      <section className="container mx-auto flex flex-col items-center px-6 py-20 text-center lg:py-32">
        <Badge
          variant="outline"
          className="border-primary/20 text-primary bg-primary/5 mb-6 px-4 py-1"
        >
          v1.0-beta • Live & Open Source
        </Badge>
        <h1 className="font-heading mb-8 max-w-4xl text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl">
          The ticket engine for teams that{" "}
          <span className="text-primary italic">actually build.</span>
        </h1>
        <p className="text-muted-foreground mb-10 max-w-[600px] text-lg leading-relaxed md:text-xl">
          Stop managing support in Slack or spreadsheets. A lightweight, self-hostable system with
          automated load-balancing and email integration. Built for startups, not bureaucracies.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/org")}
            className="shadow-primary/20 h-14 rounded-xl px-10 text-lg font-bold shadow-2xl transition-all hover:-translate-y-1"
          >
            Start Managing Now
          </Button>
          <a href="https://github.com/rajwinder-dev/ticket-flow" target="_blank">
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted/50 h-14 rounded-xl px-10 text-lg"
            >
              View Docs
            </Button>
          </a>
        </div>
      </section>
      {/* --- Developer Product Thinking --- */}
      <section id="logic" className="border-border container mx-auto border-t px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-heading mb-6 text-3xl font-bold italic md:text-4xl">
              "I built this because support is a{" "}
              <span className="text-primary not-italic">distraction.</span>"
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold">Automated Triage</h4>
                  <p className="text-muted-foreground text-sm">
                    Our load-balancing strategy assigns tickets based on agent bandwidth, ensuring
                    you don't get buried in pings while shipping code.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold">Developer-First RBAC</h4>
                  <p className="text-muted-foreground text-sm">
                    Strict role-based access control. Separate internal dev tasks from
                    customer-facing bugs effortlessly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold">Organization Context</h4>
                  <p className="text-muted-foreground text-sm">
                    Don't just see a ticket; see the organization. Know which startup or client is
                    reaching out with basic customer profiling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Component Mockup */}
          <div className="group relative">
            <div className="from-primary/30 absolute -inset-1 rounded-2xl bg-gradient-to-r to-transparent opacity-50 blur transition duration-1000 group-hover:opacity-100"></div>
            <Card className="bg-card border-border relative overflow-hidden shadow-2xl">
              <div className="bg-muted/50 border-border flex items-center gap-2 border-b px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="bg-destructive/30 h-3 w-3 rounded-full"></div>
                  <div className="bg-primary/30 h-3 w-3 rounded-full"></div>
                  <div className="bg-primary/10 h-3 w-3 rounded-full"></div>
                </div>
                <div className="text-muted-foreground ml-2 font-mono text-[10px]">
                  flowstate-dashboard --active
                </div>
              </div>
              <CardContent className="space-y-4 p-6">
                <div className="bg-background border-border flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-primary" />
                    <div>
                      <p className="text-xs font-bold">Inbound Email: API 500 Error</p>
                      <p className="text-muted-foreground text-[10px]">From: dev_team@startup.io</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none text-[10px]">
                    Auto-Assigned
                  </Badge>
                </div>
                <div className="bg-muted/20 border-border rounded-lg border border-dashed p-4 font-mono text-[12px] leading-relaxed">
                  <span className="text-primary font-bold">Strategy:</span> Load-Balance-Round-Robin
                  <br />
                  <span className="text-primary font-bold">Target Group:</span> Engineering-Lead
                  <br />
                  <span className="text-primary font-bold">Status:</span> Resolved in 12m
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Core Features</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature: Load Balancing */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Scale size={24} />
              </div>
              <CardTitle className="font-heading text-xl">Load-Balanced Assignment</CardTitle>
              <CardDescription>
                Smart algorithms distribute tickets equally based on tickets load per agent
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature: Email Integration */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Mail size={24} />
              </div>
              <CardTitle className="font-heading text-xl">Email-to-Ticket</CardTitle>
              <CardDescription>
                Seamlessly convert incoming emails into structured tickets
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature: RBAC */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Lock size={24} />
              </div>
              <CardTitle className="font-heading text-xl"> RBAC System</CardTitle>
              <CardDescription>
                Define precise permissions for
                customr roles.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature: Organizations */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Building2 size={24} />
              </div>
              <CardTitle className="font-heading text-xl">B2B Organizations</CardTitle>
              <CardDescription>Group users by organization</CardDescription>
            </CardHeader>
          </Card>

          {/* Feature: Queues & Groups */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Inbox size={24} />
              </div>
              <CardTitle className="font-heading text-xl">Dynamic Queues</CardTitle>
              <CardDescription>Categorize work with custom groups and queues.</CardDescription>
            </CardHeader>
          </Card>

          {/* Feature: Profiles */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Users size={24} />
              </div>
              <CardTitle className="font-heading text-xl">Customer 360°</CardTitle>
              <CardDescription>Basic profiles with interaction history,</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>{" "}
      {/* --- Open Source Section --- */}
      <section id="oss" className="bg-muted/30 border-border border-y py-24">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <Terminal size={48} className="text-primary mx-auto mb-6" />
          <h2 className="font-heading mb-6 text-3xl font-bold md:text-4xl">Open Source at Core</h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            I built this for the community. Whether you're a solo dev managing personal projects or
            a small team growing fast, TicketFlow is designed to be forked, tweaked, and extended.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/rajwinder-dev/ticket-flow">
              <Button variant="secondary" className="border-primary/20 font-bold">
                Contribute on GitHub
              </Button>
            </a>
            {/* <Button variant="outline" className="border-border font-bold"> */}
            {/*   Read Build Process */}
            {/* </Button> */}
          </div>
        </div>
      </section>
      {/* --- Bottom CTA --- */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="bg-primary text-primary-foreground shadow-3xl shadow-primary/30 rounded-[2.5rem] px-6 py-16">
          <h2 className="font-heading mb-6 text-4xl font-bold italic md:text-5xl">
            Ready to clear the queue?
          </h2>
          <p className="text-primary-foreground/80 mx-auto mb-10 max-w-xl text-lg">
            Join the solo devs and small teams moving faster with TicketFlow. Free to use, easy to
            deploy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-foreground h-14 px-10 text-lg font-bold"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>
      {/* --- Simple Footer --- */}
      <footer className="border-border container mx-auto flex flex-col items-center justify-between gap-6 border-t px-6 py-12 md:flex-row">
        <div className="text-muted-foreground text-sm font-medium">
          © {new Date().getFullYear()} TicketFlow • Built by a developer for developers.
        </div>
        <div className="text-muted-foreground flex gap-8 text-sm font-semibold">
          <a
            href="https://github.com/rajwinder-dev/ticket-flow"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rajwinder-web"
            className="hover:text-primary transition-colors"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default DeveloperLandingPage;
