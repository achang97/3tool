import _ from 'lodash';
import { useMemo } from 'react';
import { utils } from '../utils/public';
import { useActionFunctions } from './useActionFunctions';
import { useActiveTool } from './useActiveTool';
import { useBaseEvalArgs } from './useBaseEvalArgs';

export const useEvalArgs = () => {
  const { tool, evalDataValuesMap } = useActiveTool();
  const baseEvalArgs = useBaseEvalArgs(tool);
  const actionFunctions = useActionFunctions();

  const dynamicEvalArgs = useMemo(() => {
    return _.merge({}, baseEvalArgs, evalDataValuesMap);
  }, [baseEvalArgs, evalDataValuesMap]);

  const staticEvalArgs = useMemo(() => {
    return _.merge({}, dynamicEvalArgs, actionFunctions, { utils });
  }, [actionFunctions, dynamicEvalArgs]);

  return { dynamicEvalArgs, staticEvalArgs };
};
