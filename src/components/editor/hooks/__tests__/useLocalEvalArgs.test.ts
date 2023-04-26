import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { LocalEvalArgsContext } from '../../contexts/LocalEvalArgsContext';
import { useLocalEvalArgs } from '../useLocalEvalArgs';

const mockContextValue = 'context-value';

jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useContext: jest.fn(() => mockContextValue),
}));

describe('useLocalEvalArgs', () => {
  it('returns value from LocalEvalArgsContext', () => {
    const { result } = renderHook(useLocalEvalArgs);
    expect(useContext).toHaveBeenCalledWith(LocalEvalArgsContext);
    expect(result.current).toEqual(mockContextValue);
  });
});
