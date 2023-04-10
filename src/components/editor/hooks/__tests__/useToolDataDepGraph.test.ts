import {
  ActionEvent,
  ActionType,
  ComponentEvent,
  ComponentType,
  EventHandlerType,
  Tool,
} from '@app/types';
import { renderHook } from '@testing-library/react';
import { useToolDataDepGraph } from '../useToolDataDepGraph';

describe('useToolDataDepGraph', () => {
  describe('dataDepGraph', () => {
    it('returns DepGraph instance with fields as dependencies of parent', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '',
                },
              },
              eventHandlers: [],
            },
          ],
          actions: [],
        } as unknown as Tool)
      );
      expect(result.current.dataDepGraph.directDependenciesOf('button1')).toEqual([
        'button1.text',
        'button1.eventHandlers',
      ]);
    });

    it('returns DepGraph instance with invalid property names', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '{{ button1.asdfasdf }}',
                },
              },
              eventHandlers: [],
            },
          ],
          actions: [],
        } as unknown as Tool)
      );
      expect(result.current.dataDepGraph.directDependenciesOf('button1.text')).toEqual([
        'button1.asdfasdf',
      ]);
    });

    it('returns DepGraph instance without invalid element names', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '{{ invalidButton.asdfasdf }}',
                },
              },
              eventHandlers: [],
            },
          ],
          actions: [],
        } as unknown as Tool)
      );
      expect(result.current.dataDepGraph.directDependenciesOf('button1.text')).toEqual([]);
    });

    it('returns DepGraph instance without JavaScript field dependencies', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '',
                },
              },
              eventHandlers: [],
            },
          ],
          actions: [
            {
              name: 'action1',
              type: ActionType.Javascript,
              data: {
                javascript: {
                  code: 'return button1.text',
                },
              },
              eventHandlers: [],
            },
          ],
        } as unknown as Tool)
      );
      expect(result.current.dataDepGraph.directDependenciesOf('action1.code')).toEqual([]);
    });

    it('returns DepGraph instance from multiple elements', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '{{ action1.code }}',
                },
              },
              eventHandlers: [
                {
                  event: ComponentEvent.Click,
                  type: EventHandlerType.Action,
                  data: {
                    action: {
                      actionName: '{{ button1.text }}',
                    },
                  },
                },
              ],
            },
          ],
          actions: [
            {
              name: 'action1',
              type: ActionType.Javascript,
              data: {
                javascript: {
                  code: 'code',
                },
              },
              eventHandlers: [
                {
                  event: ActionEvent.Success,
                  type: EventHandlerType.Action,
                  data: {
                    action: {
                      actionName: '{{ button1.eventHandlers[0].actionName }}',
                    },
                  },
                },
              ],
            },
          ],
        } as unknown as Tool)
      );

      expect(result.current.dataDepGraph.directDependenciesOf('button1.text')).toEqual([
        'action1.code',
      ]);
      expect(
        result.current.dataDepGraph.directDependenciesOf('button1.eventHandlers[0].actionName')
      ).toEqual(['button1.text']);
      expect(result.current.dataDepGraph.directDependenciesOf('action1.code')).toEqual([]);
      expect(
        result.current.dataDepGraph.directDependenciesOf('action1.eventHandlers[0].actionName')
      ).toEqual(['button1.eventHandlers']);
    });
  });

  describe('dataDepCles', () => {
    it('detects cycle paths', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '{{ button1.disabled }}',
                  disabled: '{{ button1.text }}',
                },
              },
              eventHandlers: [],
            },
          ],
          actions: [],
        } as unknown as Tool)
      );

      expect(result.current.dataDepCycles).toEqual({
        'button1.text': ['button1.text', 'button1.disabled', 'button1.text'],
        'button1.disabled': ['button1.disabled', 'button1.text', 'button1.disabled'],
      });
    });

    it('returns circular dep graph that can be safely operated on', () => {
      const { result } = renderHook(() =>
        useToolDataDepGraph({
          components: [
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {
                button: {
                  text: '{{ button1.disabled }}',
                  disabled: '{{ button1.text }}',
                },
              },
              eventHandlers: [],
            },
          ],
          actions: [],
        } as unknown as Tool)
      );
      expect(() => result.current.dataDepGraph.overallOrder()).not.toThrow();
    });
  });
});
