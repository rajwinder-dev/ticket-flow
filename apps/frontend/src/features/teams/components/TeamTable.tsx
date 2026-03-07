import { DeleteIcon } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const teamData = [
  {
    srNo: 1,
    createdat: "2024-01-15T09:30:00Z",
    employeeId: "EMP001",
    username: "Alice Johnson",
    role: "Developer",
    totalMembers: 5,
    status: "Active",
  },
  {
    srNo: 2,
    createdat: "2024-02-01T10:00:00Z",
    employeeId: "EMP002",
    username: "Bob Smith",
    role: "Designer",
    totalMembers: 3,
    status: "Active",
  },
  {
    srNo: 3,
    createdat: "2024-02-10T11:15:00Z",
    employeeId: "EMP003",
    username: "Charlie Brown",
    role: "QA Engineer",
    totalMembers: 4,
    status: "Inactive",
  },
  {
    srNo: 4,
    createdat: "2024-03-05T14:45:00Z",
    employeeId: "EMP004",
    username: "Diana Prince",
    role: "Project Manager",
    totalMembers: 8,
    status: "Active",
  },
  {
    srNo: 5,
    createdat: "2024-03-20T08:00:00Z",
    employeeId: "EMP005",
    username: "Eve Adams",
    role: "Developer",
    totalMembers: 6,
    status: "Active",
  },
  {
    srNo: 6,
    createdat: "2024-04-01T09:00:00Z",
    employeeId: "EMP006",
    username: "Frank White",
    role: "Marketing Specialist",
    totalMembers: 2,
    status: "Pending",
  },
  {
    srNo: 7,
    createdat: "2024-04-18T16:30:00Z",
    employeeId: "EMP007",
    username: "Grace Hopper",
    role: "Developer",
    totalMembers: 5,
    status: "Active",
  },
  {
    srNo: 8,
    createdat: "2024-05-02T13:00:00Z",
    employeeId: "EMP008",
    username: "Henry Ford",
    role: "Lead Designer",
    totalMembers: 4,
    status: "Active",
  },
  {
    srNo: 9,
    createdat: "2024-05-19T10:45:00Z",
    employeeId: "EMP009",
    username: "Ivy Green",
    role: "Business Analyst",
    totalMembers: 7,
    status: "Inactive",
  },
  {
    srNo: 10,
    createdat: "2024-06-01T09:00:00Z",
    employeeId: "EMP010",
    username: "Jack Black",
    role: "QA Engineer",
    totalMembers: 3,
    status: "Active",
  },
  {
    srNo: 11,
    createdat: "2024-06-10T11:00:00Z",
    employeeId: "EMP011",
    username: "Karen Blue",
    role: "Developer",
    totalMembers: 6,
    status: "Active",
  },
  {
    srNo: 12,
    createdat: "2024-06-17T14:00:00Z",
    employeeId: "EMP012",
    username: "Liam White",
    role: "Project Manager",
    totalMembers: 9,
    status: "Active",
  },
];
const TeamTable = () => {
  function handleRemove(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    <div>
      <QuickTable
        heading="Teams Data"
        staticData={teamData}
        visibleColumns={[
          { id: "srNo", label: "Sr, No" },
          { id: "employeeId", label: "Employee Id" },
          { id: "createdat", label: "Created At" },
          { id: "username", label: "Username" },
          { id: "role", label: "Role" },
          { id: "totalMembers", label: "Team Members" },
          { id: "status", label: "status" },
        ]}
        options={{ pageSize: 10, textAlign: "center", advanceFilters: true }}
        highlightValues={[
          {
            id: "status",
            values: {
              Active: "bg-blue/10 text-blue",
              Inactive: "bg-[#FCAA5C]/10 text-[#FCAA5C]",
              Completed: "bg-[#28C76F]/10 text-[#28C76F] ",
              Pending: "bg-red-400/10 text-red-400",
            },
          },
        ]}
        actions={{
          useField: "employeeId",
          buttons: [
            {
              icon: <DeleteIcon />,
              callback: handleRemove,
            },
          ],
        }}
        quickFilters={[
          {
            field: "status",
            values: ["Active", "Inactive"],
            label: "Status",
          },
          {
            field: "role",
            values: ["Developer", "Designer"],
            label: "First Name",
          },
        ]}
      />
    </div>
  );
};

export default TeamTable;
