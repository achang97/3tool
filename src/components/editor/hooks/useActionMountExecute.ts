import { ACTION_CONFIGS } from '@app/constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { EventHandlerType } from '@app/types';
import _ from 'lodash';
import { useActionExecute } from './useActionExecute';
import { useActiveTool } from './useActiveTool';

type HookReturnType = {
  isLoading: boolean;
};

export const useActionMountExecute = (): HookReturnType => {
  const { tool } = useActiveTool();
  const { data: resources } = useGetResourcesQuery('');

  const executeAction = useActionExecute();
  const hasExecuted = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const actionsToExecute = useMemo(() => {
    const readActions = tool.actions.filter(
      (action) => ACTION_CONFIGS[action.type].mode === 'read'
    );
    const readEventHandlerActions = _.flatten(
      readActions.map((action) => {
        return action.eventHandlers
          .filter((eventHandler) => eventHandler.type === EventHandlerType.Action)
          .map((eventHandler) => eventHandler.data.action?.actionName);
      })
    );
    return readActions.filter((action) => !readEventHandlerActions.includes(action.name));
  }, [tool]);

  useEffect(() => {
    if (!hasExecuted.current && resources) {
      hasExecuted.current = true;
      setIsLoading(false);
      actionsToExecute.forEach((action) => executeAction(action));
    }
  }, [executeAction, actionsToExecute, resources, hasExecuted]);

  return { isLoading };
};
