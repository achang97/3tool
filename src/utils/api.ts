import { ApiError, ApiErrorResponse } from '@app/types';
import { SerializedError } from '@reduxjs/toolkit';

export const isApiError = (error: unknown): error is ApiError => {
  return (
    error instanceof Object &&
    'data' in error &&
    error.data instanceof Object &&
    'message' in error.data
  );
};

export const isSerializedError = (error: unknown): error is SerializedError => {
  return error instanceof Object && 'message' in error;
};

export const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return isApiError(error) || isSerializedError(error);
};

export const parseApiError = (error: unknown): string => {
  if (isApiError(error) && error.data?.message) {
    return error.data.message;
  }

  if (isSerializedError(error) && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
