import { PlusIcon } from "../../components/ui/Icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import RoleOverview from "./components/RoleOverview";
import RolesTable from "./components/RolesTable";

const Roles = () => {
  function handleAssignRole() {}
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton className="w-50" onClick={handleAssignRole}>
        <PlusIcon /> Assign role
      </PrimaryButton>
      <RoleOverview />
      <RolesTable />
    </div>
  );
};

export default Roles;
