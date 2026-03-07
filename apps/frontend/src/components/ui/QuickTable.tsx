import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Table from "./Table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type PaginationState,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import React, { useEffect, useState, type ReactNode } from "react";
import useQuickFilter from "../../hooks/useQuickFilter";
import QuickFilter from "./QuickFilter";
import FilterButton from "./FilterButton";
import { cn } from "../../utils/cn";
import { formatDate } from "../../utils/projectUtils";
import StarRating from "./StarRating";

interface GetTableDataParams {
  filterOptions: {
    offset: number;
    limit: number;
    filter: Record<string, string | number>;
    sorting?: {
      sortby: string;
      sortOrder?: "asc" | "desc";
    };
  };
}
export interface GetTableDataResponse<T> {
  data: T[];
  total: number;
  limit: number;
}
type ApiFunction<T> = (
  params: GetTableDataParams,
) => Promise<GetTableDataResponse<T>>;

export interface QuickFilters<T> {
  label: string;
  field: keyof T;
  values: string[];
}
type HighlightValues<K> = {
  id: K;
  values: Record<string, string>;
};
interface Props<T, K extends keyof T = keyof T> {
  apiFunction?: ApiFunction<T>;
  staticData?: T[];
  visibleColumns: {
    id: keyof T;
    label: string;
    className?: string;
    type?: "percent" | "$" | "rating";
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }[];
  options?: {
    pageSize?: number;
    advanceFilters?: boolean;
    textAlign?: "left" | "center";
    dateFormat?: string;
    expandableRow?: ReactNode;
  };
  queryKey?: string;
  heading?: string;
  actions?: {
    buttons: {
      icon: React.ReactNode;
      callback: (id: T[K]) => void;
      className?: string;
    }[];
    useField: K;
  };
  quickFilters?: QuickFilters<T>[];
  children?: React.ReactNode;
  highlightValues?: HighlightValues<K>[];
}
// * currently performance issue if more the 50 rows
const QuickTable = <T extends object>({
  apiFunction,
  visibleColumns,
  queryKey,
  options,
  quickFilters,
  heading,
  actions,
  children,
  staticData,
  highlightValues,
}: Props<T>) => {
  // config
  const isServer = Boolean(!staticData);
  const columnHelper = createColumnHelper<T>();
  const dataColumns = visibleColumns.map((item) =>
    columnHelper.accessor((row) => row[item.id], {
      id: String(item.id),
      header: () => item.label,
      cell: (info) => {
        let value;
        if (item.type === "percent") {
          value = `${(Number(info.getValue()) * 100).toFixed(0)}%`;
        } else if (item.type === "$") {
          value = `${info.getValue()} $`;
        } else if (item.type === "rating") {
          return <StarRating rating={Number(info.getValue())} />;
        } else {
          value = formatDate(info.getValue(), options?.dateFormat);
        }
        const columnId = info.column.id;

        // highlight fields Logic
        let colorClass = "";
        if (highlightValues) {
          const highlight = highlightValues.find(
            (item) => item.id === columnId,
          );

          if (highlight && typeof value === "string") {
            const color = highlight.values[value];
            if (color) {
              colorClass = color;
            }
          }
        }
        return (
          <span
            className={cn(`rounded-full px-2 py-1`, colorClass, item.className)}
          >
            {value instanceof Date
              ? value.toLocaleDateString()
              : String(value ?? "")}
          </span>
        );
      },
    }),
  );
  let columns = dataColumns;
  // add actions column
  if (actions) {
    const actionColumns = columnHelper.accessor(
      (row) => row[actions.useField],
      {
        id: "unique",
        header: () => "actions",
        cell: (info) => {
          const value = info.getValue();
          return (
            <div
              className={`flex gap-4 justify-${options?.textAlign} items-center`}
            >
              {actions &&
                actions.buttons.map((item, idx) => (
                  <span
                    className={cn(`hover:cursor-pointer`, item.className)}
                    key={idx}
                    onClick={() => {
                      if (
                        typeof value === "string" ||
                        typeof value === "number"
                      )
                        item.callback(value as T[typeof actions.useField]);
                      else console.warn("Invalid Id passed to callback", value);
                    }}
                  >
                    {item.icon}
                  </span>
                ))}
            </div>
          );
        },
      },
    );
    columns = [...columns, actionColumns];
  }

  // 1. Filter state
  const { quickFilterData, updateQuickFilterData } = useQuickFilter();
  const [advanceFilter, setAdvanceFilter] = useState<
    Record<string, string | number>
  >({});
  const [filters, setFilters] = useState<Record<string, string | number>>({});

  // 2. Update combined filter whenever inputs change
  useEffect(() => {
    setFilters({ ...quickFilterData, ...advanceFilter });
  }, [advanceFilter, quickFilterData]);

  // 3. Pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: options?.pageSize ? options?.pageSize : 10,
  });
  const offset = pagination.pageIndex * pagination.pageSize;

  // 4. Sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  const serverSorting =
    sorting.length > 0
      ? {
          sortby: sorting[0].id,
          sortOrder: sorting[0].desc ? ("desc" as const) : ("asc" as const),
        }
      : undefined;
  const wrappedApiFunction = async () => {
    if (!apiFunction) return null;
    const options = {
      offset,
      limit: pagination.pageSize,
      filter: filters,
      ...(serverSorting ? { sorting: serverSorting } : {}),
    };
    const result = await apiFunction({ filterOptions: options });

    if (!result || !Array.isArray(result.data)) {
      throw new Error("API response is not valid.");
    }

    return result;
  };
  // 5. Query
  const { data, error } = useQuery({
    queryKey: [queryKey, pagination, sorting, filters],
    queryFn: wrappedApiFunction,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
  if (error) console.error(error);
  // 6. Table config
  let totalPages;
  if (staticData) {
    totalPages = Math.ceil(staticData.length / pagination.pageSize);
  } else totalPages = data ? Math.ceil(data.total / data.limit) : 0;
  console.log(data?.data);
  const table = useReactTable({
    columns,
    data: staticData || data?.data || [],
    debugTable: true,
    pageCount: totalPages,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    state: {
      pagination,
      sorting,
    },
    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });
  const filterFields = visibleColumns.map((col) => ({
    id: String(col.id),
    label: col.label,
  }));
  return (
    <>
      <div className="rounded-lg bg-white p-4">
        <div className="flex justify-between py-4">
          <div className="flex gap-4">
            {heading && (
              <h2 className="pb-4 text-xl font-semibold capitalize">
                {heading}
              </h2>
            )}
            {children}
          </div>

          <div className="flex items-center gap-4">
            {/* <SearchInput placeholder="Search employee" /> */}
            {quickFilters && (
              <QuickFilter
                updateFilter={updateQuickFilterData}
                quickFilters={quickFilters}
                quickFilterData={quickFilterData}
              />
            )}
            {options?.advanceFilters && (
              <FilterButton
                getFilterObject={setAdvanceFilter}
                filterFields={filterFields}
                advanceFilter={advanceFilter}
              />
            )}
          </div>
        </div>
        <Table textAlign={options?.textAlign}>
          <Table.Head>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.HeadCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sortOrder={(header.column.getIsSorted() as string) ?? null}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Table.HeadCell>
                ))}
              </Table.Row>
            ))}
          </Table.Head>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {cell.getIsPlaceholder()
                      ? null
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
            {Array.from({
              length:
                pagination.pageSize - table.getGroupedRowModel().rows.length,
            }).map((_, i) => (
              <Table.Row key={`empty-${i}`}>
                {table.getVisibleFlatColumns().map((column) => (
                  <Table.Cell key={column.id}>
                    <span className="opacity-0 select-none">-</span>{" "}
                    {/* Invisible filler */}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            {table.getFooterGroups().map((footerGroup) => (
              <Table.Row key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <Table.FootCell key={header.id}>
                    {flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
                  </Table.FootCell>
                ))}
              </Table.Row>
            ))}
          </Table.Footer>
        </Table>
        {options?.pageSize && (
          <Pagination
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex}
            totalResults={
              isServer ? (data?.total ?? 0) : (staticData?.length ?? 0)
            }
            handleNextPage={table.nextPage}
            handlePreviousPage={table.previousPage}
            disablePre={!table.getCanPreviousPage}
            disableNext={!table.getCanNextPage}
          />
        )}
      </div>
    </>
  );
};

export default QuickTable;
