import { Label } from "./label";

export const FieldWrapper = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className={error ? "text-destructive" : ""}>{label}</Label>
    {children}
    {error && <p className="text-destructive text-xs">{error}</p>}
  </div>
);
