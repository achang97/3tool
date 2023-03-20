import _ from 'lodash';
import { useMemo } from 'react';
import { utils } from '../utils/public';
import { useActionMethods } from './useActionMethods';
import { useActiveTool } from './useActiveTool';
import { useBaseEvalArgs } from './useBaseEvalArgs';

export const useEvalArgs = () => {
  const { tool, evalDataValuesMap } = useActiveTool();
  const baseEvalArgs = useBaseEvalArgs(tool);
  const actionMethods = useActionMethods();

  const dynamicEvalArgs = useMemo(() => {
    return _.merge({}, baseEvalArgs, evalDataValuesMap);
  }, [baseEvalArgs, evalDataValuesMap]);

  const staticEvalArgs = useMemo(() => {
    return _.merge({}, dynamicEvalArgs, actionMethods, { utils });
  }, [actionMethods, dynamicEvalArgs]);

  return { dynamicEvalArgs, staticEvalArgs };
};
