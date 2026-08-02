import TicketComments from './TicketComments';
import TicketDetailsHeader from './TicketDetailsHeader';
import TicketMainDetails from './TicketMainDetails';
import { TransitionHistory } from './TransitionHistory';
import TicketTagsCard from './TicketTagsCard';

// --- Static Mock Data ---

const TicketDetailPage = () => {
  // Pre-calculate timeline from static data
  return (
    <div className="">
      <TicketDetailsHeader />

      <div className="grid lg:grid-cols-3">
        <TicketMainDetails />
        <TicketTagsCard />
      </div>

      <div className="grid lg:grid-cols-2">
        <TicketComments />
        <TransitionHistory />
      </div>
    </div>
  );
};

export default TicketDetailPage;
