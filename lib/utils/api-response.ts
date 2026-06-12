export type ApiResponseStatus = 'success' | 'error';

export type ApiResponse<T = unknown> = {
  status: ApiResponseStatus;
  message: string;
  data?: T;
};

export function successResponse<T>(data: T, message = '请求成功'): ApiResponse<T> {
  return {
    status: 'success',
    message,
    data,
  };
}

export function errorResponse(message = '请求失败'): ApiResponse {
  return {
    status: 'error',
    message,
  };
}
