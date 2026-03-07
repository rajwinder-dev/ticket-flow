import { OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const data = [
  {
    srNo: 1,
    employeeId: "EMP1001",
    username: "john_doe",
    checkIn: "2025-06-19T09:05:00",
    checkOut: "2025-06-19T17:00:00",
    status: "present",
  },
  {
    srNo: 2,
    employeeId: "EMP1002",
    username: "alice_smith",
    checkIn: "2025-06-19T09:15:00",
    checkOut: "2025-06-19T17:05:00",
    status: "present",
  },
  {
    srNo: 3,
    employeeId: "EMP1003",
    username: "bob_jones",
    checkIn: null,
    checkOut: null,
    status: "absent",
  },
  {
    srNo: 4,
    employeeId: "EMP1004",
    username: "carol_lee",
    checkIn: null,
    checkOut: null,
    status: "onleave",
  },
  {
    srNo: 5,
    employeeId: "EMP1005",
    username: "david_kim",
    checkIn: "2025-06-19T08:55:00",
    checkOut: "2025-06-19T16:50:00",
    status: "present",
  },
  {
    srNo: 6,
    employeeId: "EMP1006",
    username: "emma_wilson",
    checkIn: "2025-06-19T09:10:00",
    checkOut: "2025-06-19T17:15:00",
    status: "present",
  },
  {
    srNo: 7,
    employeeId: "EMP1007",
    username: "frank_moore",
    checkIn: null,
    checkOut: null,
    status: "holiday",
  },
  {
    srNo: 8,
    employeeId: "EMP1008",
    username: "grace_chen",
    checkIn: null,
    checkOut: null,
    status: "onleave",
  },
  {
    srNo: 9,
    employeeId: "EMP1009",
    username: "henry_clark",
    checkIn: "2025-06-19T09:00:00",
    checkOut: "2025-06-19T17:00:00",
    status: "present",
  },
  {
    srNo: 10,
    employeeId: "EMP1010",
    username: "irene_martin",
    checkIn: null,
    checkOut: null,
    status: "absent",
  },
  {
    srNo: 11,
    employeeId: "EMP1011",
    username: "jackie_liu",
    checkIn: "2025-06-19T09:30:00",
    checkOut: "2025-06-19T18:00:00",
    status: "present",
  },
  {
    srNo: 12,
    employeeId: "EMP1012",
    username: "karen_patel",
    checkIn: "2025-06-19T08:45:00",
    checkOut: "2025-06-19T16:30:00",
    status: "present",
  },
  {
    srNo: 13,
    employeeId: "EMP1013",
    username: "leo_garcia",
    checkIn: null,
    checkOut: null,
    status: "holiday",
  },
  {
    srNo: 14,
    employeeId: "EMP1014",
    username: "mia_roberts",
    checkIn: "2025-06-19T09:20:00",
    checkOut: "2025-06-19T17:10:00",
    status: "present",
  },
  {
    srNo: 15,
    employeeId: "EMP1015",
    username: "nina_singh",
    checkIn: null,
    checkOut: null,
    status: "onleave",
  },
];

const AttendanceTable = () => {
  function handleView(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    // * need table => srNo , employeeId, checkIn, checkOut, status
    <QuickTable
      heading="Today attendance"
      staticData={data}
      visibleColumns={[
        { id: "srNo", label: "Sr No." },
        { id: "employeeId", label: "id" },
        { id: "username", label: "Username" },
        { id: "checkIn", label: "Check In" },
        { id: "checkOut", label: "Check out" },
        { id: "status", label: "status" },
      ]}
      options={{ textAlign: "center", pageSize: 10, dateFormat: "HH:mm a" }}
      quickFilters={[
        {
          field: "status",
          values: ["present", "absent", "onLeave", "holiday"],
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
        ],
      }}
      highlightValues={[
        {
          id: "status",
          values: {
            absent: "bg-red-400/10 text-red-400",
            holiday: "bg-blue-400/10 text-blue-400",
            onleave: "bg-[#FCAA5C]/10 text-[#FCAA5C]",
            present: "bg-[#28C76F]/10 text-[#28C76F] ",
          },
        },
      ]}
    />
  );
};

export default AttendanceTable;
