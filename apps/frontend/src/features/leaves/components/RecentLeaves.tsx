import { OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";
const data = [
  {
    srNo: 1,
    employeeId: "EMP0012",
    username: "rajdev",
    leaveType: "Sick Leave",
    startDate: "2025-06-20",
    endDate: "2025-06-22",
    status: "Pending",
    appliedAt: "2025-06-18T10:15:00Z",
  },
  {
    srNo: 2,
    employeeId: "EMP0043",
    username: "anita_singh",
    leaveType: "Casual Leave",
    startDate: "2025-06-21",
    endDate: "2025-06-21",
    status: "Pending",
    appliedAt: "2025-06-18T12:30:00Z",
  },
  {
    srNo: 3,
    employeeId: "EMP0034",
    username: "mohit_kumar",
    leaveType: "Annual Leave",
    startDate: "2025-06-25",
    endDate: "2025-06-30",
    status: "Pending",
    appliedAt: "2025-06-17T09:45:00Z",
  },
  {
    srNo: 4,
    employeeId: "EMP0021",
    username: "priya_verma",
    leaveType: "Maternity Leave",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    status: "Pending",
    appliedAt: "2025-06-15T14:00:00Z",
  },
];

const RecentLeaves = () => {
  // * recent leave table => srNo , employeeId, username , leave type , startDate , endDate , status , appliedAt
  function handleView(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    <>
      <QuickTable
        heading="Recent Leaves "
        staticData={data}
        visibleColumns={[
          { id: "srNo", label: "Sr No." },
          { id: "employeeId", label: "employeeId" },
          { id: "username", label: "username" },
          { id: "leaveType", label: "Leave Type" },
          { id: "startDate", label: "From" },
          { id: "endDate", label: "To" },
          { id: "status", label: "Status" },
        ]}
        options={{ textAlign: "center", pageSize: 10 }}
        actions={{
          useField: "employeeId",
          buttons: [
            {
              icon: <OpenEye />,
              callback: handleView,
            },
          ],
        }}
        highlightValues={[
          {
            id: "status",
            values: {
              Pending: "bg-[#FCAA5C]/10 text-[#FCAA5C]",
            },
          },
        ]}
      />
    </>
  );
};

export default RecentLeaves;
