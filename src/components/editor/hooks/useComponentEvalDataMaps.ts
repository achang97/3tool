import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component, ComponentFieldType } from '@app/types';
import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { DepGraph, DepGraphCycleError } from 'dependency-graph';
import { useAppSelector } from '@app/redux/hooks';
import { getComponentData, parseComponentFieldName } from '../utils/components';
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

  const getOverallOrder = useCallback(() => {
    try {
      // NOTE: We're leveraging a "bug" with the dependency-graph package where clone
      // doesn't copy over the original circular property. In the future, we may have
      // to explicitly construct a new graph.
      return componentDataDepGraph.clone().overallOrder();
    } catch (e) {
      if (e instanceof DepGraphCycleError) {
        setError(
          new Error(
            `Dependency Cycle Found: ${e.cyclePath.slice(1).join(' → ')}`
          )
        );
        return componentDataDepGraph.overallOrder();
      }
    }

    return [];
  }, [componentDataDepGraph]);

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

  const evalMaps = useMemo(() => {
    const componentEvalDataMap: ComponentEvalDataMap = {};
    const componentEvalDataValuesMap: ComponentEvalDataValuesMap = {};
    const evalArgs = _.merge({}, componentInputs);

    const overallOrder = getOverallOrder();
    overallOrder.forEach((nodeName) => {
      const evalResult = getNodeEvalResult(nodeName, evalArgs);

      if (!evalResult) {
        return;
      }

      _.set(componentEvalDataMap, nodeName, evalResult);
      _.set(componentEvalDataValuesMap, nodeName, evalResult.value);
      _.set(evalArgs, nodeName, evalResult.value);
    });

    return {
      componentEvalDataMap,
      componentEvalDataValuesMap,
    };
  }, [componentInputs, getOverallOrder, getNodeEvalResult]);

  return {
    ...evalMaps,
    error,
  };
};
