"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLookupHook } from "@/features/lookup/hooks";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { escalationReasons, ticketPriority } from "@repo/constants";
import {
  escalateTicketInput,
  type EscalateTicketInput,
  type TicketSchemaResponse,
} from "@repo/schemas";
import { useQuery } from "@tanstack/react-query";
import { ChevronUp } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ticketApi } from "../api";
import { useTicket } from "../hooks";
import { QueueFlow } from "./QueueFlow";

interface TicketEscalateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ticket: TicketSchemaResponse | null;
  onSubmit?: (ticketId: string, values: TicketSchemaResponse) => void;
}
export function TicketEscalateDialog({ open, setOpen, ticket }: TicketEscalateDialogProps) {
  const { groupsData } = useLookupHook();
  const { data: escalateOptions } = useQuery({
    queryFn: () => ticketApi.escalateOptions(ticket!.id),
    queryKey: ["escalation-options", { ticketId: ticket?.id }],
    enabled: !!ticket?.id,
  });
  const { escalateTicket, isEscalatingTicket } = useTicket();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EscalateTicketInput>({
    resolver: zodResolver(escalateTicketInput.bodySchema),
    defaultValues: {
      comment: "",
      priority: ticket?.priority ?? "MEDIUM",
    },
  });

  const watchedPriority = useWatch({ control, name: "priority" });

  const handleFormSubmit = async (data: EscalateTicketInput) => {
    if (!ticket) return;
    escalateTicket(
      { ticketId: ticket.id, data },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <ChevronUp className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base">Escalate Ticket</DialogTitle>
              {ticket && (
                <p className="text-muted-foreground mt-0.5 text-xs font-normal">
                  #{ticket.code} · {ticket.subject}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-1">
          {/* Queue Flow */}
          {escalateOptions && (
            <QueueFlow
              from={escalateOptions.data.currentQueue?.name}
              to={escalateOptions.data.nextQueue?.name}
            />
          )}
          {!escalateOptions?.data.nextQueue && (
            <div className="space-y-1.5">
              <Label htmlFor="group" className="text-sm font-medium">
                Select Group <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="groupId"
                control={control}
                rules={{ required: "Please select a group" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="group"
                      className={cn(errors.groupId && "border-destructive")}
                    >
                      <SelectValue placeholder="Select next Group to escalate" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupsData?.data.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.groupId && (
                <p className="text-destructive text-xs">{errors.groupId.message}</p>
              )}
            </div>
          )}
          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-sm font-medium">
              Escalation Reason <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="reason"
              control={control}
              rules={{ required: "Please select a reason" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="reason" className={cn(errors.reason && "border-destructive")}>
                    <SelectValue placeholder="Why is this being escalated?" />
                  </SelectTrigger>
                  <SelectContent>
                    {escalationReasons.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reason && <p className="text-destructive text-xs">{errors.reason.message}</p>}
          </div>

          {/* Priority Change */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Priority
              {ticket && watchedPriority !== ticket.priority && (
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  Changed from <Badge>{ticket.priority}</Badge>
                </span>
              )}
            </Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="reason" className={cn(errors.reason && "border-destructive")}>
                    <SelectValue placeholder="Why is this being escalated?" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketPriority.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label htmlFor="comment" className="text-sm font-medium">
              Comment
            </Label>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="comment"
                  placeholder="Add context, steps taken, or instructions for the receiving team…"
                  className="min-h-[90px] resize-none text-sm"
                  {...field}
                />
              )}
            />
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEscalatingTicket} className="gap-1.5">
              <ChevronUp className="h-3.5 w-3.5" />
              Escalate Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
