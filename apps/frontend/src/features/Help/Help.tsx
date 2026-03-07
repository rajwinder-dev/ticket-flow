import MultiTabs from "../../components/ui/MultiTabs";
import Report from "./components/Report";
import UseHelp from "./components/UseHelp";

const elements = [
  {
    label: "General Help",
    component: <UseHelp />,
  },
  {
    label: "Report",
    component: <Report />,
  },
];
function Help() {
  return (
    <div>
      <MultiTabs elements={elements} invertColor/>

    </div>
  );
}

export default Help;
