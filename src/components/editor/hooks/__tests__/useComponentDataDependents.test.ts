import { Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { DepGraph } from 'dependency-graph';
import { useActiveTool } from '../useActiveTool';
import { useComponentDataDepGraph } from '../useComponentDataDepGraph';
import { useComponentDataDependents } from '../useComponentDataDependents';

jest.mock('../useActiveTool');

describe('useComponentDataDependents', () => {
  const generateDepGraph = (components: Component[]): DepGraph<string> => {
    const { result } = renderHook(() => useComponentDataDepGraph(components));
    return result.current;
  };

  it('gracefully handles cycle errors', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ button1.text }}',
          },
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('button1'));
    expect(result.current).toEqual([]);
  });

  it('ignores dependent fields within given component', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ button1.disabled }}',
            disabled: '',
          },
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('button1'));
    expect(result.current).toEqual([]);
  });

  it('ignores indirect dependents of given component', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ button2.text }}',
          },
        },
      },
      {
        type: ComponentType.Button,
        name: 'button2',
        data: {
          button: {
            text: '{{ button3.text }}',
          },
        },
      },
      {
        type: ComponentType.Button,
        name: 'button3',
        data: {
          button: {
            text: '',
          },
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('button3'));
    expect(result.current).toEqual(['button2.text']);
  });

  it('includes dependents without field name', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ button2 }}',
          },
        },
      },
      {
        type: ComponentType.Button,
        name: 'button2',
        data: {
          button: {},
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('button2'));
    expect(result.current).toEqual(['button1.text']);
  });

  it('resolves duplicate dependents', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ button2.text }} {{ button2.disabled }}',
          },
        },
      },
      {
        type: ComponentType.Button,
        name: 'button2',
        data: {
          button: {
            text: '',
            disabled: '',
          },
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('button2'));
    expect(result.current).toEqual(['button1.text']);
  });

  it('includes nested dependencies of given component', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ table1.columnHeaderNames.id }}',
          },
        },
      },
      {
        type: ComponentType.Table,
        name: 'table1',
        data: {
          table: {
            columnHeaderNames: {
              id: '',
            },
          },
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('table1'));
    expect(result.current).toEqual(['button1.text']);
  });

  it('returns array of dependent fields', () => {
    const depGraph = generateDepGraph([
      {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ table1.data }}',
          },
        },
      },
      {
        type: ComponentType.TextInput,
        name: 'textInput1',
        data: {
          textInput: {
            defaultValue: '{{ table1.data }}',
          },
        },
      },
      {
        type: ComponentType.Table,
        name: 'table1',
        data: {
          table: {
            data: '',
          },
        },
      },
    ] as Component[]);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      componentDataDepGraph: depGraph,
    }));

    const { result } = renderHook(() => useComponentDataDependents('table1'));
    expect(result.current).toEqual(['button1.text', 'textInput1.defaultValue']);
  });
});
