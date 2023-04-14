import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { LocalEvalArgsContext } from '../../contexts/LocalEvalArgsContext';
import { useLocalEvalArgs } from '../useLocalEvalArgs';

jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useContext: jest.fn(),
}));

describe('useLocalEvalArgs', () => {
  it('returns args from LocalEvalArgsContext', () => {
    const mockLocalArgs = { test: 5 };
    (useContext as jest.Mock).mockImplementation(() => ({
      args: mockLocalArgs,
    }));
    const { result } = renderHook(useLocalEvalArgs);
    expect(useContext).toHaveBeenCalledWith(LocalEvalArgsContext);
    expect(result.current).toEqual(mockLocalArgs);
  });
});
