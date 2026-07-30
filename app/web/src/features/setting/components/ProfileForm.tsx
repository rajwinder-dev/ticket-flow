import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dirtyValues } from '@/lib/utils';
import { useUser } from '@org/core';
import type { UpdateMyDetailsInput } from '@org/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// 1. Define the schema for editable fields only

const ProfileForm = () => {
  const { userDetails, updateMyDetails, isUpdating } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateMyDetailsInput>();
  useEffect(() => {
    if (userDetails)
      reset({
        phoneNo: userDetails?.data.phoneNo || '',
        location: userDetails?.data.location || '',
        avatar: userDetails?.data.avatar || '',
      });
  }, [userDetails, reset]);
  const onSubmit = async (data: UpdateMyDetailsInput) => {
    const output = dirtyValues(dirtyFields, data);
    updateMyDetails(output, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information. Only changed fields will be saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input id="phoneNo" {...register('phoneNo')} />
              {errors.phoneNo && (
                <p className="text-xs text-red-500">{errors.phoneNo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="City, Country"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                {...register('avatar')}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-end text-[10px] italic">
            Modified fields: {Object.keys(dirtyFields).join(', ') || 'None'}
          </p>
          <Button
            type="submit"
            disabled={Object.keys(dirtyFields).length === 0 || isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update profile'}
          </Button>
          {/* Debug info to see dirty fields in real-time */}
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProfileForm;
{
  /* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} placeholder="johndoe" />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div> */
}
