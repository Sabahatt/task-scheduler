import { IMember } from "./Member";

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  estimatedHours: number;
  deadline: string;
  status: "Pending" | "In Progress" | "Completed"; 
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: IMember;
}
