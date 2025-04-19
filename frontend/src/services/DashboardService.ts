import axiosInstance from "@/utils/axiosClient";
import { ApiResponse } from "@/models/api-responses/ApiResponseModel";
import Api from "@/constants/Api";
import { ISummary } from "@/models/types/Summary";


export const getSummary = () => {
  return axiosInstance.get<ApiResponse<ISummary>>(`${Api.DASHBOARD}`);
};