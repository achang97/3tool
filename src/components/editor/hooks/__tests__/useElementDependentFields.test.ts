import { ActionType, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActiveTool } from '../useActiveTool';
import { useElementDependentFields } from '../useElementDependentFields';

jest.mock('../useActiveTool');

describe('useElementDependentFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array if there are no dependent fields', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [
          {
            type: ComponentType.Button,
            name: 'button1',
            data: {
              button: {
                text: 'text',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [],
      },
    }));

    const { result } = renderHook(() => useElementDependentFields('button1'));
    expect(result.current).toEqual([]);
  });

  it('returns dependencies from dynamic fields', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [
          {
            type: ComponentType.Button,
            name: 'button1',
            data: {
              button: {
                text: '{{ button1.text }} {{ button1.disabled }}',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [],
      },
    }));

    const { result } = renderHook(() => useElementDependentFields('button1'));
    expect(result.current).toEqual(['button1.text']);
  });

  it('returns dependencies from JavaScript fields', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [
          {
            type: ComponentType.Button,
            name: 'button1',
            data: {
              button: {
                text: 'text',
              },
            },
            eventHandlers: [],
          },
        ],
        actions: [
          {
            type: ActionType.Javascript,
            name: 'action1',
            data: {
              javascript: {
                code: 'return button1.text',
              },
            },
            eventHandlers: [],
          },
        ],
      },
    }));

    const { result } = renderHook(() => useElementDependentFields('button1'));
    expect(result.current).toEqual(['action1.code']);
  });
});
