import { useNavigate } from "react-router";
import {  MessageIcon, OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const data = [
  {
    srNo: 1,
    employeeId: "EMP1001",
    username: "ajones",
    role: "Admin",
    assignedAt: "2024-01-01T09:00:00Z",
    department: "IT",
    jobTitle: "IT Manager",
    email: "ajones@example.com",
    reviewCount: 7,
    averageRating: 4,
  },
  {
    srNo: 2,
    employeeId: "EMP1002",
    username: "bsmith",
    role: "Viewer",
    assignedAt: "2024-01-02T10:30:00Z",
    department: "Product",
    jobTitle: "Product Analyst",
    email: "bsmith@example.com",
    reviewCount: 3,
    averageRating: 5,
  },
  {
    srNo: 3,
    employeeId: "EMP1003",
    username: "cwhite",
    role: "Editor",
    assignedAt: "2024-01-03T11:45:00Z",
    department: "Sales",
    jobTitle: "Sales Executive",
    email: "cwhite@example.com",
    reviewCount: 5,
    averageRating: 4,
  },
  {
    srNo: 4,
    employeeId: "EMP1004",
    username: "dlee",
    role: "Viewer",
    assignedAt: "2024-01-04T13:15:00Z",
    department: "IT",
    jobTitle: "Support Engineer",
    email: "dlee@example.com",
    reviewCount: 2,
    averageRating: 3,
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
    reviewCount: 4,
    averageRating: 3,
  },
  {
    srNo: 6,
    employeeId: "EMP1006",
    username: "esmith",
    role: "Admin",
    assignedAt: "2024-01-06T15:00:00Z",
    department: "Product",
    jobTitle: "Product Manager",
    email: "esmith@example.com",
    reviewCount: 6,
    averageRating: 5,
  },
];

const ReviewHistory = () => {
  const navigate = useNavigate();

  function handleView(id: string | number | null | undefined) {
    if (id === undefined) return;
    navigate(`/employees/${id}`);
  }

  return (
    <>
      <QuickTable
        heading="roles data"
        staticData={data}
        visibleColumns={[
          { id: "srNo", label: "Sr No." },
          { id: "employeeId", label: "Employee ID" },
          { id: "username", label: "User Name" },
          { id: "department", label: "Department" },
          { id: "role", label: "Role" },
          { id: "reviewCount", label: "Review Count" },
          { id: "averageRating", label: "Average Rating" , type: "rating" },
        ]}
        options={{ textAlign: "center", pageSize: 10 }}
        quickFilters={[
          {
            field: "department",
            values: ["Sales", "Product", "IT"],
            label: "Department",
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

export default ReviewHistory;
