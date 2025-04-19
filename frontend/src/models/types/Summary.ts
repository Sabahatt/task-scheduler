import { ITask } from "./Task";

export interface ISummary {
  totalTasks: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  overdueCount: number;
  dueSoonCount: number;
  pendingTasks: ITask[];
  inProgressTasks: ITask[];
  completedTasks: ITask[];
  overdueTasks: ITask[];
  dueSoonTasks: ITask[];
}
