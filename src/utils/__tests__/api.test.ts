import { ApiError } from '@app/types';
import { SerializedError } from '@reduxjs/toolkit';
import { isSuccessfulApiResponse, parseApiError } from '../api';

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

  describe('isSuccessfulApiResponse', () => {
    it('returns false if response is undefined', () => {
      const result = isSuccessfulApiResponse(undefined);
      expect(result).toEqual(false);
    });

    it('returns true if data field is in response', () => {
      const result = isSuccessfulApiResponse({ data: 'hello' });
      expect(result).toEqual(true);
    });

    it('returns false if data field is not in response', () => {
      const result = isSuccessfulApiResponse({
        error: {
          status: 400,
          data: { message: 'Error Message ' },
        },
      });
      expect(result).toEqual(false);
    });
  });
});
