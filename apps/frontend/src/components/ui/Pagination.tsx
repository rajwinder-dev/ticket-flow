"use client";

import { SecondaryButton } from "./SecondaryButton";

interface props {
  totalResults: number;
  pageSize: number;
  pageIndex: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  disableNext: boolean;
  disablePre: boolean;
}
export default function Pagination({
  totalResults,
  pageIndex,
  pageSize,
  disableNext,
  disablePre,
  handlePreviousPage,
  handleNextPage,
}: props) {
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalResults);
  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="flex w-full items-center justify-between py-4 relative">
      <div className={`flex gap-4 ${totalPages === 1 && "opacity-0"}`}>
        <p className="text-secondary">
          Showing {pageIndex * pageSize} to {end} of {totalResults}
        </p>
      </div>
      {totalPages === 1 ? (
        <p className="text-secondary">Only {totalResults} results found</p>
      ) : (
        <p>Total {totalPages} Pages</p>
      )}

      <div
        className={`flex items-center gap-4 ${totalPages === 1 && "opacity-0"}`}
      >
        <SecondaryButton
          onClick={handlePreviousPage}
          disabled={disableNext}
          className="w-16"
        >
          Prev
        </SecondaryButton>
        <p> {pageIndex + 1}</p>
        <SecondaryButton
          onClick={handleNextPage}
          disabled={disablePre}
          className="w-16"
        >
          Next
        </SecondaryButton>
      </div>
    </div>
  );
}
