import { useCallback, useMemo } from 'react';
import { getComponentData } from '../utils/components';
import {
  flattenObjectFields,
  parseDynamicTermVariables,
} from '../utils/javascript';
import { useActiveTool } from './useActiveTool';

export const useElementDependentFields = (name: string): string[] => {
  const { tool } = useActiveTool();

  const addComponentDependents = useCallback(
    (dependents: Set<string>) => {
      tool.components.forEach((component) => {
        if (component.name === name) {
          return;
        }

        flattenObjectFields(getComponentData(component), {
          prefix: component.name,
        }).forEach((field) => {
          const variables = parseDynamicTermVariables(field.value, [name]);
          if (variables.length !== 0) {
            dependents.add(field.name);
          }
        });
      });
    },
    [name, tool.components]
  );

  const dependents = useMemo(() => {
    const uniqueDependents = new Set<string>();

    // TODO: Add action dependents
    addComponentDependents(uniqueDependents);

    return [...uniqueDependents];
  }, [addComponentDependents]);

  return dependents;
};
