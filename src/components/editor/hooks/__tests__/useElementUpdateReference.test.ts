import {
  Action,
  ActionEvent,
  ActionType,
  Component,
  ComponentEvent,
  ComponentType,
  EventHandlerType,
} from '@app/types';
import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import { useElementUpdateReference } from '../useElementUpdateReference';

describe('useElementUpdateReference', () => {
  it('does not update any fields if there are no references', async () => {
    const mockElement = {
      type: ComponentType.Button,
      name: 'button1',
      data: {
        button: {
          text: 'text',
        },
      },
      eventHandlers: [],
    } as unknown as Component;

    const { result } = renderHook(() => useElementUpdateReference());
    expect(result.current(mockElement, 'button1', 'newButton')).toEqual(
      mockElement
    );
  });

  describe('components', () => {
    it('updates component data references in dynamic fields', async () => {
      const mockElement = {
        type: ComponentType.Button,
        name: 'button1',
        data: {
          button: {
            text: '{{ button1.disabled }}',
          },
        },
        eventHandlers: [],
      } as unknown as Component;

      const { result } = renderHook(() => useElementUpdateReference());
      expect(result.current(mockElement, 'button1', 'newButton')).toEqual(
        _.merge(mockElement, {
          data: {
            button: {
              text: '{{ newButton.disabled }}',
            },
          },
        })
      );
    });

    it('updates component event handler references in dynamic fields', async () => {
      const mockElement = {
        type: ComponentType.Button,
        name: 'button1',
        data: {},
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
      } as unknown as Component;

      const { result } = renderHook(() => useElementUpdateReference());
      expect(result.current(mockElement, 'button1', 'newButton')).toEqual(
        _.merge(mockElement, {
          eventHandlers: [
            {
              data: {
                action: {
                  actionName: '{{ newButton.text }}',
                },
              },
            },
          ],
        })
      );
    });
  });

  describe('actions', () => {
    it('updates action data references in dynamic fields', async () => {
      const mockElement = {
        type: ActionType.SmartContractRead,
        name: 'action1',
        data: {
          smartContractRead: {
            resourceId: '{{ action1.text }}',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() => useElementUpdateReference());
      expect(result.current(mockElement, 'action1', 'newAction')).toEqual(
        _.merge(mockElement, {
          data: {
            smartContractRead: {
              resourceId: '{{ newAction.text }}',
            },
          },
        })
      );
    });

    it('updates action data references in JavaScript fields', async () => {
      const mockElement = {
        type: ActionType.Javascript,
        name: 'action1',
        data: {
          javascript: {
            code: 'return action1.text;',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() => useElementUpdateReference());
      expect(result.current(mockElement, 'action1', 'newAction')).toEqual(
        _.merge(mockElement, {
          data: {
            javascript: {
              code: 'return newAction.text;',
            },
          },
        })
      );
    });

    it('updates action event handler references in dynamic fields', async () => {
      const mockElement = {
        type: ActionType.Javascript,
        name: 'action1',
        data: {},
        eventHandlers: [
          {
            event: ActionEvent.Success,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: '{{ action1.text }}',
              },
            },
          },
        ],
      } as unknown as Action;

      const { result } = renderHook(() => useElementUpdateReference());
      expect(result.current(mockElement, 'action1', 'newAction')).toEqual(
        _.merge(mockElement, {
          eventHandlers: [
            {
              data: {
                action: {
                  actionName: '{{ newAction.text }}',
                },
              },
            },
          ],
        })
      );
    });
  });
});
