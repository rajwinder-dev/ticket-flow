import { MessageIcon, SmsIcon } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";
const data = [
  {
    SrNO: 1,
    taskId: "T001",
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2025-06-18T10:30:00Z",
    deadLine: "2025-07-05",
    task: "Refactor User Authentication Module",
    assignedTo: "Raj Sharma",
    assignedBy: "MGR120",
    status: "Pending",
  },
  {
    SrNO: 2,
    taskId: "T002",
    createdAt: "2025-06-05T14:15:00Z",
    updatedAt: "2025-06-19T11:00:00Z",
    deadLine: "2025-07-10",
    task: "Implement Unit Tests for Payment Gateway Integration",
    assignedTo: "Raj Sharma",
    assignedBy: "MGR120",
    status: "Pending",
  },
  {
    SrNO: 3,
    taskId: "T003",
    createdAt: "2025-06-12T16:00:00Z",
    updatedAt: "2025-06-12T16:00:00Z",
    deadLine: "2025-07-25",
    task: "Analyze and document current database query performance",
    assignedTo: "Priya Singh",
    assignedBy: "MGR121",
    status: "Pending",
  },
  {
    SrNO: 4,
    taskId: "T004",
    createdAt: "2025-05-22T10:00:00Z",
    updatedAt: "2025-07-08T14:00:00Z",
    deadLine: "2025-07-10",
    task: "Finalize User Onboarding UI Mockups",
    assignedTo: "Amit Kumar",
    assignedBy: "MGR122",
    status: "Completed",
  },
  {
    SrNO: 5,
    taskId: "T005",
    createdAt: "2025-06-16T11:30:00Z",
    updatedAt: "2025-06-20T09:00:00Z",
    deadLine: "2025-08-15",
    task: "Setup Cypress framework for end-to-end testing",
    assignedTo: "Sneha Reddy",
    assignedBy: "MGR120",
    status: "Pending",
  },
];
const TaskTable = () => {

  return (
    // * need table => SrNO , taskId , createdAt , updatedAt, deadLine , task , assignedTo , assignedBy ,
    <QuickTable
      heading="Today attendance"
      staticData={data}
      visibleColumns={[
        { id: "SrNO", label: "Sr No." },
        { id: "createdAt", label: "created At" },
        { id: "task", label: "Task" },
        { id: "deadLine", label: "deadline" },
        { id: "assignedTo", label: "Assigned To" },
        {id: "status", label: "Status"}
      ]}
      options={{ textAlign: "center", pageSize: 10, }}
      quickFilters={[
        {
          field: "status",
          values: ["present", "absent", "onLeave", "holiday"],
          label: "Department",
        },
      ]}
      actions={{
        useField: "taskId",
        buttons: [
          {
            icon: <MessageIcon />,
            callback: () => {},
          },
               {
            icon: <SmsIcon />,
            callback: () => {},
          },
        ],
      }}
      highlightValues={[
        {
          id: "status",
          values: {
            Pending: "bg-[#FCAA5C]/10 text-[#FCAA5C]",
            Completed: "bg-[#28C76F]/10 text-[#28C76F] ",
          },
        },
      ]}
    />
  );
};

export default TaskTable;
