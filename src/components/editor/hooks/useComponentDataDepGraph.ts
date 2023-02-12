import { Component } from '@app/types';
import { DepGraph } from 'dependency-graph';
import { useMemo } from 'react';
import { parseDynamicTerms } from '../utils/codeMirror';
import {
  flattenComponentDataFields,
  getComponentTokens,
} from '../utils/components';

type ComponentDataDepGraph = DepGraph<string>;

export const useComponentDataDepGraph = (
  components: Component[]
): ComponentDataDepGraph => {
  const depGraph = useMemo(() => {
    const graph = new DepGraph<string>();

    // Add nodes
    components.forEach((component) => {
      graph.addNode(component.name);

      flattenComponentDataFields(component).forEach((field) => {
        if (!field.parent) {
          return;
        }

        graph.addNode(field.name);
        graph.addNode(field.parent);

        graph.addDependency(component.name, field.name);
        graph.addDependency(field.parent, field.name);
      });
    });

    // Add dependencies
    components.forEach((component) => {
      flattenComponentDataFields(component).forEach((field) => {
        if (!field.isLeaf) {
          return;
        }

        const dynamicTerms = parseDynamicTerms(field.value);

        dynamicTerms.forEach((dynamicTerm) => {
          const componentTokens = getComponentTokens(
            dynamicTerm.expression,
            components
          );
          componentTokens.forEach((componentToken) => {
            if (!graph.hasNode(componentToken.name)) {
              graph.addNode(componentToken.name);
            }
            graph.addDependency(field.name, componentToken.name);
          });
        });
      });
    });

    return graph;
  }, [components]);

  return depGraph;
};
