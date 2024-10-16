import {
  EventHandlerData,
  formatEventHandlerEvent,
  renderEventHandlerType,
} from '@app/components/editor/utils/eventHandlers';
import { EventHandler } from '@app/types';
import { Delete } from '@mui/icons-material';
import { GridActionsCellItem, GridColDef, GridRowParams, GridRowsProp } from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';

type HookArgs = {
  eventHandlers: EventHandler[];
  onChange: (newEventHandlers: EventHandler[]) => void;
};

type HookReturnType = {
  rows: GridRowsProp<EventHandlerData>;
  columns: GridColDef<EventHandlerData>[];
};

export const useEventHandlerGridProps = ({ eventHandlers, onChange }: HookArgs): HookReturnType => {
  const handleDeleteEventHandler = useCallback(
    (id: number) => {
      onChange(eventHandlers.filter((_eventHandler, i) => i !== id));
    },
    [eventHandlers, onChange]
  );

  const rows: GridRowsProp<EventHandlerData> = useMemo(() => {
    return eventHandlers.map((eventHandler, i) => ({
      ...eventHandler,
      id: i,
    }));
  }, [eventHandlers]);

  const getRowActions = useCallback(
    (params: GridRowParams<EventHandlerData>) => {
      return [
        <GridActionsCellItem
          key="delete"
          icon={<Delete fontSize="inherit" data-testid="event-handler-delete-icon" />}
          label="Delete"
          onClick={() => handleDeleteEventHandler(params.row.id)}
          showInMenu
        />,
      ];
    },
    [handleDeleteEventHandler]
  );

  const columns: GridColDef<EventHandlerData>[] = useMemo(() => {
    return [
      {
        field: 'event',
        headerName: 'Event',
        valueFormatter: formatEventHandlerEvent,
        sortable: false,
        flex: 1,
      },
      {
        field: 'type',
        headerName: 'Effect',
        renderCell: renderEventHandlerType,
        sortable: false,
        flex: 2,
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: getRowActions,
        width: 10,
      },
    ];
  }, [getRowActions]);

  return { rows, columns };
};
