import { COMPONENT_INPUT_TEMPLATES } from '@app/constants';
import { ACTION_RESULT_TEMPLATE } from '@app/constants/actions';
import { Action, ActionType, Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { utils } from '../../utils/public';
import { useActionFunctions } from '../useActionFunctions';
import { useActiveTool } from '../useActiveTool';
import { useBaseEvalArgs } from '../useBaseEvalArgs';
import { useEvalArgs } from '../useEvalArgs';

jest.mock('../useActiveTool');
jest.mock('../useBaseEvalArgs');
jest.mock('../useActionFunctions');

describe('useEvalArgs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      evalDataValuesMap: {},
    }));
    (useBaseEvalArgs as jest.Mock).mockImplementation(() => ({}));
  });

  describe('general', () => {
    it('includes entries from base eval args', () => {
      const mockBaseEvalArgs = {
        action1: {
          data: 'hello',
        },
      };
      (useBaseEvalArgs as jest.Mock).mockImplementation(() => mockBaseEvalArgs);

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject(mockBaseEvalArgs);
      expect(result.current.staticEvalArgs).toMatchObject(mockBaseEvalArgs);
    });

    it('includes entries from evaluated component data', () => {
      const mockElementEvalDataValuesMap = {
        button1: {
          text: 'hello',
        },
      };
      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: mockTool,
        evalDataValuesMap: mockElementEvalDataValuesMap,
      }));

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject(
        mockElementEvalDataValuesMap
      );
      expect(result.current.staticEvalArgs).toMatchObject(
        mockElementEvalDataValuesMap
      );
    });

    it('includes entries from default component inputs', () => {
      const mockComponents = [
        { name: 'textInput1', type: ComponentType.TextInput },
      ] as Component[];
      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: { components: mockComponents },
        evalDataValuesMap: {},
      }));

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject({
        textInput1: COMPONENT_INPUT_TEMPLATES.textInput,
      });
      expect(result.current.staticEvalArgs).toMatchObject({
        textInput1: COMPONENT_INPUT_TEMPLATES.textInput,
      });
    });

    it('includes entries from default action results', () => {
      const mockActions = [
        { name: 'action1', type: ActionType.Javascript },
      ] as Action[];
      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: { actions: mockActions },
        evalDataValuesMap: {},
      }));

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject({
        action1: ACTION_RESULT_TEMPLATE,
      });
      expect(result.current.staticEvalArgs).toMatchObject({
        action1: ACTION_RESULT_TEMPLATE,
      });
    });
  });

  describe('static', () => {
    it('includes entries from action functions', () => {
      const mockActionFunctions = {
        action1: {
          trigger: () => {},
        },
      };
      (useActionFunctions as jest.Mock).mockImplementation(
        () => mockActionFunctions
      );

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.staticEvalArgs).toMatchObject(mockActionFunctions);
    });

    it('includes entries from utils', () => {
      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.staticEvalArgs).toMatchObject({ utils });
    });
  });

  describe('dynamic', () => {
    it('does not include entries from action functions', () => {
      const mockActionFunctions = {
        action1: {
          trigger: () => {},
        },
      };
      (useActionFunctions as jest.Mock).mockImplementation(
        () => mockActionFunctions
      );

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).not.toMatchObject(
        mockActionFunctions
      );
    });

    it('does not include entries from utils', () => {
      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).not.toMatchObject({ utils });
    });
  });
});
