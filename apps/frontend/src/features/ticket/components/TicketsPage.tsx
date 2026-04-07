import TicketHeader from "./TicketHeader";
import TicketMatrices from "./TicketMatrices";
import TicketTable from "./TicketTable";

const TicketsPage = () => {
  return (
    <div className="">
      <TicketHeader />
      <TicketMatrices />

      <div className="border-border overflow-hidden border">
        <TicketTable />
      </div>

      {/* <div className="bg-muted sticky bottom-0 flex items-center justify-between p-4">
        <p className="text-sm">
          {filteredTickets.length === 0
            ? "0 results"
            : `${(clampedPage - 1) * PAGE_SIZE + 1}-${Math.min(
                clampedPage * PAGE_SIZE,
                filteredTickets.length,
              )} of ${filteredTickets.length}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={clampedPage === 1}
          >
            Previous
          </Button>
          <span className="foreground text-sm">
            Page {clampedPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={clampedPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default TicketsPage;
