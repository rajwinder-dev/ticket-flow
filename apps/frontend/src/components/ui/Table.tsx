import React, {
  createContext,
  memo,
  useContext,
  useState,
  type JSX,
} from "react";
import { cn } from "../../utils/cn";
import { SortIcon } from "./Icons";

type TableProps = {
  children: React.ReactNode;
  className?: string;
  textAlign?: "left" | "center";
};

type TableSubComponents = {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: unknown) => void;
  sortOrder?: string;
};

interface AppContextType {
  textAlign: string | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const useTableContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

type TableComponent = React.MemoExoticComponent<
  ({ children, className, textAlign }: TableProps) => JSX.Element
> & {
  Head: typeof TableHead;
  HeadCell: typeof HeadCell;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  Footer: typeof TableFooter;
  FootCell: typeof FootCell;
};

const TableBase = ({ children, className, textAlign }: TableProps) => {
  return (
    <div
      className={cn(
        `bg-lightWhite5 dark:text-gray-800  overflow-x-auto rounded-md border border-gray-300 dark:border-gary-800 text-${textAlign}`,
        className,
      )}
    >
      <AppContext.Provider value={{ textAlign }}>
        <table className="min-w-full table-fixed">{children}</table>
      </AppContext.Provider>
    </div>
  );
};

const Table = memo(TableBase) as TableComponent;

const TableHead = memo(function TableHead({
  children,
  className,
}: TableSubComponents) {
  return <thead className={cn("text-center", className)}>{children}</thead>;
});

const HeadCell = memo(function HeadCell({
  children,
  className,
  onClick,
  sortOrder,
}: TableSubComponents) {
  const { textAlign } = useTableContext();
  return (
    <th
      className={cn("relative px-4 py-2 font-semibold", className)}
      onClick={onClick}
    >
      <div
        className={`flex items-center justify-${textAlign} gap-1 hover:cursor-pointer`}
      >
        {textAlign !== "left" && <span className="h-[16px] w-[16px]"></span>}
        {children}
        {
          <span
            className={cn(
              "inline-block h-[16px] w-[16px] transition-opacity duration-200",
              sortOrder ? "opacity-100" : "opacity-0",
              sortOrder === "desc" && "scale-x-[-1]",
            )}
          >
            <SortIcon />
          </span>
        }
      </div>
    </th>
  );
});

const TableBody = memo(function TableBody({
  children,
  className,
}: TableSubComponents) {
  return <tbody className={cn("", className)}>{children}</tbody>;
});

const TableRow = memo(function TableRow({
  children,
  className,
  allowExpand,
}: TableSubComponents & { allowExpand?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <tr
        className={cn("", className)}
        onClick={() => setIsExpanded((preValue) => !preValue)}
      >
        {children}
      </tr>
      {allowExpand && isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={100} className="p-4">
            this expanded Table table
          </td>
        </tr>
      )}
    </>
  );
});

const TableCell = memo(function TableCell({
  children,
  className,
  colSpan,
}: TableSubComponents & { colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={cn("text-grey5 px-4 py-2", className)}>
      {children}
    </td>
  );
});

const TableFooter = memo(function TableFooter({
  children,
  className,
}: TableSubComponents) {
  return (
    <tfoot className={cn("f text-blue px-4 py-2", className)}>{children}</tfoot>
  );
});

const FootCell = memo(function FootCell({
  children,
  className,
}: TableSubComponents) {
  return <td className={cn("text-grey5 px-4 py-2", className)}>{children}</td>;
});

Table.Head = TableHead;
Table.HeadCell = HeadCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Footer = TableFooter;
Table.FootCell = FootCell;

export default Table;
