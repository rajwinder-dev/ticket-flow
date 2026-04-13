import TicketHeader from "./TicketHeader";
import TicketMatrices from "./TicketMatrices";
import TicketTable from "./TicketTable";

const TicketsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <TicketHeader />
      <TicketMatrices />
      <div className="border-border overflow-hidden border h-full">
        <TicketTable />
      </div>
    </div>
  );
};

export default TicketsPage;
