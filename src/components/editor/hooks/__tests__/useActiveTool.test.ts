import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { ActiveToolContext } from '../../contexts/ActiveToolContext';
import { useActiveTool } from '../useActiveTool';

const mockContextValue = 'context-value';

jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useContext: jest.fn(() => mockContextValue),
}));

describe('useActiveTool', () => {
  it('returns context value of ActiveToolContext', () => {
    const { result } = renderHook(useActiveTool);
    expect(useContext).toHaveBeenCalledWith(ActiveToolContext);
    expect(result.current).toEqual(mockContextValue);
  });
});
