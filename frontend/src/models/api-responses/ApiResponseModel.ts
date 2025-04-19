export interface ApiResponse<T> {
    success: boolean;
    message: string;
    warning?: boolean;
    data: T;
  }