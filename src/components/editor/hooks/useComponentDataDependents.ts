import { useMemo } from 'react';
import { parseComponentFieldName } from '../utils/components';
import { useActiveTool } from './useActiveTool';

export const useComponentDataDependents = (name: string): string[] => {
  const { componentDataDepGraph } = useActiveTool();

  const dependents = useMemo(() => {
    const uniqueDependents = new Set<string>();

    try {
      const componentFields = [
        name,
        ...componentDataDepGraph.directDependenciesOf(name),
      ];

      componentFields.forEach((field) => {
        componentDataDepGraph.directDependentsOf(field).forEach((dependent) => {
          const {
            componentName: dependentComponentName,
            fieldName: dependentFieldName,
          } = parseComponentFieldName(dependent);

          if (dependentComponentName === name || !dependentFieldName) {
            return;
          }

          uniqueDependents.add(dependent);
        });
      });
    } catch {
      // Do nothing
    }

    return [...uniqueDependents];
  }, [name, componentDataDepGraph]);

  return dependents;
};
