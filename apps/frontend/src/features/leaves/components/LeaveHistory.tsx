import { OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";
// * for leave history => Sr no, employeeId,username , department  appliedLeaves , rejectedLeaves , approvedLeaves , absent
const data = [
  {
    srNo: 1,
    employeeId: "EMP0012",
    username: "rajdev",
    department: "Development",
    appliedLeaves: 12,
    rejectedLeaves: 2,
    approvedLeaves: 9,
    absent: 1,
  },
  {
    srNo: 2,
    employeeId: "EMP0033",
    username: "anita_singh",
    department: "Marketing",
    appliedLeaves: 8,
    rejectedLeaves: 1,
    approvedLeaves: 6,
    absent: 1,
  },
  {
    srNo: 3,
    employeeId: "EMP0045",
    username: "mohit_kumar",
    department: "HR",
    appliedLeaves: 15,
    rejectedLeaves: 3,
    approvedLeaves: 11,
    absent: 1,
  },
  {
    srNo: 4,
    employeeId: "EMP0028",
    username: "priya_verma",
    department: "Finance",
    appliedLeaves: 10,
    rejectedLeaves: 0,
    approvedLeaves: 10,
    absent: 0,
  },
];

const LeaveHistory = () => {
  // * recent leave table => srNo , employeeId, username , leave type , startDate , endDate , status , appliedAt
  function handleView(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    <>
      <QuickTable
        heading="Leave history details"
        staticData={data}
        visibleColumns={[
          { id: "srNo", label: "Sr No." },
          { id: "employeeId", label: "employeeId" },
          { id: "username", label: "Username" },
          { id: "department", label: "Department" },
          { id: "appliedLeaves", label: "Applied" },
          { id: "rejectedLeaves", label: "Rejected" },
          { id: "approvedLeaves", label: "Status" },
          { id: "absent", label: "absent" },
        ]}
        options={{ textAlign: "center", pageSize: 10, advanceFilters: true }}
        actions={{
          useField: "employeeId",
          buttons: [
            {
              icon: <OpenEye />,
              callback: handleView,
            },
          ],
        }}
      />
    </>
  );
};

export default LeaveHistory;
