import {
  Action,
  ActionType,
  Component,
  ComponentEvent,
  ComponentType,
  EventHandlerType,
} from '@app/types';
import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import { useActiveTool } from '../useActiveTool';
import { useToolUpdateReference } from '../useToolUpdateReference';

jest.mock('../useActiveTool');

describe('useToolUpdateReference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates references in components', () => {
    const mockComponents = [
      {
        name: 'button1',
        type: ComponentType.Button,
        data: {
          button: {
            text: '{{ button1.text }}',
          },
        },
        eventHandlers: [
          {
            event: ComponentEvent.Click,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionId: '{{ button1.text }}',
              },
            },
          },
        ],
      },
    ] as unknown as Component[];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: mockComponents,
        actions: [],
      },
    }));

    const { result } = renderHook(() => useToolUpdateReference());
    expect(result.current('button1', 'newButton').components).toEqual([
      _.merge(mockComponents[0], {
        data: {
          button: {
            text: '{{ newButton.text }}',
          },
        },
        eventHandlers: [
          {
            data: {
              action: {
                actionId: '{{ newButton.text }}',
              },
            },
          },
        ],
      }),
    ]);
  });

  it('updates references in actions', () => {
    const mockActions = [
      {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'return action1.text',
          },
        },
        eventHandlers: [
          {
            event: ComponentEvent.Click,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionId: '{{ action1.text }}',
              },
            },
          },
        ],
      },
    ] as unknown as Action[];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [],
        actions: mockActions,
      },
    }));

    const { result } = renderHook(() => useToolUpdateReference());
    expect(result.current('action1', 'newAction').actions).toEqual([
      _.merge(mockActions[0], {
        data: {
          javascript: {
            code: 'return newAction.text',
          },
        },
        eventHandlers: [
          {
            data: {
              action: {
                actionId: '{{ newAction.text }}',
              },
            },
          },
        ],
      }),
    ]);
  });
});
