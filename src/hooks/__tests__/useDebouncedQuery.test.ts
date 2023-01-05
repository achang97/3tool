import { renderHook, waitFor } from '@testing-library/react';
import { ChangeEvent } from 'react';
import { act } from 'react-dom/test-utils';
import { useDebouncedQuery } from '../useDebouncedQuery';

describe('useDebouncedQuery', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('sets query value immediately', () => {
    const { result } = renderHook(useDebouncedQuery);
    act(() => {
      result.current.handleQueryChange({
        target: { value: 'a' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.query).toEqual('a');
    expect(result.current.debouncedQuery).toEqual('');
  });

  it('sets debouncedQuery value after delay', async () => {
    const mockDebounceTimeMs = 500;
    const { result } = renderHook(() => useDebouncedQuery(mockDebounceTimeMs));

    await act(() => {
      result.current.handleQueryChange({
        target: { value: 'a' },
      } as ChangeEvent<HTMLInputElement>);

      jest.advanceTimersByTime(mockDebounceTimeMs - 1);

      result.current.handleQueryChange({
        target: { value: 'ab' },
      } as ChangeEvent<HTMLInputElement>);

      jest.advanceTimersByTime(mockDebounceTimeMs - 1);

      result.current.handleQueryChange({
        target: { value: 'abc' },
      } as ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.query).toEqual('abc');
      expect(result.current.debouncedQuery).toEqual('');
    });

    await act(() => {
      jest.advanceTimersByTime(1);
    });
    await waitFor(() => {
      expect(result.current.debouncedQuery).toEqual('abc');
    });
  });
});
