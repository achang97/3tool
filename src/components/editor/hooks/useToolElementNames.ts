import _ from 'lodash';
import { useMemo } from 'react';
import { useActiveTool } from './useActiveTool';

export const useToolElementNames = (): string[] => {
  const { tool } = useActiveTool();

  const elementNames = useMemo(() => {
    return _.concat(
      _.map(tool.components, 'name'),
      _.map(tool.actions, 'name')
    );
  }, [tool.actions, tool.components]);

  return elementNames;
};
