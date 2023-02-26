import { useAppSelector } from '@app/redux/hooks';
import { renderHook } from '@testing-library/react';
import { GLOBAL_LIBRARY_MAP, useBaseEvalArgs } from '../useBaseEvalArgs';

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

describe('useBaseEvalArgs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('includes entries from global libraries', () => {
    const { result } = renderHook(() => useBaseEvalArgs());
    expect(result.current).toMatchObject(GLOBAL_LIBRARY_MAP);
  });

  it('includes entries from component inputs', () => {
    const mockComponentInputs = {
      textInput1: {
        value: 'hello',
      },
    };
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      componentInputs: mockComponentInputs,
    }));

    const { result } = renderHook(() => useBaseEvalArgs());
    expect(result.current).toMatchObject(mockComponentInputs);
  });

  it('includes entries from action results', () => {
    const mockActionResults = {
      action1: {
        data: 'hello',
        error: new Error('Error message'),
      },
    };
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      actionResults: mockActionResults,
    }));

    const { result } = renderHook(() => useBaseEvalArgs());
    expect(result.current).toMatchObject(mockActionResults);
  });
});
