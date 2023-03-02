import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { ActionQueueContext } from '../../contexts/ActionQueueContext';
import { useActionQueue } from '../useActionQueue';

const mockContextValue = 'context-value';

jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useContext: jest.fn(() => mockContextValue),
}));

describe('useActionQueue', () => {
  it('returns context value of ActionQueueContext', () => {
    const { result } = renderHook(useActionQueue);
    expect(useContext).toHaveBeenCalledWith(ActionQueueContext);
    expect(result.current).toEqual(mockContextValue);
  });
});
