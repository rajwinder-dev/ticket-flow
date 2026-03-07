import MultiTabs from "../../components/ui/MultiTabs";
import BusinessProfile from "./components/BusinessProfile";
import General from "./components/General";
import LeavePolicy from "./components/LeavePolicy";
import Notification from "./components/Notification";
import Payroll from "./components/Payroll";
import Permissions from "./components/Permissions";
import Security from "./components/Security";
// import Subscription from "./components/Subscription";

const elements = [
  { label: "General", component: <General /> },
  { label: "Business Profile", component: <BusinessProfile /> },
  { label: "Leave Policy", component: <LeavePolicy /> },
  { label: "Pay Role", component: <Payroll /> },
  { label: "Notification", component: <Notification /> },
  { label: "Security", component: <Security /> },
  { label: "Permissions", component: <Permissions /> },
  // { label: "Subscription & Usage", component: <Subscription /> },

];
function Settings() {
  return (
    <div>
      <MultiTabs elements={elements} style="advance"/>
    </div>
  );
}

export default Settings;
