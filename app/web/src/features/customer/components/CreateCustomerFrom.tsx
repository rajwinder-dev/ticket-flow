import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Import only the base UI primitives
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomerInput, type CreateCustomerInput } from "@org/zod";
import useCustomer from "../hooks";
interface props {
  setOpen: (val: boolean) => void
}
const CreateCustomerFrom = ({setOpen}: props) => {
  const { createCustomer, isCreatingCustomer } = useCustomer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCustomerInput.bodySchema),
  });

  const onSubmit = (data: CreateCustomerInput) => {
    createCustomer(data, { onSuccess: () => {
      reset()
      setOpen(false)
    } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
      </div>

      {/* Avatar URL Field */}
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
        <Input
          id="avatarUrl"
          placeholder="https://..."
          {...register("avatarUrl")}
          className={errors.avatarUrl ? "border-destructive" : ""}
        />
        {errors.avatarUrl && <p className="text-destructive text-xs">{errors.avatarUrl.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isCreatingCustomer}>
        {isCreatingCustomer ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  );
};

export default CreateCustomerFrom;
