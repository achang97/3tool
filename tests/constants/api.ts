import { ApiResponse } from '@app/types';

export const mockApiSuccessResponse: ApiResponse = {
  data: {},
};

export const mockApiErrorResponse: ApiResponse = {
  error: {
    status: 400,
    data: {
      message: 'Error Message',
    },
  },
};
