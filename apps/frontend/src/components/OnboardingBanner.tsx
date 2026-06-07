import {
  ShieldCheck,
  UserPlus,
  Users,
  UserCog,
  Mail,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import useOrganizations from "@/features/organization/hooks";

const ONBOARDING_STEPS = [
  {
    title: "Setup Role & Permissions",
    description: "Define permissions and access levels for your team.",
    path: "rbac",
    icon: ShieldCheck,
    flag: "hasRoles",
  },
  {
    title: "Setup Group & Queues",
    description: "Organize your team into functional groups (e.g., Support, Sales) and queues.",
    path: "queue",
    icon: Users,
    flag: "hasGroups",
  },
  {
    title: "Invite Member",
    description: "Add your first teammates to the organization.",
    path: "member",
    icon: UserPlus,
    flag: "hasInvites",
  },
  {
    title: "Assign Queue",
    description: "Route specific queues to the right team members.",
    path: "member",
    icon: UserCog,
    flag: "hasQueues",
  },
  {
    title: "Email Provider",
    description: "Connect your support email to start receiving tickets automatically.",
    path: "setting/email",
    icon: Mail,
    flag: "hasEmail",
  },
] as const;

export default function OnboardingBanner() {
  const navigate = useNavigate();
  const { onboardSatus } = useOrganizations();

  const onboardingData = onboardSatus?.data;

  if (!onboardingData) return null;

  const currentStepIndex = ONBOARDING_STEPS.findIndex((step) => !onboardingData[step.flag]);

  if (currentStepIndex === -1) return null;

  const completedCount = ONBOARDING_STEPS.filter((step) => onboardingData[step.flag]).length;

  const step = ONBOARDING_STEPS[currentStepIndex];
  const progress = (completedCount / ONBOARDING_STEPS.length) * 100;
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;

  const handleAction = () => {
    navigate(step.path);
  };

  return (
    <Card className="relative m-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col items-stretch md:flex-row">
          {/* Left Side: Info */}
          <div className="flex flex-1 items-start gap-4 p-6">
            <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm">
              <step.icon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-bold tracking-wider uppercase">
                  Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
                </span>
                {completedCount > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> {completedCount} Completed
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold tracking-tight">{step.title}</h2>
              <p className="text-muted-foreground max-w-md text-sm">{step.description}</p>
            </div>
          </div>

          {/* Right Side: Action & Progress */}
          <div className="bg-muted/30 border-border flex min-w-[240px] flex-col items-center justify-center gap-4 border-t p-6 md:items-end md:border-t-0 md:border-l">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Setup Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>

            <Button
              size="lg"
              onClick={handleAction}
              className="w-full font-semibold shadow-md transition-all hover:shadow-lg md:w-auto"
            >
              {isLastStep ? "Finalize Setup" : "Go to Setup"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
