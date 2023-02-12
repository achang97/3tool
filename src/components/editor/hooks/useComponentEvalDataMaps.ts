import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component, ComponentFieldType } from '@app/types';
import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { DepGraph } from 'dependency-graph';
import { useAppSelector } from '@app/redux/hooks';
import {
  getComponentData,
  parseComponentFieldName,
  parseDepGraphCycle,
} from '../utils/components';
import { evalExpression, EvalResult } from '../utils/eval';

type HookArgs = {
  components: Component[];
  componentDataDepGraph: DepGraph<string>;
};

type HookReturnType = {
  componentEvalDataMap: ComponentEvalDataMap;
  componentEvalDataValuesMap: ComponentEvalDataValuesMap;
  error?: Error;
};

export type ComponentEvalDataMap = Record<string, Record<string, EvalResult>>;
export type ComponentEvalDataValuesMap = Record<
  string,
  Record<string, unknown>
>;

export const useComponentEvalDataMaps = ({
  components,
  componentDataDepGraph,
}: HookArgs): HookReturnType => {
  const { componentInputs } = useAppSelector((state) => state.activeTool);

  const [error, setError] = useState<Error>();

  const componentMap = useMemo(() => {
    return _.keyBy(components, 'name');
  }, [components]);

  const getNodeEvalResult = useCallback(
    (nodeName: string, evalArgs: Record<string, unknown>) => {
      const { componentName, fieldName, rootFieldName } =
        parseComponentFieldName(nodeName);

      if (!fieldName || !rootFieldName) {
        return undefined;
      }

      const component = componentMap[componentName];
      const expression = _.get(getComponentData(component), fieldName);
      const rootFieldType = _.get(
        COMPONENT_DATA_TYPES[component.type],
        rootFieldName
      );

      if (!rootFieldType || typeof expression !== 'string') {
        return undefined;
      }

      const fieldType: ComponentFieldType | ComponentFieldType[] =
        rootFieldType !== 'nested' ? rootFieldType : 'any';

      return evalExpression(expression, fieldType, evalArgs);
    },
    [componentMap]
  );

  const handleError = useCallback((e: Error) => {
    const cycleElements = parseDepGraphCycle(e);
    if (cycleElements) {
      setError(
        new Error(`Dependency Cycle Found: ${cycleElements.join(' → ')}`)
      );
    } else {
      setError(e);
    }
  }, []);

  const evalMaps = useMemo(() => {
    const componentEvalDataMap: ComponentEvalDataMap = {};
    const componentEvalDataValuesMap: ComponentEvalDataValuesMap = _.mapValues(
      componentMap,
      () => ({})
    );
    const evalArgs = _.merge({}, componentEvalDataValuesMap, componentInputs);

    try {
      componentDataDepGraph.overallOrder().forEach((nodeName) => {
        const evalResult = getNodeEvalResult(nodeName, evalArgs);

        if (!evalResult) {
          return;
        }

        _.set(componentEvalDataMap, nodeName, evalResult);
        _.set(componentEvalDataValuesMap, nodeName, evalResult.value);
        _.set(evalArgs, nodeName, evalResult.value);
      });
    } catch (e) {
      handleError(e as Error);
    }

    return {
      componentEvalDataMap,
      componentEvalDataValuesMap,
    };
  }, [
    componentMap,
    componentInputs,
    componentDataDepGraph,
    getNodeEvalResult,
    handleError,
  ]);

  return {
    ...evalMaps,
    error,
  };
};
