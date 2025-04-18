import axiosInstance from "@/utils/axiosClient";
import { IMember } from "@/models/types/Member";
import { ApiResponse } from "@/models/api-responses/ApiResponseModel";
import Api from "@/constants/Api";
import { ITask } from "@/models/types/Task";

export const getAllMembers = () => {
  return axiosInstance.get<ApiResponse<IMember[]>>(Api.MEMBERS);
};

export const getMemberById = (id: string) => {
  return axiosInstance.get<ApiResponse<{member: IMember, tasks: ITask}>>(`${Api.MEMBERS}/${id}`);
};

export const createMember = (taskData: Partial<IMember>) => {
  return axiosInstance.post<ApiResponse<IMember>>(Api.MEMBERS, taskData);
};

export const updateMember = (id: string, updates: Partial<IMember>) => {
  return axiosInstance.put<ApiResponse<IMember>>(`${Api.MEMBERS}/${id}`, updates);
};

export const deleteMember = (id: string) => {
  return axiosInstance.delete<ApiResponse<null>>(`${Api.MEMBERS}/${id}`);
};