import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
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
import {
  TicketPriority,
  updateTicketInput,
  type UpdateTicketInput,
} from '@org/zod';
import { useTicket } from '@org/core';
import { ticketCategory, ticketPriority } from '@org/constants';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface props {
  ticket: {
    id: string;
    code: string;
    subject: string;
    description?: string;
    priority: TicketPriority;
    category: string;
  };
  open: boolean;
  setOpen: (value: boolean) => void;
}
const TicketEditDialog = ({ ticket, open, setOpen }: props) => {
  const { orgId } = useParams();
  const { updateTicket, isUpdatingTicket } = useTicket({ orgId });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateTicketInput>({
    resolver: zodResolver(updateTicketInput.bodySchema),
    defaultValues: {
      subject: ticket.subject,
      description: ticket.description || '',
      priority: ticket.priority,
      category: ticket.category,
    },
  });

  const onSubmit = (data: UpdateTicketInput) => {
    updateTicket(
      { id: ticket.id, data },
      {
        onSuccess: () => {
          toast.success('ticket updated successfully');
          setOpen(false);
          reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ticket</DialogTitle>
          <DialogDescription>Updating ticket: {ticket.code}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="Ticket title"
            />
            {errors.subject && (
              <p className="text-destructive text-sm">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detailed description of the issue..."
              rows={4}
            />
            {errors.description && (
              <p className="text-destructive text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
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
                      {ticketPriority.map((item) => (
                        <SelectItem value={item} className="capitalize">
                          {item.toLocaleLowerCase().split('_').join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-destructive text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
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
              {errors.category && (
                <p className="text-destructive text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isUpdatingTicket}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketEditDialog;
