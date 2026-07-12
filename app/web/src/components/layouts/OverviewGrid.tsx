import { cn } from "../../utils/cn";

interface props {
  children: React.ReactNode;
  className?: string;
  disableDefaultGrid?: boolean;
}
function OverviewGrid({ children, className, disableDefaultGrid }: props) {
  const defaultGrid = disableDefaultGrid
    ? ""
    : "grid rid-cols-1 md:[grid-template-columns:1fr_1px_1fr_1px] lg:[grid-template-columns:1fr_1px_1fr_1px_1fr_1px_1fr]";

  return (
    <div
      className={cn(
        `item-center w-full justify-between gap-8 rounded-md bg-lightWhite p-4`,
        defaultGrid,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default OverviewGrid;
