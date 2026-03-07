import { useNavigate } from "react-router";
import { DeleteIcon, OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const data = [
  {
    srNo: 1,
    employeeId: "EMP1001",
    username: "jdoe",
    role: "Admin",
    assignedAt: "2024-03-15T09:30:00Z",
    department: "IT",
    jobTitle: "System Administrator",
    email: "jdoe@example.com",
  },
  {
    srNo: 2,
    employeeId: "EMP1002",
    username: "asmith",
    role: "Editor",
    assignedAt: "2024-04-01T10:00:00Z",
    department: "Marketing",
    jobTitle: "Content Strategist",
    email: "asmith@example.com",
  },
  {
    srNo: 3,
    employeeId: "EMP1003",
    username: "bjones",
    role: "Viewer",
    assignedAt: "2023-12-22T11:45:00Z",
    department: "Finance",
    jobTitle: "Account Analyst",
    email: "bjones@example.com",
  },
  {
    srNo: 4,
    employeeId: "EMP1004",
    username: "kwhite",
    role: "Admin",
    assignedAt: "2024-02-10T08:30:00Z",
    department: "HR",
    jobTitle: "HR Manager",
    email: "kwhite@example.com",
  },
  {
    srNo: 5,
    employeeId: "EMP1005",
    username: "mjohnson",
    role: "Editor",
    assignedAt: "2024-01-05T14:20:00Z",
    department: "Sales",
    jobTitle: "Regional Sales Manager",
    email: "mjohnson@example.com",
  },
  {
    srNo: 6,
    employeeId: "EMP1006",
    username: "rpatel",
    role: "Viewer",
    assignedAt: "2024-05-11T16:10:00Z",
    department: "Operations",
    jobTitle: "Logistics Coordinator",
    email: "rpatel@example.com",
  },
  {
    srNo: 7,
    employeeId: "EMP1007",
    username: "tlee",
    role: "Admin",
    assignedAt: "2024-06-01T09:00:00Z",
    department: "IT",
    jobTitle: "DevOps Engineer",
    email: "tlee@example.com",
  },
  {
    srNo: 8,
    employeeId: "EMP1008",
    username: "nmartin",
    role: "Editor",
    assignedAt: "2023-11-15T13:35:00Z",
    department: "Legal",
    jobTitle: "Compliance Officer",
    email: "nmartin@example.com",
  },
  {
    srNo: 9,
    employeeId: "EMP1009",
    username: "lgreen",
    role: "Viewer",
    assignedAt: "2024-03-25T12:15:00Z",
    department: "Customer Support",
    jobTitle: "Support Specialist",
    email: "lgreen@example.com",
  },
  {
    srNo: 10,
    employeeId: "EMP1010",
    username: "psingh",
    role: "Admin",
    assignedAt: "2024-02-19T10:30:00Z",
    department: "Product",
    jobTitle: "Product Manager",
    email: "psingh@example.com",
  },
  {
    srNo: 11,
    employeeId: "EMP1011",
    username: "dlopez",
    role: "Viewer",
    assignedAt: "2023-10-10T09:45:00Z",
    department: "Design",
    jobTitle: "UX Designer",
    email: "dlopez@example.com",
  },
  {
    srNo: 12,
    employeeId: "EMP1012",
    username: "ehall",
    role: "Editor",
    assignedAt: "2024-04-20T15:30:00Z",
    department: "Engineering",
    jobTitle: "Frontend Developer",
    email: "ehall@example.com",
  },
  {
    srNo: 13,
    employeeId: "EMP1013",
    username: "bcarter",
    role: "Admin",
    assignedAt: "2024-01-18T11:25:00Z",
    department: "Engineering",
    jobTitle: "Backend Developer",
    email: "bcarter@example.com",
  },
  {
    srNo: 14,
    employeeId: "EMP1014",
    username: "gthomas",
    role: "Viewer",
    assignedAt: "2024-05-30T08:50:00Z",
    department: "HR",
    jobTitle: "Recruiter",
    email: "gthomas@example.com",
  },
  {
    srNo: 15,
    employeeId: "EMP1015",
    username: "cwalker",
    role: "Editor",
    assignedAt: "2024-06-10T14:00:00Z",
    department: "Marketing",
    jobTitle: "SEO Specialist",
    email: "cwalker@example.com",
  },
];

const RolesTable = () => {
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
        heading="roles data"
        staticData={data}
        visibleColumns={[
          { id: "srNo", label: "Sr No." },
          { id: "employeeId", label: "employeeId" },
          { id: "username", label: "username" },
          { id: "assignedAt", label: "assignedAt" },
          { id: "department", label: "Department" },
          { id: "jobTitle", label: "Job Title" },
          { id: "role", label: "Role" },
        ]}
        options={{ textAlign: "center", pageSize: 10 }}
        quickFilters={[
          {
            field: "department",
            values: ["Sales", "Product", "IT"],
            label: "Department",
          },
          {
            field: "role",
            values: ["Editor", "Viewer", "Editor"],
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
              icon: <DeleteIcon />,
              callback: handleRemove,
            },
          ],
        }}
        highlightValues={[
          {
            id: "role",
            values: {
              Admin: "bg-red-400/10 text-red-400",
              Editor: "bg-[#FCAA5C]/10 text-[#FCAA5C]",
              Viewer: "bg-[#28C76F]/10 text-[#28C76F] ",
            },
          },
        ]}
      />
    </>
  );
};

export default RolesTable;
