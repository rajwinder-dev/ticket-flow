import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTicket } from '@org/core';
import { CreateTicketCommentInput } from '@org/zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
interface Props {
  ticketId: string;
}
const TicketCommentForm = ({ ticketId }: Props) => {
  const { data } = authClient.useSession();
  const { orgId } = useParams();
  const { commentTicket, isCreateingComment } = useTicket({
    orgId,
    ticketId,
    user: { name: data?.user.name, email: data?.user.email },
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateTicketCommentInput>({});
  const hasComment = watch('comment');
  const onSubmit = (data: CreateTicketCommentInput) => {
    const input = { ...data, id: crypto.randomUUID() };
    commentTicket(
      { ticketId, data: input },
      {
        onSuccess: () => {
          toast.success('comment added successfully');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        rows={3}
        className="resize-none"
        {...register('comment', {
          required: true,
          validate: (value) => value.trim().length > 0,
        })}
      />
      {errors.comment && (
        <p className="text-destructive text-xs">Comment cannot be empty.</p>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={isCreateingComment || !hasComment?.trim().length}
        >
          Add Comment
        </Button>
      </div>
    </form>
  );
};

export default TicketCommentForm;
