import { useEffect } from 'react';
import { useActionExecute } from './useActionExecute';
import { useActionQueue } from './useActionQueue';

export const useActionQueueExecutor = () => {
  const { actionQueue, dequeueAction } = useActionQueue();
  const executeAction = useActionExecute();

  useEffect(() => {
    const dequeueAndExecute = async () => {
      const actionQueueElement = dequeueAction();
      if (actionQueueElement) {
        const { action, onExecute } = actionQueueElement;
        const result = await executeAction(action);
        onExecute(result);
      }
    };

    dequeueAndExecute();
  }, [actionQueue, executeAction, dequeueAction]);
};
