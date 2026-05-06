import TicketHeader from "./TicketHeader";
import TicketMatrices from "./TicketMatrices";
import TicketTable from "./TicketTable";

const TicketsPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <TicketHeader />
      <TicketMatrices />
      <div className="border-border h-full overflow-hidden border">
        <TicketTable />{" "}
      </div>
    </div>
  );
};

export default TicketsPage;
