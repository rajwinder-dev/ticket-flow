import TaskOverview from "./components/TaskOverview";
import TaskTable from "./components/TaskTable";

const TaskDetails = () => {

  return (
    <div className="flex flex-col gap-4">
      <TaskOverview />
      <TaskTable />
    </div>
  );
};

export default TaskDetails;
