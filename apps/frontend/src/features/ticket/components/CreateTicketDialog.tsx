import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldWrapper } from "@/components/ui/FieldWrapper";
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
import { useLookupHook } from "@/features/lookup/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTicketInput, type CreateTicketInput } from "@repo/schemas";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTicket } from "../hooks";
import { LoadingSelect } from "./LoadingSelect";

// ── field wrapper ─────────────────────────────────────────────────────────────

interface CreateTicketDialogProps {
  openForm: boolean;
  setOpenForm: (value: boolean) => void;
}

export const CreateTicketDialog = ({ openForm, setOpenForm }: CreateTicketDialogProps) => {
  const [autoAssign, setAutoAssign] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketInput.bodySchema),
    defaultValues: {
      subject: "",
      description: "",
      email: "",
      category: "",
      assignment: {},
    },
  });

  const groupId = useWatch({ control, name: "assignment.groupId" });
  const queueId = useWatch({ control, name: "assignment.queueId" });

  const { groupsData, isLoadingAgents, queueData, isLoadingQueues, agentsData, isLoadingGroups } =
    useLookupHook({ groupId, queueId });

  const { createdTicket, isCreatingTicket } = useTicket();

  const onValid = handleSubmit(async (values) => {
    console.log(values)
    createdTicket(values, {
      onSuccess: () => {
        reset();
        setOpenForm(false);
      },
    });
  });

  useEffect(() => {
    reset({ assignment: { agentId: undefined, queueId: undefined } });
  }, [groupId, reset]);

  useEffect(() => {
    reset({ assignment: { agentId: undefined } });
  }, [queueId, reset]);

  // Clear assignment fields when switching to auto-assign
  const handleAutoAssignToggle = (checked: boolean) => {
    setAutoAssign(checked);
    if (checked) {
      setValue("assignment", {});
    }
  };
 
  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create ticket</DialogTitle>
          <DialogDescription>Fill in the details to open a new ticket.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onValid} className="space-y-4">
          <FieldWrapper label="Subject" error={errors.subject?.message}>
            <Input placeholder="Short summary of the issue" {...register("subject")} />
          </FieldWrapper>

          <FieldWrapper label="Description" error={errors.description?.message}>
            <Textarea placeholder="Detailed description..." rows={4} {...register("description")} />
          </FieldWrapper>

          <FieldWrapper label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="reporter@example.com" {...register("email")} />
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Priority" error={errors.priority?.message}>
              <Select
                onValueChange={(val) =>
                  setValue("priority", val as CreateTicketInput["priority"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Category" error={errors.category?.message}>
              <Input placeholder="e.g. billing, infra" {...register("category")} />
            </FieldWrapper>
          </div>

          {/* ── Assignment section ─────────────────────────────────────── */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Assignment (optional)</p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="autoAssign"
                  checked={autoAssign}
                  onCheckedChange={(checked) => handleAutoAssignToggle(Boolean(checked))}
                />
                <Label htmlFor="autoAssign" className="cursor-pointer text-sm font-normal">
                  Auto assign
                </Label>
              </div>
            </div>

            {!autoAssign && (
              <>
                <FieldWrapper label="Group" error={errors.assignment?.groupId?.message}>
                  <LoadingSelect
                    isLoading={isLoadingGroups}
                    placeholder="Select group"
                    onValueChange={(val) =>
                      setValue("assignment.groupId", val, { shouldValidate: true })
                    }
                  >
                    {groupsData?.data.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </LoadingSelect>
                </FieldWrapper>

                <FieldWrapper label="Queue" error={errors.assignment?.queueId?.message}>
                  <LoadingSelect
                    isLoading={isLoadingQueues}
                    placeholder="Select queue"
                    onValueChange={(val) =>
                      setValue("assignment.queueId", val, { shouldValidate: true })
                    }
                  >
                    {queueData?.data.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.name}
                      </SelectItem>
                    ))}
                  </LoadingSelect>
                </FieldWrapper>

                <FieldWrapper label="Agent" error={errors.assignment?.agentId?.message}>
                  <LoadingSelect
                    isLoading={isLoadingAgents}
                    placeholder="Select agent"
                    onValueChange={(val) =>
                      setValue("assignment.agentId", val, { shouldValidate: true })
                    }
                  >
                    {agentsData?.data.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </LoadingSelect>
                </FieldWrapper>
              </>
            )}
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isCreatingTicket}>
              {isCreatingTicket ? "Creating..." : "Create ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
