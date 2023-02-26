import { ActionType, ComponentType, Tool } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useBaseEvalArgs } from '../useBaseEvalArgs';
import { useToolDataDepGraph } from '../useToolDataDepGraph';
import { useToolEvalDataMaps } from '../useToolEvalDataMaps';

jest.mock('../useBaseEvalArgs');

describe('useToolEvalDataMaps', () => {
  const renderTestHook = (tool: Tool) => {
    const { result } = renderHook(() => useToolDataDepGraph(tool));
    const { dataDepGraph } = result.current;

    return renderHook(() =>
      useToolEvalDataMaps({
        tool,
        dataDepGraph,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useBaseEvalArgs as jest.Mock).mockImplementation(() => ({}));
  });

  describe('error', () => {
    it('returns error for invalid fields on valid elements', () => {
      const mockTool = {
        components: [
          {
            name: 'button1',
            type: ComponentType.Button,
            data: {
              button: {
                text: '{{ button1.invalidField }}',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [],
      } as unknown as Tool;
      const { result } = renderTestHook(mockTool);

      expect(result.current.evalDataMap).toEqual({
        button1: {
          text: { error: new Error('button1 is not defined') },
        },
      });
      expect(result.current.evalDataValuesMap).toEqual({
        button1: {
          text: undefined,
        },
      });
    });

    it('gracefully handles invalid JavaScript within dynamic terms', () => {
      const mockTool = {
        components: [
          {
            name: 'button1',
            type: ComponentType.Button,
            data: {
              button: {
                text: '{{ invalidJavascript }}',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [],
      } as unknown as Tool;
      const { result } = renderTestHook(mockTool);

      expect(result.current.evalDataMap).toEqual({
        button1: {
          text: { error: new Error('invalidJavascript is not defined') },
        },
      });
      expect(result.current.evalDataValuesMap).toEqual({
        button1: {
          text: undefined,
        },
      });
    });
  });

  describe('success', () => {
    it('evaluates data fields dependent on base eval args', () => {
      (useBaseEvalArgs as jest.Mock).mockImplementation(() => ({
        table1: {
          selectedRows: [{ test: 1 }],
        },
      }));
      const mockTool = {
        components: [
          {
            name: 'table1',
            type: ComponentType.Table,
            data: {
              table: {
                emptyMessage: '{{ table1.selectedRows[0].test }}',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [],
      } as unknown as Tool;
      const { result } = renderTestHook(mockTool);

      expect(result.current.evalDataMap).toEqual({
        table1: {
          emptyMessage: { parsedExpression: '1', value: '1' },
        },
      });
      expect(result.current.evalDataValuesMap).toEqual({
        table1: {
          emptyMessage: '1',
        },
      });
    });

    it('does not evaluate JavaScript fields as dynamic text', () => {
      const mockTool = {
        components: [],
        actions: [
          {
            name: 'action1',
            type: ActionType.Javascript,
            data: {
              javascript: {
                code: 'return {{ button1.text }}',
              },
            },
            eventHandlers: [],
          },
        ],
      } as unknown as Tool;
      const { result } = renderTestHook(mockTool);

      expect(result.current.evalDataMap).toEqual({
        action1: {
          code: {
            parsedExpression: 'return {{ button1.text }}',
            value: 'return {{ button1.text }}',
          },
        },
      });
      expect(result.current.evalDataValuesMap).toEqual({
        action1: {
          code: 'return {{ button1.text }}',
        },
      });
    });

    it('evaluates multi-step dependency chains', () => {
      const mockTool = {
        components: [
          {
            name: 'button1',
            type: ComponentType.Button,
            data: {
              button: {
                text: '{{ button2.text }}1',
              },
            },
            eventHandlers: [],
          },
          {
            name: 'button2',
            type: ComponentType.Button,
            data: {
              button: {
                text: '{{ button3.text }}2',
              },
            },
            eventHandlers: [],
          },
          {
            name: 'button3',
            type: ComponentType.Button,
            data: {
              button: {
                text: 'hello',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [],
      } as unknown as Tool;
      const { result } = renderTestHook(mockTool);

      expect(result.current.evalDataMap).toEqual({
        button1: {
          text: { parsedExpression: 'hello21', value: 'hello21' },
        },
        button2: {
          text: { parsedExpression: 'hello2', value: 'hello2' },
        },
        button3: {
          text: { parsedExpression: 'hello', value: 'hello' },
        },
      });
      expect(result.current.evalDataValuesMap).toEqual({
        button1: {
          text: 'hello21',
        },
        button2: {
          text: 'hello2',
        },
        button3: {
          text: 'hello',
        },
      });
    });
  });
});
