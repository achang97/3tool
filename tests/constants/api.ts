export const createMockApiSuccessResponse = <T>(data: T) => {
  return {
    unwrap: () => data,
  };
};

export const createMockApiErrorResponse = (error: unknown) => {
  return {
    unwrap: () => {
      throw error as Error;
    },
  };
};

export const mockApiSuccessResponse = createMockApiSuccessResponse({});

export const mockApiErrorResponse = createMockApiErrorResponse({
  status: 400,
  data: {
    message: 'Error Message',
  },
});
