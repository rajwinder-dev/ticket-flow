export interface CreateTask {
  task: string;
  deadline: Date;
  assignedTo: number;
}
export interface UpdateTask {
    task: string;
  deadline: Date;
}
export interface TaskDetails extends CreateTask {
  id: number;
  createdAt: Date;
  updateAt: Date;
  done: boolean;
  goalId: number;
  assignedBy: number;
  assignedTo: number;
}

