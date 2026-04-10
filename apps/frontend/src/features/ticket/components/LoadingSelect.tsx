import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export const LoadingSelect = ({
  isLoading,
  placeholder,
  children,
  onValueChange,
  disabled,
}: {
  isLoading: boolean;
  placeholder: string;
  children: React.ReactNode;
  onValueChange: (val: string) => void;
  disabled?: boolean;
}) => (
  <Select onValueChange={onValueChange} disabled={isLoading || disabled}>
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
