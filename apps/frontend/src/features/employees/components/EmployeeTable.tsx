import { useNavigate } from "react-router";
import { getAllEmployees } from "../../../actions/employee";
import { DeleteIcon, OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

function EmployeeTable() {
  const navigate = useNavigate();
  function handleView(id: string | number | null | undefined) {
    if (id === undefined) return;
    navigate(`/employees/${id}`);
  }
  function handleRemove(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    <>
      <QuickTable
        heading="Employee Data"
        apiFunction={getAllEmployees}
        queryKey="EmployeeData"
        visibleColumns={[
          { id: "srNo", label: "Sr No", className: "text-gray-400" },
          { id: "firstName", label: "First Name" },
          { id: "email", label: "Email" },
        ]}
        options={{ pageSize: 10, advanceFilters: true, textAlign: "center" }}
        quickFilters={[
          {
            field: "firstName",
            values: ["Little", "Jones"],
            label: "First Name",
          },
        ]}
        actions={{
          useField: "id",
          buttons: [
            {
              icon: <OpenEye />,
              callback: handleView,
            },
            {
              icon: <DeleteIcon />,
              callback: handleRemove,
            },
          ],
        }}
      />
    </>
  );
}

export default EmployeeTable;
