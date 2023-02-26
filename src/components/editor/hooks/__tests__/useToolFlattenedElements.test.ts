import { Action, Component, Tool } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useElementFlattenFields } from '../useElementFlattenFields';
import { useToolFlattenedElements } from '../useToolFlattenedElements';

const mockFlattenFields = jest.fn((element: Action | Component) => ({
  name: element.name,
  fields: [],
}));

jest.mock('../useElementFlattenFields', () => ({
  useElementFlattenFields: jest.fn(() => mockFlattenFields),
}));

describe('useToolFlattenedElements', () => {
  it('passes includePrefix and onlyLeaves to useElementFlattenFields', () => {
    renderHook(() =>
      useToolFlattenedElements({
        tool: { actions: [], components: [] } as unknown as Tool,
        includePrefix: true,
        onlyLeaves: true,
      })
    );
    expect(useElementFlattenFields).toHaveBeenCalledWith({
      includePrefix: true,
      onlyLeaves: true,
    });
  });

  it('returns flattened elements from actions', () => {
    const mockActions = [{ name: 'action1' }, { name: 'action2' }] as Action[];
    const { result } = renderHook(() =>
      useToolFlattenedElements({
        tool: {
          actions: mockActions,
          components: [],
        } as unknown as Tool,
        includePrefix: true,
        onlyLeaves: true,
      })
    );
    expect(result.current).toEqual(mockActions.map(mockFlattenFields));
  });

  it('returns flattened elements from components', () => {
    const mockComponents = [
      { name: 'button1' },
      { name: 'button2' },
    ] as Component[];
    const { result } = renderHook(() =>
      useToolFlattenedElements({
        tool: {
          actions: [],
          components: mockComponents,
        } as unknown as Tool,
        includePrefix: true,
        onlyLeaves: true,
      })
    );
    expect(result.current).toEqual(mockComponents.map(mockFlattenFields));
  });
});
