import { COMPONENT_INPUT_TEMPLATES, ACTION_RESULT_TEMPLATE } from '@app/constants';
import { Action, ActionType, Component, ComponentType, Tool } from '@app/types';
import { useAppSelector } from '@app/redux/hooks';
import { renderHook } from '@testing-library/react';
import { GLOBAL_CONSTANTS_MAP, GLOBAL_LIBRARY_MAP, useBaseEvalArgs } from '../useBaseEvalArgs';

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

describe('useBaseEvalArgs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('includes entries from global libraries', () => {
    const { result } = renderHook(() =>
      useBaseEvalArgs({ components: [], actions: [] } as unknown as Tool)
    );
    expect(result.current).toMatchObject(GLOBAL_LIBRARY_MAP);
  });

  it('includes entries from global constants', () => {
    const { result } = renderHook(() =>
      useBaseEvalArgs({ components: [], actions: [] } as unknown as Tool)
    );
    expect(result.current).toMatchObject(GLOBAL_CONSTANTS_MAP);
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

    const { result } = renderHook(() =>
      useBaseEvalArgs({ components: [], actions: [] } as unknown as Tool)
    );
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

    const { result } = renderHook(() =>
      useBaseEvalArgs({ components: [], actions: [] } as unknown as Tool)
    );
    expect(result.current).toMatchObject(mockActionResults);
  });

  it('includes entries from default component inputs', () => {
    const mockComponents = [{ name: 'textInput1', type: ComponentType.TextInput }] as Component[];

    const { result } = renderHook(() =>
      useBaseEvalArgs({ components: mockComponents } as unknown as Tool)
    );
    expect(result.current).toMatchObject({
      textInput1: COMPONENT_INPUT_TEMPLATES.textInput,
    });
  });

  it('includes entries from default action results', () => {
    const mockActions = [{ name: 'action1', type: ActionType.Javascript }] as Action[];

    const { result } = renderHook(() =>
      useBaseEvalArgs({
        actions: mockActions,
        components: [],
      } as unknown as Tool)
    );
    expect(result.current).toMatchObject({
      action1: ACTION_RESULT_TEMPLATE,
    });
  });
});
