import { SerializedError } from '@reduxjs/toolkit';

export type ApiResponse<T = {}> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error: ApiError | SerializedError;
};

export type ApiError = {
  status: number;
  data: {
    message: string;
  } | null;
};
