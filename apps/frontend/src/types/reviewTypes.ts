export interface CreateReview {
  review: string;
  rating: number;
}
interface Review extends CreateReview {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  reviewBy: number;
}

export interface GoalReview extends Review {
  goalId: number;
}
export interface TaskReview extends Review {
  taskId: number;
}
interface GoalReviewSummary {
  totalGoalsReviews: number;
  upcomingGoalReviews: number;
  averageGoalRating: number;
  topPerformingTeams: number;
}
interface TaskReviewSummary {
  totalTasksReviews: number;
  upcomingTaskReviews: number;
  averageTaskRating: number;
  topPerformingEmployees: number;
}
export interface ReviewSummary {
  goals: GoalReviewSummary;
  tasks: TaskReviewSummary;
}
