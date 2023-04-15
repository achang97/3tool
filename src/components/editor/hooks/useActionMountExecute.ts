import { ACTION_CONFIGS } from '@app/constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetResourcesQuery } from '@app/redux/services/resources';
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

  const readActions = useMemo(() => {
    return tool.actions.filter((action) => ACTION_CONFIGS[action.type].mode === 'read');
  }, [tool]);

  useEffect(() => {
    if (!hasExecuted.current && resources) {
      hasExecuted.current = true;
      setIsLoading(false);
      readActions.forEach((action) => executeAction(action));
    }
  }, [executeAction, readActions, resources, hasExecuted]);

  return { isLoading };
};
