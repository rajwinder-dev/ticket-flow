import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldWrapper } from '@/components/ui/FieldWrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketCategory, ticketPriority } from '@org/constants';
import { createTicketInput, type CreateTicketInput } from '@org/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LoadingSelect } from './LoadingSelect';
import { useLookupHook, useTicket } from '@org/core';
import { useParams } from 'react-router';
import { toast } from 'sonner';

// ── field wrapper ─────────────────────────────────────────────────────────────

interface CreateTicketDialogProps {
  openForm: boolean;
  setOpenForm: (value: boolean) => void;
}

export const CreateTicketDialog = ({
  openForm,
  setOpenForm,
}: CreateTicketDialogProps) => {
  const { orgId } = useParams();
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
      subject: '',
      description: '',
      email: '',
      category: '',
      assignment: {},
    },
  });

  const groupId = useWatch({ control, name: 'assignment.groupId' });
  const queueId = useWatch({ control, name: 'assignment.queueId' });

  const {
    groupsData,
    isLoadingAgents,
    queueData,
    isLoadingQueues,
    agentsData,
    isLoadingGroups,
  } = useLookupHook({ groupId, queueId, orgId });

  const { createTicket, isCreatingTicket } = useTicket({ orgId });

  const onValid = handleSubmit(async (values) => {
    createTicket(values, {
      onSuccess: () => {
        reset();
        toast.success('ticket created successfully');
        setOpenForm(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  });

  useEffect(() => {
    // Clear dependent fields specifically
    setValue('assignment.queueId', undefined);
    setValue('assignment.agentId', undefined);
  }, [groupId, setValue]);

  useEffect(() => {
    setValue('assignment.agentId', undefined);
  }, [queueId, setValue]);

  // Clear assignment fields when switching to auto-assign
  const handleAutoAssignToggle = (checked: boolean) => {
    setAutoAssign(checked);
    if (checked) {
      setValue('assignment', {});
    }
  };

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      {<DevTool control={control} placement="top-left" />}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create ticket</DialogTitle>
          <DialogDescription>
            Fill in the details to open a new ticket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onValid} className="space-y-4">
          <FieldWrapper label="Subject" error={errors.subject?.message}>
            <Input
              placeholder="Short summary of the issue"
              {...register('subject')}
            />
          </FieldWrapper>

          <FieldWrapper label="Description" error={errors.description?.message}>
            <Textarea
              placeholder="Detailed description..."
              rows={4}
              {...register('description')}
            />
          </FieldWrapper>

          <FieldWrapper label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="reporter@example.com"
              {...register('email')}
            />
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Priority" error={errors.priority?.message}>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketPriority.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldWrapper>

            <FieldWrapper label="Category" error={errors.category?.message}>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketCategory.map((item) => (
                        <SelectItem value={item} className="capitalize">
                          {item.toLocaleLowerCase().split('_').join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldWrapper>
          </div>

          {/* ── Assignment section ─────────────────────────────────────── */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Assignment (optional)
              </p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="autoAssign"
                  checked={autoAssign}
                  onCheckedChange={(checked) =>
                    handleAutoAssignToggle(Boolean(checked))
                  }
                />
                <Label
                  htmlFor="autoAssign"
                  className="cursor-pointer text-sm font-normal"
                >
                  Auto assign
                </Label>
              </div>
            </div>

            {!autoAssign && (
              <>
                <FieldWrapper
                  label="Group"
                  error={errors.assignment?.groupId?.message}
                >
                  <Controller
                    control={control}
                    name="assignment.groupId"
                    render={({ field }) => (
                      <LoadingSelect
                        isLoading={isLoadingGroups}
                        placeholder="Select group"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {groupsData?.data.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </LoadingSelect>
                    )}
                  />
                </FieldWrapper>

                {groupId && (
                  <FieldWrapper
                    label="Queue (optional)"
                    error={errors.assignment?.queueId?.message}
                  >
                    <Controller
                      control={control}
                      name="assignment.queueId"
                      render={({ field }) => (
                        <LoadingSelect
                          isLoading={isLoadingQueues}
                          placeholder="Select queue"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          {queueData?.data.map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.name}
                            </SelectItem>
                          ))}
                        </LoadingSelect>
                      )}
                    />
                  </FieldWrapper>
                )}

                {queueId && (
                  <FieldWrapper
                    label="Agent (optional)"
                    error={errors.assignment?.agentId?.message}
                  >
                    <Controller
                      control={control}
                      name="assignment.agentId"
                      render={({ field }) => (
                        <LoadingSelect
                          isLoading={isLoadingAgents}
                          placeholder="Select agent"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          {agentsData?.data.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </LoadingSelect>
                      )}
                    />
                  </FieldWrapper>
                )}
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
              {isCreatingTicket ? 'Creating...' : 'Create ticket'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
