import axiosInstance from "@/utils/axiosClient";
import { ITask } from "@/models/types/Task";
import { ApiResponse } from "@/models/api-responses/ApiResponseModel";
import Api from "@/constants/Api";

export const getAllTasks = () => {
  return axiosInstance.get<ApiResponse<ITask[]>>(Api.TASKS);
};

export const getTaskById = (id: string) => {
  return axiosInstance.get<ApiResponse<ITask>>(`${Api.TASKS}/${id}`);
};

export const createTask = (taskData: Partial<ITask>) => {
  return axiosInstance.post<ApiResponse<ITask>>(Api.TASKS, taskData);
};

export const updateTask = (id: string, updates: Partial<ITask>) => {
  return axiosInstance.put<ApiResponse<ITask>>(`${Api.TASKS}/${id}`, updates);
};

export const deleteTask = (id: string) => {
  return axiosInstance.delete<ApiResponse<null>>(`${Api.TASKS}/${id}`);
};

export const assignTask = (taskId: string, memberId: string, forceAssign = false) => {
  return axiosInstance.post<ApiResponse<ITask>>(`${Api.ASSIGNMENT}`, {
    taskId,
    memberId,
    forceAssign,
  });
};

export const unassignTask = (taskId: string) => {
  return axiosInstance.post<ApiResponse<ITask>>(`${Api.ASSIGNMENT}/${Api.UNASSIGN}`, {
    taskId,
  });
};