import _ from 'lodash';
import { useMemo } from 'react';
import { parseDynamicTermVariables, parseVariables } from '../utils/javascript';
import { useActiveTool } from './useActiveTool';
import { useToolFlattenedElements } from './useToolFlattenedElements';

// TODO (Optimization): Bring this to the top level as a map?
export const useElementDependentFields = (name: string): string[] => {
  const { tool } = useActiveTool();
  const elements = useToolFlattenedElements({
    tool,
    onlyLeaves: true,
    includePrefix: true,
  });

  const dependents = useMemo(() => {
    return _.chain(elements)
      .map('fields')
      .flatten()
      .filter((field) => {
        const variables = field.isJavascript
          ? parseVariables(field.value, [name])
          : parseDynamicTermVariables(field.value, [name]);

        return variables.length !== 0;
      })
      .map('name')
      .value();
  }, [elements, name]);

  return dependents;
};
