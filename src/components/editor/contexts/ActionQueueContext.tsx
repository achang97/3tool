import { ActionResult } from '@app/constants';
import { Action } from '@app/types';
import React, {
  useCallback,
  createContext,
  ReactNode,
  useMemo,
  useState,
} from 'react';

const DEFAULT_STATE = {
  actionQueue: [],
  enqueueAction: () => '',
  dequeueAction: () => undefined,
};

type ActionQueueElement = {
  action: Action;
  onExecute: (result: ActionResult) => void;
};

export type ActionQueueState = {
  actionQueue: ActionQueueElement[];
  enqueueAction: (
    action: Action,
    onExecute: ActionQueueElement['onExecute']
  ) => void;
  dequeueAction: () => ActionQueueElement | undefined;
};

export const ActionQueueContext =
  createContext<ActionQueueState>(DEFAULT_STATE);

type ActionQueueProviderProps = {
  children?: ReactNode;
};

export const ActionQueueProvider = ({ children }: ActionQueueProviderProps) => {
  const [actionQueue, setActionQueue] = useState<ActionQueueElement[]>([]);

  const enqueueAction = useCallback(
    (action: Action, onExecute: ActionQueueElement['onExecute']) => {
      const newElement: ActionQueueElement = { action, onExecute };
      setActionQueue((prevQueue) => [...prevQueue, newElement]);
    },
    []
  );

  const dequeueAction = useCallback(() => {
    if (actionQueue.length === 0) {
      return undefined;
    }

    const action = actionQueue[0];
    setActionQueue(actionQueue.slice(1));
    return action;
  }, [actionQueue]);

  const contextValue = useMemo(() => {
    return {
      actionQueue,
      enqueueAction,
      dequeueAction,
    };
  }, [actionQueue, enqueueAction, dequeueAction]);

  return (
    <ActionQueueContext.Provider value={contextValue}>
      {children}
    </ActionQueueContext.Provider>
  );
};
