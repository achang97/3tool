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
  dequeueAction: async () => undefined,
};

export type ActionQueueElement = {
  action: Action;
  onExecute: (result: ActionResult) => void;
};

export type ActionQueueState = {
  actionQueue: ActionQueueElement[];
  enqueueAction: (
    action: Action,
    onExecute: ActionQueueElement['onExecute']
  ) => void;
  dequeueAction: () => Promise<ActionQueueElement | undefined>;
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

  const dequeueAction = useCallback((): Promise<
    ActionQueueElement | undefined
  > => {
    return new Promise((resolve) => {
      setActionQueue((prevActionQueue) => {
        if (prevActionQueue.length === 0) {
          resolve(undefined);
          return prevActionQueue;
        }

        const [action, ...newActionQueue] = prevActionQueue;
        resolve(action);
        return newActionQueue;
      });
    });
  }, []);

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
