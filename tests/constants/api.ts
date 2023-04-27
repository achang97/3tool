export const createMockApiSuccessResponse = <T>(data: T) => {
  const promise = Promise.resolve({ data });
  return {
    ...promise,
    unwrap: () => Promise.resolve(data),
  };
};

export const createMockApiErrorResponse = (error: unknown) => {
  const promise = Promise.resolve({ error });
  return {
    ...promise,
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
