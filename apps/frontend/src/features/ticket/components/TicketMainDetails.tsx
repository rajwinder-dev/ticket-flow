import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTicket } from "../hooks";
import { formatDateTime } from "../utils";

const TicketMainDetails = () => {
  const { ticketDetails } = useTicket();
  return (
    <Card className="p-4 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">Description</CardTitle>
        <CardDescription>Primary ticket information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6">
          {ticketDetails?.data.description && (
            <div dangerouslySetInnerHTML={{ __html: ticketDetails?.data.description }} />
          )}
        </p>
        <Separator />
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Reported by</p>
            <p className="font-medium">{ticketDetails?.data.customer?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Assignee</p>
            <p className="font-medium">{ticketDetails?.data.assignedToUser?.username}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {ticketDetails?.data.createdAt && formatDateTime(ticketDetails?.data.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p className="font-medium">
              {ticketDetails?.data.createdAt && formatDateTime(ticketDetails?.data.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketMainDetails;
