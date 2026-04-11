import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
type LoadingSelectProps = {
  isLoading: boolean;
  placeholder?: string;
  children: ReactNode;
} & ComponentProps<typeof Select>;
export const LoadingSelect = ({
  isLoading,
  placeholder,
  children,
  ...props
}: LoadingSelectProps) => (
  <Select {...props}>
    <SelectTrigger>
      {isLoading ? (
        <span className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading...
        </span>
      ) : (
        <SelectValue placeholder={placeholder} />
      )}
    </SelectTrigger>
    <SelectContent>{children}</SelectContent>
  </Select>
);
