import _ from 'lodash';
import { useMemo } from 'react';
import { utils } from '../utils/public';
import { useActionMethods } from './useActionMethods';
import { useActiveTool } from './useActiveTool';
import { useBaseEvalArgs } from './useBaseEvalArgs';
import { useLocalEvalArgs } from './useLocalEvalArgs';

export const useEvalArgs = () => {
  const { tool, evalDataValuesMap } = useActiveTool();
  const baseEvalArgs = useBaseEvalArgs(tool);
  const localEvalArgs = useLocalEvalArgs();

  const actionMethods = useActionMethods();

  const dynamicEvalArgs = useMemo(() => {
    return {
      ..._.merge({}, baseEvalArgs, evalDataValuesMap),
      // NOTE: We spread the args here to overwrite the values instead of merging them.
      ...localEvalArgs,
    };
  }, [baseEvalArgs, evalDataValuesMap, localEvalArgs]);

  const staticEvalArgs = useMemo(() => {
    return _.merge({}, dynamicEvalArgs, actionMethods, { utils });
  }, [actionMethods, dynamicEvalArgs]);

  return { dynamicEvalArgs, staticEvalArgs };
};
