import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  updateCustomerInput,
  type CustomerSchemaResponse,
  type UpdateCustomerInput,
} from '@org/zod';
import { useCustomer } from '@org/core';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface props {
  customer: CustomerSchemaResponse;
  onEdit: (x: boolean) => void;
}

const EditCustomerForm = ({ onEdit, customer }: props) => {
  const { orgId } = useParams();
  const { updateCustomer, isUpdatingCustomer } = useCustomer({ orgId });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateCustomerInput.bodySchema),
    values: {
      name: customer?.name || '',
      phone: customer.phone,
      avatarUrl: customer.avatarUrl,
    },
  });

  const onSubmit = (data: UpdateCustomerInput) => {
    updateCustomer(
      { id: customer.id, data },
      {
        onSuccess: () => {
          toast.success('customer updated successfully');
          onEdit(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 opacity-60">
        <Label>Email Address (Cannot be changed)</Label>
        <Input value={customer.email} disabled className="bg-muted" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input id="phone" {...register('phone')} />
        {errors.phone && (
          <p className="text-destructive text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* Avatar URL Field */}
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
        <Input
          id="avatarUrl"
          {...register('avatarUrl')}
          className={errors.avatarUrl ? 'border-destructive' : ''}
        />
        {errors.avatarUrl && (
          <p className="text-destructive text-xs">{errors.avatarUrl.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isUpdatingCustomer}>
        {isUpdatingCustomer ? 'Saving Changes...' : 'Update Profile'}
      </Button>
    </form>
  );
};

export default EditCustomerForm;
