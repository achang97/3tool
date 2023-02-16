import { Component } from '@app/types';
import { DepGraph } from 'dependency-graph';
import _ from 'lodash';
import { useMemo } from 'react';
import { getComponentData } from '../utils/components';
import {
  flattenObjectFields,
  parseDynamicTermVariables,
} from '../utils/javascript';

type ComponentDataDepGraph = DepGraph<string>;

export const useComponentDataDepGraph = (
  components: Component[]
): ComponentDataDepGraph => {
  const depGraph = useMemo(() => {
    const graph = new DepGraph<string>({ circular: true });

    // Add nodes
    components.forEach((component) => {
      graph.addNode(component.name);

      flattenObjectFields(getComponentData(component), {
        prefix: component.name,
        onlyLeaves: false,
      }).forEach((field) => {
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
      flattenObjectFields(getComponentData(component), {
        prefix: component.name,
      }).forEach((field) => {
        const componentTokens = parseDynamicTermVariables(
          field.value,
          _.map(components, 'name')
        );

        componentTokens.forEach((componentToken) => {
          if (!graph.hasNode(componentToken)) {
            graph.addNode(componentToken);
          }
          graph.addDependency(field.name, componentToken);
        });
      });
    });

    return graph;
  }, [components]);

  return depGraph;
};
