import { PlusIcon } from "../../components/ui/Icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import TeamOverview from "./components/TeamOverview";
import TeamTable from "./components/TeamTable";

const Teams = () => {
  function handleCreateTeam() {}
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton className="w-50" onClick={handleCreateTeam}>
        <PlusIcon /> assign Team
      </PrimaryButton>
      <TeamOverview />
      <TeamTable />
    </div>
  );
};

export default Teams;
