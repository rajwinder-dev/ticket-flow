import type { ReactNode } from "react";

interface props {
  title: string;
  description: string;
  children?: ReactNode;
}
const PageHeader = ({ title, description, children }: props) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      {children}
    </div>
  );
};

export default PageHeader;
