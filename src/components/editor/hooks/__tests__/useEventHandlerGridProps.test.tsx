import {
  ActionMethod,
  ComponentEvent,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import { render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import {
  formatEventHandlerEvent,
  renderEventHandlerType,
} from '../../utils/eventHandlers';
import { useEventHandlerGridProps } from '../useEventHandlerGridProps';

const mockEventHandlers: EventHandler<ComponentEvent>[] = [
  {
    event: ComponentEvent.Click,
    type: EventHandlerType.Action,
    data: {
      action: {
        actionName: 'action1',
        method: ActionMethod.Trigger,
      },
    },
  },
];
const mockHandleChange = jest.fn();

describe('useEventHandlerGridProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rows', () => {
    it('returns rows with id as index', () => {
      const { result } = renderHook(() =>
        useEventHandlerGridProps({
          eventHandlers: mockEventHandlers,
          onChange: mockHandleChange,
        })
      );

      expect(result.current.rows).toEqual([
        {
          ...mockEventHandlers[0],
          id: 0,
        },
      ]);
    });
  });

  describe('columns', () => {
    it('returns event label as 1st column', () => {
      const { result } = renderHook(() =>
        useEventHandlerGridProps({
          eventHandlers: mockEventHandlers,
          onChange: mockHandleChange,
        })
      );

      expect(result.current.columns[0]).toEqual({
        field: 'event',
        headerName: 'Event',
        valueFormatter: formatEventHandlerEvent,
        sortable: false,
        flex: 1,
      });
    });

    it('returns event handler type as 2nd column', () => {
      const { result } = renderHook(() =>
        useEventHandlerGridProps({
          eventHandlers: mockEventHandlers,
          onChange: mockHandleChange,
        })
      );

      expect(result.current.columns[1]).toEqual({
        field: 'type',
        headerName: 'Effect',
        renderCell: renderEventHandlerType,
        sortable: false,
        flex: 2,
      });
    });

    it('renders menu button with delete action', () => {
      const { result } = renderHook(() =>
        useEventHandlerGridProps({
          eventHandlers: mockEventHandlers,
          onChange: mockHandleChange,
        })
      );
      expect(result.current.columns[2]).toEqual({
        field: 'actions',
        type: 'actions',
        getActions: expect.any(Function),
        width: 10,
      });
    });

    describe('getActions', () => {
      it('returns array with delete action', async () => {
        const { result } = renderHook(() =>
          useEventHandlerGridProps({
            eventHandlers: mockEventHandlers,
            onChange: mockHandleChange,
          })
        );

        const mockGridRowParams = {
          row: {
            id: 0,
          },
        };
        // @ts-ignore getActions should be defined
        const actions = result.current.columns[2].getActions(mockGridRowParams);
        expect(actions).toHaveLength(1);

        const renderResult = render(
          <div>
            {actions.map((action: ReactNode, i: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i}>{action}</div>
            ))}
          </div>
        );

        const deleteButton = renderResult.getByText('Delete');
        await userEvent.click(deleteButton);
        expect(mockHandleChange).toHaveBeenCalledWith([]);
      });
    });
  });
});
