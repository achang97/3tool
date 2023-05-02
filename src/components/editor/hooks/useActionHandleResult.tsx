import { ActionResult } from '@app/constants';
import { setActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action, ActionEvent, ActionType, EventHandler } from '@app/types';
import { useCallback } from 'react';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { WaitForTransactionResult } from '@wagmi/core';
import { useEventHandlerExecute } from './useEventHandlerExecute';
import { LoopResult } from './useActionLoop';
import { ViewTransactionsButton } from '../common/ViewTransactionsButton';

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
        enqueueSnackbar(`${action.name} failed`, {
          variant: 'error',
        });
        executeEventHandlers(ActionEvent.Error, action.eventHandlers);
        return;
      }

      switch (action.type) {
        case ActionType.SmartContractWrite: {
          if (!result.data) {
            break;
          }

          const txReceipts = result.data as LoopResult<
            WaitForTransactionResult & { blockExplorerUrl: string }
          >;
          const txUrls = Array.isArray(txReceipts)
            ? txReceipts.map((receipt) => receipt.data.blockExplorerUrl)
            : [txReceipts.blockExplorerUrl];

          enqueueSnackbar(`${action.name} executed`, {
            variant: 'success',
            persist: true,
            action: <ViewTransactionsButton urls={txUrls} />,
          });
          break;
        }
        default: {
          enqueueSnackbar(`${action.name} executed`, {
            variant: 'success',
          });
          break;
        }
      }
      executeEventHandlers(ActionEvent.Success, action.eventHandlers);
    },
    [dispatch, enqueueSnackbar, executeEventHandlers]
  );

  return handleResult;
};
