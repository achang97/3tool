import _ from 'lodash';
import { useMemo } from 'react';
import { useActiveTool } from './useActiveTool';

type HookReturnType = {
  componentNames: string[];
  actionNames: string[];
  elementNames: string[];
};

export const useToolElementNames = (): HookReturnType => {
  const { tool } = useActiveTool();

  const componentNames = useMemo(() => {
    return _.map(tool.components, 'name');
  }, [tool.components]);

  const actionNames = useMemo(() => {
    return _.map(tool.actions, 'name');
  }, [tool.actions]);

  const elementNames = useMemo(() => {
    return _.concat(componentNames, actionNames);
  }, [actionNames, componentNames]);

  return { componentNames, actionNames, elementNames };
};
