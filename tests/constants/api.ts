import { ApiErrorResponse, ApiSuccessResponse } from '@app/types';

export const mockApiSuccessResponse: ApiSuccessResponse = {
  data: {},
};

export const mockApiErrorResponse: ApiErrorResponse = {
  error: {
    status: 400,
    data: {
      message: 'Error Message',
    },
  },
};
