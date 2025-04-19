import { ITask } from "./Task";

export interface IMember {
    _id: string;
    memberName: string;
    availableHours: number;
    createdAt: string;
    updatedAt: string;
    taskCount?: number;
    assignedTasks?: ITask[];
    totalAssignedHours?: number
    isOverloaded?: boolean
  }
  