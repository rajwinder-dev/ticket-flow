import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTicket } from "../hooks";

// --- Static Mock Da
const TicketDetailsHeader = () => {
  const { ticketDetails } = useTicket();
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between gap-3 border-b p-4">
      <div className="space-y-2">
        <p className="text-muted-foreground font-mono text-xs">{ticketDetails?.data.code}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{ticketDetails?.data.subject}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{ticketDetails?.data.status}</Badge>
          <Badge variant="secondary">{ticketDetails?.data.priority}</Badge>
          <Badge variant="outline">{ticketDetails?.data.category}</Badge>
        </div>
      </div>
      <Button variant="secondary" onClick={() => navigate(-1)}>
        <ArrowLeft />
        Back
      </Button>
    </div>
  );
};

export default TicketDetailsHeader;
