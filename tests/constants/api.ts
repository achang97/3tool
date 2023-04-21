export const createMockApiSuccessResponse = <T>(data: T) => {
  return {
    unwrap: () => Promise.resolve(data),
  };
};

export const createMockApiErrorResponse = (error: unknown) => {
  return {
    unwrap: () => Promise.reject(error),
  };
};

export const mockApiSuccessResponse = createMockApiSuccessResponse({});

export const mockApiErrorResponse = createMockApiErrorResponse({
  status: 400,
  data: {
    message: 'Error Message',
  },
});

export const mockApiError = {
  status: 400,
  data: {
    message: 'Error message',
  },
};
