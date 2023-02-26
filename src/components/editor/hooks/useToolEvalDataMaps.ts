import { Tool } from '@app/types';
import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { DepGraph } from 'dependency-graph';
import { evalDynamicExpression, EvalResult } from '../utils/eval';
import { useBaseEvalArgs } from './useBaseEvalArgs';
import { useToolFlattenedElements } from './useToolFlattenedElements';

type HookArgs = {
  tool: Tool;
  dataDepGraph: DepGraph<string>;
};

type HookReturnType = {
  evalDataMap: ToolEvalDataMap;
  evalDataValuesMap: ToolEvalDataValuesMap;
};

export type ToolEvalDataMap = Record<string, Record<string, EvalResult>>;
export type ToolEvalDataValuesMap = Record<string, Record<string, unknown>>;

export const useToolEvalDataMaps = ({
  tool,
  dataDepGraph,
}: HookArgs): HookReturnType => {
  const baseEvalArgs = useBaseEvalArgs();
  const elements = useToolFlattenedElements({
    tool,
    includePrefix: true,
    onlyLeaves: true,
  });

  const elementMap = useMemo(() => {
    return _.chain(elements).map('fields').flatten().keyBy('name').value();
  }, [elements]);

  const getNodeEvalResult = useCallback(
    (nodeName: string, evalArgs: Record<string, unknown>) => {
      const element = _.get(elementMap, nodeName);
      if (!element || typeof element.value !== 'string') {
        return undefined;
      }
      if (element.isJavascript) {
        return {
          parsedExpression: element.value,
          value: element.value,
        };
      }
      return evalDynamicExpression(element.value, element.evalType, evalArgs);
    },
    [elementMap]
  );

  const evalMaps = useMemo(() => {
    const evalDataMap: ToolEvalDataMap = {};
    const evalDataValuesMap: ToolEvalDataValuesMap = {};
    const evalArgs = baseEvalArgs;

    dataDepGraph.overallOrder().forEach((nodeName) => {
      const evalResult = getNodeEvalResult(nodeName, evalArgs);

      if (!evalResult) {
        return;
      }

      _.set(evalDataMap, nodeName, evalResult);
      _.set(evalDataValuesMap, nodeName, evalResult.value);
      _.set(evalArgs, nodeName, evalResult.value);
    });

    return {
      evalDataMap,
      evalDataValuesMap,
    };
  }, [baseEvalArgs, dataDepGraph, getNodeEvalResult]);

  return evalMaps;
};
