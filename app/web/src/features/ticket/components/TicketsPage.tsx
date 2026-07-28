import TicketHeader from "./TicketHeader";
import TicketMatrices from "./TicketMatrices";
import TicketTable from "./TicketTable";

const TicketsPage = () => {
  return (
    <div className="flex h-dvh flex-col overflow-x-auto w-full">
      <TicketHeader />
      <TicketMatrices />
      <div className="border-border h-full overflow-auto border">

        <TicketTable />
      </div>
    </div>
  );
};

export default TicketsPage;
