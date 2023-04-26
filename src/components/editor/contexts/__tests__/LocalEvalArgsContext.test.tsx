import { screen, render, renderHook } from '@testing-library/react';
import { ReactElement, useContext } from 'react';
import { LocalEvalArgsContext, LocalEvalArgsProvider } from '../LocalEvalArgsContext';

describe('LocalEvalArgsContext', () => {
  it('renders children', () => {
    const mockChildren = 'children';
    render(<LocalEvalArgsProvider args={{}}>{mockChildren}</LocalEvalArgsProvider>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('returns default state', () => {
    const { result } = renderHook(() => useContext(LocalEvalArgsContext));
    expect(result.current).toEqual({ args: {} });
  });

  it('returns args and error', async () => {
    const mockArgs = { test: 4 };
    const mockError = 'error';
    const { result } = renderHook(() => useContext(LocalEvalArgsContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <LocalEvalArgsProvider args={mockArgs} error={mockError}>
          {children}
        </LocalEvalArgsProvider>
      ),
    });
    expect(result.current.args).toEqual(mockArgs);
    expect(result.current.error).toEqual(mockError);
  });
});
