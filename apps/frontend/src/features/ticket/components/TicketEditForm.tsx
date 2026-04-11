import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  updateTicketInput,
  type TicketSchemaResponse,
  type UpdateTicketInput,
} from "@repo/schemas";
import { useTicket } from "../hooks";
import { Button } from "@/components/ui/button";

interface Props {
  ticket: TicketSchemaResponse;
}

const TicketEditForm = ({ ticket }: Props) => {
  const {updateTicket ,isUpdatingTicket} = useTicket();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateTicketInput>({
    resolver: zodResolver(updateTicketInput.bodySchema),
    defaultValues: {
      subject: ticket.subject,
      description: ticket.description || "",
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
    },
  });

  const onSubmit = (data: UpdateTicketInput) => {
    
    updateTicket({id: ticket.id, data})
  };

  return (
    <form id="ticket-edit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Subject Field */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...register("subject")} placeholder="Ticket title" />
        {errors.subject && <p className="text-destructive text-sm">{errors.subject.message}</p>}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Detailed description of the issue..."
          rows={4}
        />
        {errors.description && (
          <p className="text-destructive text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Status Controller */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="REOPENED">Reopened</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
        </div>

        {/* Priority Controller */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && <p className="text-destructive text-sm">{errors.priority.message}</p>}
        </div>

        {/* Category/Type Controller */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="docs">Docs</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
        </div>
      </div>

      {/* Hidden button for programmatic trigger if needed */}
      <Button type="submit" className="hidden" disabled={isUpdatingTicket} />
    </form>
  );
};

export default TicketEditForm;
