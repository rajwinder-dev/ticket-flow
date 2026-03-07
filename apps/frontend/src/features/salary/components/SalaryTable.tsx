import { useNavigate } from "react-router";
import QuickTable from "../../../components/ui/QuickTable";
import { CloudIcon, MessageIcon, OpenEye } from "../../../components/ui/Icons";
const data = [
  {
    srNo: 1,
    employeeId: "EMP001",
    name: "Raj Mehta",
    department: "Engineering",
    hireDate: "2022-03-15",
    salaryType: "Base",
    netSalary: 48000,
    status: "paid",
    paymentDate: "2025-06-01",
  },
  {
    srNo: 2,
    employeeId: "EMP002",
    name: "Priya Sharma",
    department: "Sales",
    hireDate: "2023-05-10",
    salaryType: "Base",
    netSalary: 42000,
    status: "pending",
    paymentDate: null,
  },
];

const SalaryTable = () => {

  const navigate = useNavigate();
  function handleView(id: string | number | null | undefined) {
    if (id === undefined) return;
    navigate(`/Salary/${id}`);
  }
  return (
    <>
      <QuickTable
        heading="Last month salary Data"
        staticData={data}
        visibleColumns={[
          { id: "srNo", label: "Sr No", className: "text-gray-400" },
          { id: "employeeId", label: "ID" },
          { id: "name", label: "Username" },
          { id: "hireDate", label: "Hire Date" },
          // { id: "department", label: "department" },
          { id: "salaryType", label: "Salary type " },
          { id: "netSalary", label: "net Salary" },
          { id: "status", label: "Status" },
          // { id: "paymentDate", label: "PaymentDate" },
        ]}
        options={{ pageSize: 10, advanceFilters: true, textAlign: "center" }}
        quickFilters={[
          {
            field: "department",
            values: ["Marketing", "Development"],
            label: "Department",
          },
          {
            field: "status",
            values: ["pending", "Paid"],
            label: "First Name",
          },
        ]}
        actions={{
          useField: "employeeId",
          buttons: [
            {
              icon: <OpenEye />,
              callback: handleView,
            },
            {
              icon: <MessageIcon />,
              callback: handleView,
            },
            // replace with download icon
            {
              icon: <CloudIcon className="h-6 w-6" />,
              callback: handleView,
            },
          ],
        }}
        highlightValues={[
          {
            id: "status",
            values: {
              pending: "bg-red-400/10 text-red-400",
              paid: "bg-[#28C76F]/10 text-[#28C76F] ",
            },
          },
        ]}
      />
    </>
  );
};

export default SalaryTable;
