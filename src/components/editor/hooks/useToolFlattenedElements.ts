import { Tool } from '@app/types';
import _ from 'lodash';
import { useMemo } from 'react';
import { useElementFlattenFields } from './useElementFlattenFields';

type HookArgs = {
  tool: Tool;
  includePrefix: boolean;
  onlyLeaves: boolean;
};

export const useToolFlattenedElements = ({
  tool,
  includePrefix,
  onlyLeaves,
}: HookArgs) => {
  const flattenElement = useElementFlattenFields({
    includePrefix,
    onlyLeaves,
  });

  const elements = useMemo(() => {
    return _.concat(
      tool.components.map(flattenElement),
      tool.actions.map(flattenElement)
    );
  }, [flattenElement, tool.actions, tool.components]);

  return elements;
};
