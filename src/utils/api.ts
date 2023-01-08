import { ApiError } from '@app/types';
import { SerializedError } from '@reduxjs/toolkit';

export const parseApiError = (
  error: ApiError | SerializedError
): string | undefined => {
  if ('data' in error) {
    return error.data?.message ?? 'Something went wrong. Please try again.';
  }

  return error.message;
};
