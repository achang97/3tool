import {
  GLOBAL_LIBRARIES,
  COMPONENT_INPUT_TEMPLATES,
  ACTION_RESULT_TEMPLATE,
} from '@app/constants';
import { useAppSelector } from '@app/redux/hooks';
import { Tool } from '@app/types';
import _ from 'lodash';
import { useMemo } from 'react';
import { readAsModule } from '../utils/codemirror';

export const GLOBAL_LIBRARY_MAP = _.chain(GLOBAL_LIBRARIES)
  .keyBy('importName')
  .mapValues(({ library, isModule }) => {
    return isModule ? readAsModule(library) : library;
  })
  .value();

export const useBaseEvalArgs = (tool: Tool) => {
  const { componentInputs, actionResults } = useAppSelector(
    (state) => state.activeTool
  );

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

  const evalArgs = useMemo(() => {
    return _.merge(
      {},
      GLOBAL_LIBRARY_MAP,
      defaultActionResults,
      defaultComponentInputs,
      componentInputs,
      actionResults
    );
  }, [
    actionResults,
    componentInputs,
    defaultComponentInputs,
    defaultActionResults,
  ]);

  return evalArgs;
};
