import { ACTION_CONFIGS } from '@app/constants';
import { useEffect, useMemo, useState } from 'react';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { useActionExecute } from './useActionExecute';
import { useActiveTool } from './useActiveTool';

export const useActionMountExecute = () => {
  const { tool } = useActiveTool();
  const { data: resources } = useGetResourcesQuery('');

  const executeAction = useActionExecute();
  const [hasExecuted, setHasExecuted] = useState(false);

  const readActions = useMemo(() => {
    return tool.actions.filter((action) => ACTION_CONFIGS[action.type].mode === 'read');
  }, [tool]);

  useEffect(() => {
    if (!hasExecuted && resources) {
      readActions.forEach((action) => executeAction(action));
      setHasExecuted(true);
    }
  }, [executeAction, readActions, resources, hasExecuted]);

  return hasExecuted;
};
