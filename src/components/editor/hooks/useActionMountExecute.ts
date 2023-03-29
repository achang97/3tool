import { ACTION_CONFIGS } from '@app/constants';
import { useEffect, useMemo, useRef } from 'react';
import { useActionExecute } from './useActionExecute';
import { useActiveTool } from './useActiveTool';

export const useActionMountExecute = () => {
  const { tool } = useActiveTool();
  const executeAction = useActionExecute();
  const isMounted = useRef(false);

  const readActions = useMemo(() => {
    return tool.actions.filter(
      (action) => ACTION_CONFIGS[action.type].mode === 'read'
    );
  }, [tool]);

  useEffect(() => {
    if (!isMounted.current) {
      readActions.forEach((action) => executeAction(action));
    }

    isMounted.current = true;
  }, [executeAction, readActions, isMounted]);
};
