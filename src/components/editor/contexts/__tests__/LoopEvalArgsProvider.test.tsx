import { screen, act } from '@testing-library/react';
import { render, renderHook } from '@tests/utils/renderWithContext';
import { ReactElement } from 'react';
import { useLocalEvalArgs } from '../../hooks/useLocalEvalArgs';
import { DEBOUNCE_TIME_MS, LoopEvalArgsProvider } from '../LoopEvalArgsProvider';

describe('LoopEvalArgsProvider', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders children', () => {
    const mockChildren = 'children';
    render(<LoopEvalArgsProvider>{mockChildren}</LoopEvalArgsProvider>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('sets args to empty object if loop is not enabled', async () => {
    const { result } = renderHook(() => useLocalEvalArgs(), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <LoopEvalArgsProvider data={{ loopElements: '', loopEnabled: false }}>
          {children}
        </LoopEvalArgsProvider>
      ),
    });

    await act(() => {
      jest.advanceTimersByTime(DEBOUNCE_TIME_MS);
    });
    expect(result.current.args).toEqual({});
    expect(result.current.error).toEqual('');
  });

  it('sets args to empty object if loop code does not evaluate to array', async () => {
    const { result } = renderHook(() => useLocalEvalArgs(), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <LoopEvalArgsProvider data={{ loopElements: 'return 1', loopEnabled: true }}>
          {children}
        </LoopEvalArgsProvider>
      ),
    });

    await act(() => {
      jest.advanceTimersByTime(DEBOUNCE_TIME_MS);
    });
    expect(result.current.args).toEqual({});
    expect(result.current.error).toEqual(
      "Expected value of type array, received value of type 'number'"
    );
  });

  it('sets args to empty object if loop code throws error', async () => {
    const { result } = renderHook(() => useLocalEvalArgs(), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <LoopEvalArgsProvider data={{ loopElements: 'asdf', loopEnabled: true }}>
          {children}
        </LoopEvalArgsProvider>
      ),
    });

    await act(() => {
      jest.advanceTimersByTime(DEBOUNCE_TIME_MS);
    });
    expect(result.current.args).toEqual({});
    expect(result.current.error).toEqual('asdf is not defined');
  });

  it('sets args to first element of evaluated result of loop code', async () => {
    const { result } = renderHook(() => useLocalEvalArgs(), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <LoopEvalArgsProvider data={{ loopElements: 'return [1]', loopEnabled: true }}>
          {children}
        </LoopEvalArgsProvider>
      ),
    });

    await act(() => {
      jest.advanceTimersByTime(DEBOUNCE_TIME_MS);
    });
    expect(result.current.args).toEqual({ element: 1 });
    expect(result.current.error).toEqual('');
  });
});
