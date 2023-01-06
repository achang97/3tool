import { ApiError } from '@app/types/api';
import { SerializedError } from '@reduxjs/toolkit';
import { parseApiError } from '../api';

describe('api', () => {
  describe('parseApiError', () => {
    it('parses message from SerializedError', () => {
      const mockError: SerializedError = {
        message: 'Mock Error Message',
      };
      const result = parseApiError(mockError);
      expect(result).toEqual(mockError.message);
    });

    it('returns default error message if ApiError has no data', () => {
      const mockError: ApiError = {
        status: 400,
        data: null,
      };
      const result = parseApiError(mockError);
      expect(result).toEqual('Something went wrong. Please try again.');
    });

    it('parses message from ApiError', () => {
      const mockError: ApiError = {
        status: 400,
        data: {
          message: 'Mock Error Message',
        },
      };
      const result = parseApiError(mockError);
      expect(result).toEqual('Mock Error Message');
    });
  });
});
