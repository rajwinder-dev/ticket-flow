import EmployeeTable from "./components/EmployeeTable";
import MultiTabs from "../../components/ui/MultiTabs";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { PlusIcon } from "../../components/ui/Icons";
import DepartmentsTable from "./components/DepartmentsTable";
import { useModal } from "../../context/ModalContext";
import EmployeeOverview from "./components/EmployeeOverview";
import CreateEmployeeModel from "./components/CreateEmployeeModel";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
function Employees() {
  const elements = [
    { label: "Employees Details", component: <EmployeeTable /> },
    { label: "Departments", component: <DepartmentsTable /> },
  ];

  const { openModal } = useModal();
  function handleCreateEmployee() {
    openModal(<CreateEmployeeModel />, "EmployeeForm");
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PrimaryButton className="w-50" onClick={handleCreateEmployee}>
          <PlusIcon /> create Employee
        </PrimaryButton>
        <SecondaryButton className="w-50">Add New Department</SecondaryButton>
      </div>
      <EmployeeOverview />
      <MultiTabs elements={elements} invertColor />
    </div>
  );
}

export default Employees;
