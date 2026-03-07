import Card from "../../../components/ui/Card";
import QuickFilter from "../../../components/ui/QuickFilter";
import useQuickFilter from "../../../hooks/useQuickFilter";

const data = [
  {
    goalId: 1024,
    employeeId: "EMP2301",
    employeeName: "Raj Sharma",
    department: "Web Development",
    goalTitle: "Improve Frontend Code Quality",
    description:
      "Refactor existing components, implement comprehensive testing, and enhance application performance.",
    startDate: "2025-06-01",
    dueDate: "2025-07-15",
    status: "ongoing",
    tasksCount: 4,
    completedTasks: 2,
    progress: 50,
    assignedBy: "MGR120",
    lastUpdated: "2025-06-18T15:23:00Z",
    keyResultArea: "Code Quality & Performance",
  },
  {
    goalId: 1025,
    employeeId: "EMP2302",
    employeeName: "Priya Singh",
    department: "Backend Development",
    goalTitle: "Optimize Database Queries",
    description:
      "Identify and optimize slow database queries, implement indexing, and improve data retrieval efficiency.",
    startDate: "2025-06-10",
    dueDate: "2025-08-01",
    status: "pending",
    tasksCount: 3,
    completedTasks: 0,
    progress: 0,
    assignedBy: "MGR121",
    lastUpdated: "2025-06-19T10:00:00Z",
    keyResultArea: "Database Performance",
  },
  {
    goalId: 1026,
    employeeId: "EMP2303",
    employeeName: "Amit Kumar",
    department: "UI/UX Design",
    goalTitle: "Redesign User Onboarding Flow",
    description:
      "Conduct user research, create wireframes and prototypes, and deliver a new, intuitive onboarding experience.",
    startDate: "2025-05-20",
    dueDate: "2025-07-10",
    status: "completed",
    tasksCount: 5,
    completedTasks: 5,
    progress: 100,
    assignedBy: "MGR122",
    lastUpdated: "2025-07-09T17:45:00Z",
    keyResultArea: "User Experience",
  },
  {
    goalId: 102,
    employeeId: "EMP2304",
    employeeName: "Sneha Reddy",
    department: "Quality Assurance",
    goalTitle: "Automate Regression Test Suite",
    description:
      "Develop and implement automated test cases for critical regression scenarios to improve testing efficiency.",
    startDate: "2025-06-15",
    dueDate: "2025-08-30",
    status: "ongoing",
    tasksCount: 6,
    completedTasks: 1,
    progress: 16,
    assignedBy: "MGR120",
    lastUpdated: "2025-06-20T08:00:00Z",
    keyResultArea: "Test Automation",
  },
];
const GoalsTable = () => {
  const output = data.map((item) => ({
    title: item.goalTitle,
    startDate: item.startDate,
    endDate: item.dueDate,
    description: item.description,
    status: item.status as "ongoing" | "pending" | "completed",
    id: item.goalId,
    totalTasks: item.tasksCount,
    completedTasks: item.completedTasks,
    progress: item.progress,
    department: item.department,
    assignedTo: item.employeeId,
    lastUpdated: item.lastUpdated
  }));
  const { quickFilterData, updateQuickFilterData } = useQuickFilter();
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Goals Data</h1>
        <div>
          <QuickFilter
            updateFilter={updateQuickFilterData}
            quickFilterData={quickFilterData}
            quickFilters={[
              {
                field: "status",
                values: ["In Progress", "ongoing", "completed"],
                label: "Status",
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {output.map((dataItem) => (
          <Card data={dataItem}>
            <Card.States title="Task Count" value={dataItem.totalTasks} />
            <Card.States
              title="completed"
              value={dataItem.completedTasks}
            />
            <Card.States title="Progress" value={dataItem.progress} unit="%" />
          </Card>
        ))}
      </div>
    </>
  );
};

export default GoalsTable;
