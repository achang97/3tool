import { COMPONENT_INPUT_TEMPLATES } from '@app/constants';
import { ACTION_RESULT_TEMPLATE } from '@app/constants/actions';
import _ from 'lodash';
import { useMemo } from 'react';
import { useActiveTool } from './useActiveTool';
import { useBaseEvalArgs } from './useBaseEvalArgs';

export const useEvalArgs = () => {
  const baseEvalArgs = useBaseEvalArgs();

  const { tool, evalDataValuesMap } = useActiveTool();

  const defaultComponentInputs = useMemo(() => {
    return _.chain(tool.components)
      .keyBy('name')
      .mapValues((component) => COMPONENT_INPUT_TEMPLATES[component.type])
      .value();
  }, [tool.components]);

  const defaultActionResults = useMemo(() => {
    return _.chain(tool.actions)
      .keyBy('name')
      .mapValues(() => ACTION_RESULT_TEMPLATE)
      .value();
  }, [tool.actions]);

  const defaultComponentEvents = useMemo(() => {
    return _.chain(tool.components)
      .keyBy('name')
      .mapValues(() => ({ eventHandlers: [] }))
      .value();
  }, [tool.components]);

  const defaultActionEvents = useMemo(() => {
    return _.chain(tool.actions)
      .keyBy('name')
      .mapValues(() => ({ eventHandlers: [] }))
      .value();
  }, [tool.actions]);

  const evalArgs = useMemo(() => {
    return _.merge(
      {},
      defaultComponentInputs,
      defaultComponentEvents,
      defaultActionResults,
      defaultActionEvents,
      baseEvalArgs,
      evalDataValuesMap
    );
  }, [
    baseEvalArgs,
    evalDataValuesMap,
    defaultComponentInputs,
    defaultComponentEvents,
    defaultActionResults,
    defaultActionEvents,
  ]);

  return evalArgs;
};
