import { Tool } from '@app/types';
import { DepGraph, DepGraphCycleError } from 'dependency-graph';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { parseDepCycle } from '../utils/elements';
import { parseDynamicTermVariables } from '../utils/javascript';
import { useToolFlattenedElements } from './useToolFlattenedElements';

type HookReturnType = {
  dataDepGraph: DepGraph<string>;
  dataDepCycles: Record<string, string[]>;
};

export const useToolDataDepGraph = (tool: Tool): HookReturnType => {
  const elements = useToolFlattenedElements({
    tool,
    onlyLeaves: false,
    includePrefix: true,
  });

  const elementNames = useMemo(() => {
    return _.map(elements, 'name');
  }, [elements]);

  const addNodes = useCallback(
    (graph: DepGraph<string>) => {
      elements.forEach((element) => {
        graph.addNode(element.name);

        element.fields.forEach((field) => {
          if (!field.parent) {
            return;
          }

          graph.addNode(field.name);
          graph.addNode(field.parent);

          graph.addDependency(element.name, field.name);
          graph.addDependency(field.parent, field.name);
        });
      });
    },
    [elements]
  );

  const addDependencies = useCallback(
    (graph: DepGraph<string>) => {
      elements.forEach((element) => {
        element.fields
          .filter((field) => field.isLeaf && !field.isJavascript)
          .forEach((field) => {
            const elementReferences = parseDynamicTermVariables(
              field.value,
              elementNames
            );

            elementReferences.forEach((elementReference) => {
              if (!graph.hasNode(elementReference)) {
                graph.addNode(elementReference);
              }
              graph.addDependency(field.name, elementReference);
            });
          });
      });
    },
    [elementNames, elements]
  );

  const circularDepGraph = useMemo(() => {
    const graph = new DepGraph<string>({ circular: true });

    addNodes(graph);
    addDependencies(graph);

    return graph;
  }, [addDependencies, addNodes]);

  const acyclicDepGraph = useMemo(() => {
    // NOTE: We're leveraging a "bug" with the dependency-graph package where clone
    // doesn't copy over the original circular property. In the future, we may have
    // to explicitly construct a new graph.
    return circularDepGraph.clone();
  }, [circularDepGraph]);

  const dataDepCycles = useMemo(() => {
    const paths: Record<string, string[]> = {};

    elements.forEach((element) => {
      element.fields
        .filter((field) => field.isLeaf)
        .forEach((field) => {
          try {
            acyclicDepGraph.dependenciesOf(field.name);
          } catch (e) {
            if (e instanceof DepGraphCycleError) {
              paths[field.name] = parseDepCycle(e.cyclePath);
            }
          }
        });
    });

    return paths;
  }, [acyclicDepGraph, elements]);

  return { dataDepGraph: circularDepGraph, dataDepCycles };
};
