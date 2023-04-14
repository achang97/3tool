import { DataGridPlaceholder } from '@app/components/common/DataGridPlaceholder';
import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { EventHandlerEditor } from '@app/components/editor/common/EventHandlerEditor';
import { useEventHandlerGridProps } from '@app/components/editor/hooks/useEventHandlerGridProps';
import { EventHandlerData } from '@app/components/editor/utils/eventHandlers';
import { EVENT_HANDLER_DATA_TEMPLATES } from '@app/constants';
import { ActionEvent, ComponentEvent, EventHandler, EventHandlerType } from '@app/types';
import { Add } from '@mui/icons-material';
import { Box, Button, Menu, MenuProps } from '@mui/material';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useCallback, useState, useRef, useMemo } from 'react';

type Event = ActionEvent | ComponentEvent;

export type InspectorEventHandlersProps = {
  label?: string;
  placeholder: string;
  name?: string;
  eventHandlers: EventHandler[];
  eventOptions: Event[];
  onChange: (eventHandlers: EventHandler[]) => void;
  menuPosition: 'left' | 'top';
  hideEventColumn?: boolean;
  hideColumnHeaders?: boolean;
  isAutosaved?: boolean;
  testId?: string;
};

const DATA_GRID_HEADER_HEIGHT = 35;
const DATA_GRID_ROW_HEIGHT = 35;

export const InspectorEventHandlers = ({
  label,
  placeholder,
  name,
  eventHandlers,
  eventOptions,
  onChange,
  menuPosition,
  hideEventColumn,
  hideColumnHeaders,
  isAutosaved,
  testId = 'inspector-event-handlers',
}: InspectorEventHandlersProps) => {
  const [activeIndex, setActiveIndex] = useState<number>();
  const dataGridRef = useRef<HTMLDivElement>(null);

  const { rows, columns } = useEventHandlerGridProps({
    eventHandlers,
    onChange,
  });

  const NoRowsOverlay = useCallback(() => {
    return <DataGridPlaceholder>{placeholder}</DataGridPlaceholder>;
  }, [placeholder]);

  const menuPositionProps: Pick<MenuProps, 'anchorOrigin' | 'transformOrigin'> = useMemo(() => {
    if (menuPosition === 'left') {
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'right' },
      };
    }

    return {
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      transformOrigin: { vertical: 'bottom', horizontal: 'center' },
    };
  }, [menuPosition]);

  const activeEventHandler = useMemo(() => {
    return typeof activeIndex === 'number' ? eventHandlers[activeIndex] : undefined;
  }, [activeIndex, eventHandlers]);

  const handleRowClick = useCallback(({ row }: GridRowParams<EventHandlerData>) => {
    setActiveIndex(row.id);
  }, []);

  const handleMenuClose = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const handleCreateEventHandler = useCallback(async () => {
    const newEventHandler: EventHandler = {
      type: EventHandlerType.Action,
      event: eventOptions[0],
      data: {
        action: EVENT_HANDLER_DATA_TEMPLATES.action,
      },
    };
    const newEventHandlers = [...eventHandlers, newEventHandler];

    // NOTE: Ideally, we should check the return value of the debounced update, but it can return
    // undefined and make any checks inaccurate.
    onChange(newEventHandlers);
    setActiveIndex(newEventHandlers.length - 1);
  }, [eventOptions, onChange, eventHandlers]);

  const handleUpdateEventHandler = useCallback(
    (update: RecursivePartial<EventHandler>) => {
      const newEventHandlers = eventHandlers.map((eventHandler) =>
        eventHandler === activeEventHandler ? _.merge({}, activeEventHandler, update) : eventHandler
      );
      onChange(newEventHandlers);
    },
    [activeEventHandler, eventHandlers, onChange]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid={testId}>
      {label && <FormFieldLabel label={label} />}
      <DataGrid
        rows={rows}
        columns={columns}
        components={{ NoRowsOverlay }}
        columnVisibilityModel={{ event: !hideEventColumn }}
        onRowClick={handleRowClick}
        rowHeight={DATA_GRID_ROW_HEIGHT}
        headerHeight={hideColumnHeaders ? 0 : DATA_GRID_HEADER_HEIGHT}
        sx={{
          gridRow: { cursor: 'pointer' },
          '.MuiDataGrid-columnHeaders': hideColumnHeaders ? { visibility: 'hidden' } : undefined,
        }}
        autoHeight
        disableColumnMenu
        disableSelectionOnClick
        hideFooter
        ref={dataGridRef}
      />
      <Button
        onClick={handleCreateEventHandler}
        size="small"
        variant="text"
        startIcon={<Add fontSize="inherit" />}
        sx={{ marginTop: 1 }}
      >
        Add event handler
      </Button>
      <Menu
        open={!!activeEventHandler}
        anchorEl={dataGridRef.current}
        onClose={handleMenuClose}
        {...menuPositionProps}
      >
        {activeEventHandler && (
          <EventHandlerEditor
            name={`${name}.eventHandlers[${activeIndex}]`}
            eventOptions={eventOptions}
            onChange={handleUpdateEventHandler}
            eventHandler={activeEventHandler}
            isAutosaved={isAutosaved}
          />
        )}
      </Menu>
    </Box>
  );
};
