import { useCallback } from 'react';
import { ApiSuccessResponse, Tool } from '@app/types';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { validateVariableName } from '@app/utils/namespace';
import { useActiveTool } from './useActiveTool';
import { ReferenceUpdate, useToolUpdateReference } from './useToolUpdateReference';
import { useEnqueueSnackbar } from './useEnqueueSnackbar';
import { useToolElementNames } from './useToolElementNames';

type HookArgs = {
  prevName: string;
  extendUpdate: (newName: string, update: ReferenceUpdate) => void;
  onSuccess: (newName: string, response: ApiSuccessResponse<Tool>) => void;
};

export const useBaseElementUpdateName = ({ prevName, extendUpdate, onSuccess }: HookArgs) => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const { updateTool } = useActiveTool();

  const { elementNames } = useToolElementNames();
  const createReferenceUpdate = useToolUpdateReference();

  const validateName = useCallback(
    (newName: string) => {
      const validateVariableError = validateVariableName(newName);
      if (validateVariableError) {
        return validateVariableError;
      }

      if (elementNames.includes(newName)) {
        return `A component or action with the name "${newName}" already exists`;
      }

      return undefined;
    },
    [elementNames]
  );

  const updateName = useCallback(
    async (newName: string) => {
      const errorMessage = validateName(newName);
      if (errorMessage) {
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        });
        return;
      }

      const update = createReferenceUpdate(prevName, newName);
      extendUpdate(newName, update);

      const response = await updateTool(update);
      if (!isSuccessfulApiResponse(response)) {
        return;
      }

      onSuccess(newName, response);
    },
    [
      validateName,
      createReferenceUpdate,
      prevName,
      extendUpdate,
      updateTool,
      onSuccess,
      enqueueSnackbar,
    ]
  );

  return updateName;
};
