import { InspectorEventHandlers } from '@app/components/editor/common/InspectorEventHandlers';
import { updateFocusedAction } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { ActionEvent, EventHandler } from '@app/types';
import { Box } from '@mui/material';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';

type ResponseHandlerEditorProps = {
  name: string;
  eventHandlers: EventHandler<ActionEvent>[];
};

export const ResponseHandlerEditor = ({
  name,
  eventHandlers,
}: ResponseHandlerEditorProps) => {
  const dispatch = useAppDispatch();

  const handleUpdateEventHandlers = useCallback(
    (event: ActionEvent, newEventHandlers: EventHandler[]) => {
      const unchangedEventHandlers = eventHandlers.filter(
        (eventHandler) => eventHandler.event !== event
      );
      dispatch(
        updateFocusedAction({
          eventHandlers: [...unchangedEventHandlers, ...newEventHandlers],
        })
      );
    },
    [dispatch, eventHandlers]
  );

  const groupedEventHandlers = useMemo(() => {
    const groups = _.groupBy(eventHandlers, 'event');
    return {
      [ActionEvent.Success]: groups[ActionEvent.Success] ?? [],
      [ActionEvent.Error]: groups[ActionEvent.Error] ?? [],
    };
  }, [eventHandlers]);

  return (
    <Box
      data-testid="response-handler-editor"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <InspectorEventHandlers
        label="Success handlers"
        name={name}
        eventHandlers={groupedEventHandlers[ActionEvent.Success]}
        onChange={(newEventHandlers) =>
          handleUpdateEventHandlers(ActionEvent.Success, newEventHandlers)
        }
        eventOptions={[ActionEvent.Success]}
        placeholder="Trigger actions, control components, or call other APIs in response to action success."
        menuPosition="top"
        hideColumnHeaders
        hideEventColumn
        testId="action-success-handlers"
      />
      <InspectorEventHandlers
        label="Error handlers"
        name={name}
        eventHandlers={groupedEventHandlers[ActionEvent.Error]}
        onChange={(newEventHandlers) =>
          handleUpdateEventHandlers(ActionEvent.Error, newEventHandlers)
        }
        eventOptions={[ActionEvent.Error]}
        placeholder="Trigger actions, control components, or call other APIs in response to action failure."
        menuPosition="top"
        hideColumnHeaders
        hideEventColumn
        testId="action-error-handlers"
      />
    </Box>
  );
};
