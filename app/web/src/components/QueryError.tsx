import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
interface props {
  error: Error | null;
  description?: string;
  children: ReactNode;
}
const QueryBoundary = ({ error, description, children }: props) => {
  if (error)
    return (
      <>
        <div className="h-ful flex w-full items-center justify-center">
          <Alert className="rounded-none border-none text-center">
            {error && <AlertTitle>{error.message}</AlertTitle>}
            {description && <AlertDescription>{description}</AlertDescription>}
          </Alert>
        </div>
      </>
    );
  return children;
};

export default QueryBoundary;
