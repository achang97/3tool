import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { EventHandlerEditor } from '@app/components/editor/common/EventHandlerEditor';
import { useEventHandlerGridProps } from '@app/components/editor/hooks/useEventHandlerGridProps';
import { EventHandlerData } from '@app/components/editor/utils/eventHandlers';
import { EVENT_HANDLER_DATA_TEMPLATES } from '@app/constants';
import {
  BaseComponentInspectorProps,
  ComponentEvent,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import { Add } from '@mui/icons-material';
import { Box, Button, Menu } from '@mui/material';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useCallback, useState, useRef, useMemo } from 'react';

export type InspectorEventHandlersProps = {
  label: string;
  name: string;
  eventHandlers: EventHandler<ComponentEvent>[];
  eventOptions: ComponentEvent[];
  onChange: BaseComponentInspectorProps['onChangeEventHandlers'];
};

export const InspectorEventHandlers = ({
  label,
  name,
  eventHandlers,
  eventOptions,
  onChange,
}: InspectorEventHandlersProps) => {
  const [activeIndex, setActiveIndex] = useState<number>();
  const dataGridRef = useRef<HTMLDivElement>(null);

  const { rows, columns, components } = useEventHandlerGridProps({
    eventHandlers,
    onChange,
  });

  const activeEventHandler = useMemo(() => {
    return typeof activeIndex === 'number'
      ? eventHandlers[activeIndex]
      : undefined;
  }, [activeIndex, eventHandlers]);

  const handleRowClick = useCallback(
    ({ row }: GridRowParams<EventHandlerData>) => {
      setActiveIndex(row.id);
    },
    []
  );

  const handleCreateEventHandler = useCallback(async () => {
    const newEventHandler: EventHandler<ComponentEvent> = {
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

  const handleMenuClose = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const handleUpdateEventHandler = useCallback(
    (update: RecursivePartial<EventHandler<ComponentEvent>>) => {
      const newEventHandlers = eventHandlers.map((eventHandler) =>
        eventHandler === activeEventHandler
          ? _.merge({}, activeEventHandler, update)
          : eventHandler
      );
      onChange(newEventHandlers);
    },
    [activeEventHandler, eventHandlers, onChange]
  );

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column' }}
      data-testid="inspector-event-handlers"
    >
      <FormFieldLabel label={label} sx={{ marginBottom: 0.5 }} />
      <DataGrid
        rows={rows}
        columns={columns}
        components={components}
        onRowClick={handleRowClick}
        sx={{ gridRow: { cursor: 'pointer' } }}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {activeEventHandler && (
          <EventHandlerEditor
            name={`${name}.eventHandlers[${activeIndex}]`}
            eventOptions={eventOptions}
            onChange={handleUpdateEventHandler}
            eventHandler={activeEventHandler}
          />
        )}
      </Menu>
    </Box>
  );
};
