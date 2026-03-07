export interface CreateGoal {
  goal: string;
  deadline: Date;
}
export interface GoalDetails extends CreateGoal {
  srNo?: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  done: boolean;
  assignedBy: number;
  assignedTo: number;
}

export interface GoalSummary {
  PendingGoals: number;
  goalsCreatedLast30Days: number;
  goalOverDue: number;
}
