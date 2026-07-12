import { Button } from "@/components/ui/button";

type PaginationProps = {
  offset: number;
  limit: number;
  total: number;
  onChange: (params: { offset: number; limit: number }) => void;
};

export function Pagination({ offset, limit, total, onChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const canGoPrev = offset > 0;
  const canGoNext = offset + limit < total;

  const handlePrev = () => {
    if (!canGoPrev) return;
    onChange({
      offset: offset - limit,
      limit,
    });
  };

  const handleNext = () => {
    if (!canGoNext) return;
    onChange({
      offset: offset + limit,
      limit,
    });
  };

  return (
    <div className="bg-muted sticky bottom-0 flex items-center justify-between p-4">
      <p className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages} • {total} items
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={!canGoPrev}>
          Previous
        </Button>

        <span className="text-sm font-medium">
          {currentPage} / {totalPages}
        </span>

        <Button variant="outline" size="sm" onClick={handleNext} disabled={!canGoNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
