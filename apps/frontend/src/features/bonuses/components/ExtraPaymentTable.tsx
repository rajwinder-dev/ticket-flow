import { CloudIcon, OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const data = [
  {
    srNo: 1,
    employeeId: 3434,
    createdAt: "2024-06-01",
    salary: 40000,
    salaryType: "Base",
    effectiveFrom: "2024-06-01",
    effectiveTo: "2025-05-31",
    note: "Annual increment",
  },
  {
    srNo: 2,
    employeeId: 332434,
    createdAt: "2023-06-01",
    salary: 35000,
    salaryType: "Base",
    effectiveFrom: "2023-06-01",
    effectiveTo: "2024-05-31",
    note: "Initial salary",
  },
];

const ExtraPaymentTable = () => {
  return (
    <>
      <QuickTable
        heading="Payment History "
        staticData={data}
        visibleColumns={[
          { id: "srNo", label: "Sr No", className: "text-gray-400" },
          {
            id: "employeeId",
            label: "Employee Id",
          },
          { id: "salaryType", label: "Salary Type" },
          { id: "createdAt", label: "Paid At" },
          { id: "effectiveFrom", label: "Effective From" },
          { id: "effectiveTo", label: "Effective To" },
          { id: "salary", label: "Salary", type: "$" },
        ]}
        options={{ pageSize: 10, advanceFilters: true, textAlign: "center" }}
        actions={{
          useField: "employeeId",
          buttons: [
            {
              icon: <OpenEye />,
              callback: () => {},
            },
            // replace with download icon
            {
              icon: <CloudIcon className="h-6 w-6" />,
              callback: () => {},
            },
          ],
        }}
      />
    </>
  );
};

export default ExtraPaymentTable;
