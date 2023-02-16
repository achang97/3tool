import { Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActiveTool } from '../useActiveTool';
import { useElementDependentFields } from '../useElementDependentFields';

jest.mock('../useActiveTool');

describe('useElementDependentFields', () => {
  describe('component data', () => {
    it('ignores dependent fields within given component', () => {
      const mockComponents = [
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
      ] as Component[];

      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: { components: mockComponents },
      }));

      const { result } = renderHook(() => useElementDependentFields('button1'));
      expect(result.current).toEqual([]);
    });

    it('resolves duplicate dependents', () => {
      const mockComponents = [
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
      ] as Component[];

      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: { components: mockComponents },
      }));

      const { result } = renderHook(() => useElementDependentFields('button2'));
      expect(result.current).toEqual(['button1.text']);
    });

    it('includes nested dependencies of other components', () => {
      const mockComponents = [
        {
          type: ComponentType.Button,
          name: 'button1',
          data: {
            button: {
              text: '',
            },
          },
        },
        {
          type: ComponentType.Table,
          name: 'table1',
          data: {
            table: {
              columnHeaderNames: {
                id: '{{ button1.text }}',
              },
            },
          },
        },
      ] as Component[];

      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: { components: mockComponents },
      }));

      const { result } = renderHook(() => useElementDependentFields('button1'));
      expect(result.current).toEqual(['table1.columnHeaderNames.id']);
    });
  });
});
