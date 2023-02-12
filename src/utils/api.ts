import { ApiError, ApiResponse } from '@app/types';
import { SerializedError } from '@reduxjs/toolkit';

export const parseApiError = (error: ApiError | SerializedError): string => {
  if ('data' in error && error.data?.message) {
    return error.data.message;
  }

  if ('message' in error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

export const isSuccessfulApiResponse = (
  response: ApiResponse | undefined
): boolean => {
  return Boolean(response && 'data' in response);
};
