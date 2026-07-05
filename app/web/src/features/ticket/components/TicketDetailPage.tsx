import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TicketComments from "./TicketComments";
import TicketDetailsHeader from "./TicketDetailsHeader";
import TicketMainDetails from "./TicketMainDetails";
import { TransitionHistory } from "./TransitionHistory";

// --- Static Mock Data ---


const TicketDetailPage = () => {
  // Pre-calculate timeline from static data
  return (
    <div className="">
      <TicketDetailsHeader />

      <div className="grid lg:grid-cols-3">
        <TicketMainDetails />
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Ticket labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[].map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2">
        <TicketComments />
        <TransitionHistory />
      </div>
    </div>
  );
};

export default TicketDetailPage;
