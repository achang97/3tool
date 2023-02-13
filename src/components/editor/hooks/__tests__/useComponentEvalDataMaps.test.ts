import { Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { DepGraph } from 'dependency-graph';
import { useComponentDataDepGraph } from '../useComponentDataDepGraph';
import { useComponentEvalDataMaps } from '../useComponentEvalDataMaps';

const mockComponentInputs = {
  textInput1: {
    value: 'hello',
  },
  table1: {
    selectedRows: [{ test: 1 }],
  },
};

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(() => ({
    componentInputs: mockComponentInputs,
  })),
}));

describe('useComponentEvalDataMaps', () => {
  const generateDepGraph = (components: Component[]): DepGraph<string> => {
    const { result } = renderHook(() => useComponentDataDepGraph(components));
    return result.current;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cycles', () => {
    it('returns error indicating elements in the cycle', () => {
      const mockComponents = [
        {
          type: ComponentType.Button,
          name: 'button1',
          data: {
            button: {
              text: '{{ button1.disabled }}',
              disabled: '{{ button1.text }}',
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.error).toEqual(
        new Error(
          'Dependency Cycle Found: button1.text → button1.disabled → button1.text'
        )
      );
    });

    it('evaluates fields by falling back to cyclic dependency ordering', () => {
      const mockComponents = [
        {
          type: ComponentType.Button,
          name: 'button1',
          data: {
            button: {
              text: '{{ button1.disabled }}',
              disabled: '{{ button1.text }}',
              loading: 'true',
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
        button1: {
          text: { parsedExpression: '', value: '' },
          disabled: { error: new Error('button1 is not defined') },
          loading: { parsedExpression: 'true', value: true },
        },
      });
      expect(result.current.componentEvalDataValuesMap).toEqual({
        button1: {
          text: '',
          disabled: undefined,
          loading: true,
        },
      });
    });
  });

  describe('error', () => {
    it('returns error for invalid fields on valid components', () => {
      const mockComponents = [
        {
          name: 'button1',
          type: ComponentType.Button,
          data: {
            button: {
              text: '{{ button1.invalidField }}',
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
        button1: {
          text: { error: new Error('button1 is not defined') },
        },
      });
      expect(result.current.componentEvalDataValuesMap).toEqual({
        button1: {
          text: undefined,
        },
      });
    });

    it('gracefully handles invalid JavaScript within dynamic terms', () => {
      const mockComponents = [
        {
          name: 'button1',
          type: ComponentType.Button,
          data: {
            button: {
              text: '{{ invalidJavascript }}',
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
        button1: {
          text: { error: new Error('invalidJavascript is not defined') },
        },
      });
      expect(result.current.componentEvalDataValuesMap).toEqual({
        button1: {
          text: undefined,
        },
      });
    });
  });

  describe('success', () => {
    it('does not populate input values in maps', () => {
      const mockComponents: Component[] = [];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({});
      expect(result.current.componentEvalDataValuesMap).toEqual({});
    });

    it('evaluates data fields dependent on input values', () => {
      const mockComponents = [
        {
          name: 'table1',
          type: ComponentType.Table,
          data: {
            table: {
              emptyMessage: '{{ table1.selectedRows[0].test }}',
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
        table1: {
          emptyMessage: { parsedExpression: '1', value: '1' },
        },
      });
      expect(result.current.componentEvalDataValuesMap).toEqual({
        table1: {
          emptyMessage: '1',
        },
      });
    });

    it('evaluates multi-step dependency chains', () => {
      const mockComponents = [
        {
          name: 'button1',
          type: ComponentType.Button,
          data: {
            button: {
              text: '{{ button2.text }}1',
            },
          },
        },
        {
          name: 'button2',
          type: ComponentType.Button,
          data: {
            button: {
              text: '{{ button3.text }}2',
            },
          },
        },
        {
          name: 'button3',
          type: ComponentType.Button,
          data: {
            button: {
              text: 'hello',
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
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
      expect(result.current.componentEvalDataValuesMap).toEqual({
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

    it('evaluates nested fields within objects', () => {
      const mockComponents = [
        {
          name: 'button1',
          type: ComponentType.Button,
          data: {
            button: {
              text: 'hello',
            },
          },
        },
        {
          name: 'table1',
          type: ComponentType.Table,
          data: {
            table: {
              columnHeaderNames: {
                id: '{{ button1.text }}',
              },
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
        button1: {
          text: { parsedExpression: 'hello', value: 'hello' },
        },
        table1: {
          columnHeaderNames: {
            id: { parsedExpression: 'hello', value: 'hello' },
          },
        },
      });
      expect(result.current.componentEvalDataValuesMap).toEqual({
        button1: {
          text: 'hello',
        },
        table1: {
          columnHeaderNames: {
            id: 'hello',
          },
        },
      });
    });

    it('evaluates nested fields within arrays', () => {
      const mockComponents = [
        {
          name: 'button1',
          type: ComponentType.Button,
          data: {
            button: {
              text: 'hello',
            },
          },
        },
        {
          name: 'table1',
          type: ComponentType.Table,
          data: {
            table: {
              columnHeadersByIndex: ['{{ button1.text }}'],
            },
          },
        },
      ] as Component[];
      const componentDataDepGraph = generateDepGraph(mockComponents);

      const { result } = renderHook(() =>
        useComponentEvalDataMaps({
          components: mockComponents,
          componentDataDepGraph,
        })
      );

      expect(result.current.componentEvalDataMap).toEqual({
        button1: {
          text: { parsedExpression: 'hello', value: 'hello' },
        },
        table1: {
          columnHeadersByIndex: [{ parsedExpression: 'hello', value: 'hello' }],
        },
      });
      expect(result.current.componentEvalDataValuesMap).toEqual({
        button1: {
          text: 'hello',
        },
        table1: {
          columnHeadersByIndex: ['hello'],
        },
      });
    });
  });
});
