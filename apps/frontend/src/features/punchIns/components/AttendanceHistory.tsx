import { OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const data = [
  {
    srNo: 1,
    employeeId: "EMP1001",
    username: "john_doe",
    presentRate: 0.9,
    leaveRate: 0.1,
    presentRateMonthly: 0.8,
    status: "present",
  },
  {
    srNo: 2,
    employeeId: "EMP1002",
    username: "jane_smith",
    presentRate: 0.85,
    leaveRate: 0.15,
    presentRateMonthly: 0.75,
    status: "onLeave",
  },
  {
    srNo: 3,
    employeeId: "EMP1003",
    username: "alice_wong",
    presentRate: 0.95,
    leaveRate: 0.05,
    presentRateMonthly: 0.9,
    status: "present",
  },
  {
    srNo: 4,
    employeeId: "EMP1004",
    username: "bob_jones",
    presentRate: 0.7,
    leaveRate: 0.3,
    presentRateMonthly: 0.6,
    status: "absent",
  },
  {
    srNo: 5,
    employeeId: "EMP1005",
    username: "carol_lee",
    presentRate: 0.8,
    leaveRate: 0.2,
    presentRateMonthly: 0.7,
    status: "holiday",
  },
  {
    srNo: 6,
    employeeId: "EMP1006",
    username: "daniel_kim",
    presentRate: 0.92,
    leaveRate: 0.08,
    presentRateMonthly: 0.85,
    status: "present",
  },
  {
    srNo: 7,
    employeeId: "EMP1007",
    username: "emma_clark",
    presentRate: 0.88,
    leaveRate: 0.12,
    presentRateMonthly: 0.82,
    status: "present",
  },
  {
    srNo: 8,
    employeeId: "EMP1008",
    username: "frank_moore",
    presentRate: 0.6,
    leaveRate: 0.4,
    presentRateMonthly: 0.5,
    status: "absent",
  },
  {
    srNo: 9,
    employeeId: "EMP1009",
    username: "grace_hall",
    presentRate: 0.78,
    leaveRate: 0.22,
    presentRateMonthly: 0.7,
    status: "onLeave",
  },
  {
    srNo: 10,
    employeeId: "EMP1010",
    username: "henry_evans",
    presentRate: 0.82,
    leaveRate: 0.18,
    presentRateMonthly: 0.8,
    status: "present",
  },
  {
    srNo: 11,
    employeeId: "EMP1011",
    username: "irene_king",
    presentRate: 0.9,
    leaveRate: 0.1,
    presentRateMonthly: 0.88,
    status: "holiday",
  },
  {
    srNo: 12,
    employeeId: "EMP1012",
    username: "jack_lee",
    presentRate: 0.76,
    leaveRate: 0.24,
    presentRateMonthly: 0.7,
    status: "absent",
  },
  {
    srNo: 13,
    employeeId: "EMP1013",
    username: "karen_white",
    presentRate: 0.93,
    leaveRate: 0.07,
    presentRateMonthly: 0.9,
    status: "present",
  },
  {
    srNo: 14,
    employeeId: "EMP1014",
    username: "leo_brown",
    presentRate: 0.8,
    leaveRate: 0.2,
    presentRateMonthly: 0.78,
    status: "onLeave",
  },
];

const AttendanceHistory = () => {
  function handleView(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    // * need table => srNo , employeeId, checkIn, checkOut, status
    <QuickTable
      heading="roles data"
      staticData={data}
      visibleColumns={[
        { id: "srNo", label: "Sr No." },
        { id: "employeeId", label: "id" },
        { id: "username", label: "Username" },
        { id: "presentRate", label: "Present Rate ", type: "percent" },
        { id: "leaveRate", label: "Leave Rate", type: "percent" },
        { id: "presentRateMonthly", label: "Last month ", type: "percent" },
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
    />
  );
};

export default AttendanceHistory;
