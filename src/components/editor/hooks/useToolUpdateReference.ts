import { Tool } from '@app/types';
import { useCallback } from 'react';
import { useActiveTool } from './useActiveTool';
import { useElementUpdateReference } from './useElementUpdateReference';

export type ReferenceUpdate = Pick<Tool, 'components' | 'actions'>;

export const useToolUpdateReference = () => {
  const { tool } = useActiveTool();
  const updateElementReference = useElementUpdateReference();

  const createReferenceUpdate = useCallback(
    (prevName: string, newName: string): ReferenceUpdate => {
      return {
        components: tool.components.map((component) =>
          updateElementReference(component, prevName, newName)
        ),
        actions: tool.actions.map((action) =>
          updateElementReference(action, prevName, newName)
        ),
      };
    },
    [tool.actions, tool.components, updateElementReference]
  );

  return createReferenceUpdate;
};
