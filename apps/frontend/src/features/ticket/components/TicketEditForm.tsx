import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const TicketEditForm = () => {
  return (
    <div className="space-y-4">
      <Input placeholder="Ticket title" />
      <Textarea placeholder="Ticket description" rows={4} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in progress">In progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="docs">Docs</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TicketEditForm;
