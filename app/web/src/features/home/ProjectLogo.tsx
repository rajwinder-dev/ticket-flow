import { Zap } from "lucide-react";
import { useNavigate } from "react-router";

export const ProjectLogo = () => {
  const navigate = useNavigate();
  return (
    <div className="flex cursor-pointer items-center gap-2" onClick={() => navigate("/")}>
      <div className="bg-primary rounded-lg p-1.5">
        <Zap size={20} className="text-primary-foreground fill-current" />
      </div>
      <span className="font-heading text-xl font-bold tracking-tight">
        Ticket<span className="text-primary italic">Flow</span>
      </span>
    </div>
  );
};
