import { Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockComponentLayout } from '@tests/constants/data';
import { useComponentDataDepGraph } from '../useComponentDataDepGraph';

describe('useComponentDataDepGraph', () => {
  it('returns DepGraph instance from multiple components', () => {
    const { result } = renderHook(() =>
      useComponentDataDepGraph([
        {
          name: 'button1',
          type: ComponentType.Button,
          layout: mockComponentLayout,
          data: {
            button: {
              text: '{{ textInput1.value }}',
              disabled: '{{ button1.loading }}{{ textInput1.defaultValue }}',
            },
          },
        },
        {
          name: 'textInput1',
          type: ComponentType.TextInput,
          layout: mockComponentLayout,
          data: {
            textInput: {
              defaultValue: '{{ textInput1.value }}',
            },
          },
        },
      ] as Component[])
    );

    expect(result.current.dependenciesOf('button1.text')).toEqual([
      'textInput1.value',
    ]);
    expect(result.current.dependenciesOf('button1.disabled')).toEqual([
      'button1.loading',
      'textInput1.value',
      'textInput1.defaultValue',
    ]);
    expect(result.current.dependenciesOf('textInput1.defaultValue')).toEqual([
      'textInput1.value',
    ]);
  });

  it('returns DepGraph instance with invalid property names', () => {
    const { result } = renderHook(() =>
      useComponentDataDepGraph([
        {
          name: 'button1',
          type: ComponentType.Button,
          layout: mockComponentLayout,
          data: {
            button: {
              text: '{{ button1.asdfasdf }}',
            },
          },
        },
      ] as Component[])
    );

    expect(result.current.dependenciesOf('button1.text')).toEqual([
      'button1.asdfasdf',
    ]);
  });

  it('returns DepGraph instance with fields as dependencies of parent', () => {
    const { result } = renderHook(() =>
      useComponentDataDepGraph([
        {
          name: 'button1',
          type: ComponentType.Button,
          layout: mockComponentLayout,
          data: {
            button: {
              text: '',
            },
          },
        },
      ] as Component[])
    );

    expect(result.current.dependenciesOf('button1')).toEqual(['button1.text']);
  });

  it('returns DepGraph instance with object dependencies', () => {
    const { result } = renderHook(() =>
      useComponentDataDepGraph([
        {
          name: 'table1',
          type: ComponentType.Table,
          layout: mockComponentLayout,
          data: {
            table: {
              columnHeaderNames: {
                id: 'test',
              },
            },
          },
        },
      ] as unknown as Component[])
    );

    expect(result.current.dependenciesOf('table1')).toEqual([
      'table1.columnHeaderNames.id',
      'table1.columnHeaderNames',
    ]);
    expect(result.current.dependenciesOf('table1.columnHeaderNames')).toEqual([
      'table1.columnHeaderNames.id',
    ]);
  });

  it('returns DepGraph instance with array dependencies', () => {
    const { result } = renderHook(() =>
      useComponentDataDepGraph([
        {
          name: 'button1',
          type: ComponentType.Button,
          layout: mockComponentLayout,
          data: {
            button: {
              text: '{{ table1.columnHeaderNamesByIndex[0].test }}',
            },
          },
        },
        {
          name: 'table1',
          type: ComponentType.Table,
          layout: mockComponentLayout,
          data: {
            table: {
              columnHeaderNamesByIndex: [{ test: 1 }],
            },
          },
        },
      ] as unknown as Component[])
    );

    expect(result.current.dependenciesOf('button1.text')).toEqual([
      'table1.columnHeaderNamesByIndex[0].test',
      'table1.columnHeaderNamesByIndex[0]',
      'table1.columnHeaderNamesByIndex',
    ]);
  });
});
