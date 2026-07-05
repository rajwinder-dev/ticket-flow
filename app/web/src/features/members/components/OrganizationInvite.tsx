"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRole from "@/features/role/hooks";
import { inviteUserOrganizationInput, type InviteUserOrganizationInput } from "@org/zod";
import useMember from "../hooks";

// Define the schema
interface props {
  onclose: () => void;
}
export function OrganizationInvite({ onclose }: props) {
  const { inviteUserMutate, isInvitingUser } = useMember();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteUserOrganizationInput>({
    resolver: zodResolver(inviteUserOrganizationInput.bodySchema),
    defaultValues: {
      email: "",
      roleId: "",
    },
  });
  const { roles } = useRole();
  const onSubmit = async (data: InviteUserOrganizationInput) => {
    inviteUserMutate(data, {
      onSuccess: () => {
        reset();
        onclose();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      {/* Role Selector Field */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="role"
                className={errors.roleId ? "border-destructive w-full" : "w-full"}
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles?.data.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.roleId && <p className="text-destructive text-xs">{errors.roleId.message}</p>}
      </div>
      <div className="flex gap-4">
        <Button type="button" variant={"secondary"} className="flex-1" onClick={onclose}>
          Cancel
        </Button>

        <Button type="submit" disabled={isInvitingUser} className="flex-1">
          {isInvitingUser ? "Sending Invite..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
}
