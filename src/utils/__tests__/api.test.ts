import { ApiError } from '@app/types';
import { SerializedError } from '@reduxjs/toolkit';
import { isApiError, isApiErrorResponse, isSerializedError, parseApiError } from '../api';

describe('api', () => {
  describe('isApiError', () => {
    it('returns false if object does not contain data object', () => {
      const result = isApiError({});
      expect(result).toEqual(false);
    });

    it('returns false if object contains empty data object', () => {
      const result = isApiError({ data: {} });
      expect(result).toEqual(false);
    });

    it('returns true if object contains data object with message', () => {
      const result = isApiError({ data: { message: '' } });
      expect(result).toEqual(true);
    });
  });

  describe('isSerializedError', () => {
    it('returns false if object does not contain message', () => {
      const result = isSerializedError({});
      expect(result).toEqual(false);
    });

    it('returns true if object contains message', () => {
      const result = isSerializedError({ message: '' });
      expect(result).toEqual(true);
    });
  });

  describe('isErrorApiResponse', () => {
    it('returns false if object is neither api error nor serialized error', () => {
      const result = isApiErrorResponse({});
      expect(result).toEqual(false);
    });

    it('returns true if object is api error', () => {
      const result = isApiErrorResponse({ data: { message: '' } });
      expect(result).toEqual(true);
    });

    it('returns true if object is serialized error', () => {
      const result = isApiErrorResponse({ message: '' });
      expect(result).toEqual(true);
    });
  });

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
