import { renderHook } from '@testing-library/react';
import { useActiveTool } from '../useActiveTool';
import { useToolElementNames } from '../useToolElementNames';

jest.mock('../useActiveTool');

describe('useToolElementNames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [],
        actions: [],
      },
    }));
  });

  it('returns names from components', () => {
    const mockComponents = [{ name: 'button1' }, { name: 'button2' }];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: mockComponents,
        actions: [],
      },
    }));

    const { result } = renderHook(() => useToolElementNames());
    expect(result.current.elementNames).toEqual(['button1', 'button2']);
    expect(result.current.componentNames).toEqual(['button1', 'button2']);
  });

  it('returns names from actions', () => {
    const mockActions = [{ name: 'action1' }, { name: 'action2' }];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [],
        actions: mockActions,
      },
    }));

    const { result } = renderHook(() => useToolElementNames());
    expect(result.current.elementNames).toEqual(['action1', 'action2']);
    expect(result.current.actionNames).toEqual(['action1', 'action2']);
  });
});
