import { renderHook } from '@testing-library/react';
import { useToolElementNames } from '../useToolElementNames';

const mockComponents = [{ name: 'button1' }, { name: 'button2' }];

const mockActions = [{ name: 'action1' }, { name: 'action2' }];

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
      actions: mockActions,
    },
  })),
}));

describe('useToolElementNames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns names from components', () => {
    const { result } = renderHook(() => useToolElementNames());
    expect(result.current).toContain('button1');
    expect(result.current).toContain('button2');
  });

  it('returns names from actions', () => {
    const { result } = renderHook(() => useToolElementNames());
    expect(result.current).toContain('action1');
    expect(result.current).toContain('action2');
  });
});
