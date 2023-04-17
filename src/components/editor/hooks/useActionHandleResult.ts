import { ActionResult } from '@app/constants';
import { setActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action, ActionEvent, EventHandler } from '@app/types';
import { useCallback } from 'react';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { useEventHandlerExecute } from './useEventHandlerExecute';

export const useActionHandleResult = () => {
  const executeEventHandler = useEventHandlerExecute();
  const enqueueSnackbar = useEnqueueSnackbar();
  const dispatch = useAppDispatch();

  const executeEventHandlers = useCallback(
    (event: ActionEvent, eventHandlers: EventHandler<ActionEvent>[]) => {
      eventHandlers
        .filter((eventHandler) => eventHandler.event === event)
        .forEach((eventHandler) => executeEventHandler(eventHandler));
    },
    [executeEventHandler]
  );

  const handleResult = useCallback(
    (action: Action, result: ActionResult) => {
      dispatch(setActionResult({ name: action.name, result }));

      if (result.error) {
        enqueueSnackbar(`Failed to execute ${action.name}`, {
          variant: 'error',
        });
        executeEventHandlers(ActionEvent.Error, action.eventHandlers);
        return;
      }

      enqueueSnackbar(`Executed ${action.name}`, {
        variant: 'success',
      });
      executeEventHandlers(ActionEvent.Success, action.eventHandlers);
    },
    [dispatch, enqueueSnackbar, executeEventHandlers]
  );

  return handleResult;
};
