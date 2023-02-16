import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { ApiSuccessResponse, Tool } from '@app/types';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { useActiveTool } from './useActiveTool';
import {
  ReferenceUpdate,
  useElementReferenceUpdate,
} from './useElementReferenceUpdate';

type HookArgs = {
  prevName: string;
  extendUpdate: (newName: string, update: ReferenceUpdate) => void;
  onSuccess: (newName: string, response: ApiSuccessResponse<Tool>) => void;
};

export const useUpdateElementName = ({
  prevName,
  extendUpdate,
  onSuccess,
}: HookArgs) => {
  const dispatch = useAppDispatch();
  const { tool, updateTool } = useActiveTool();
  const createElementReferenceUpdate = useElementReferenceUpdate(prevName);

  const currentNames = useMemo(() => {
    return _.concat(
      _.map(tool.components, 'name'),
      _.map(tool.actions, 'name')
    );
  }, [tool.actions, tool.components]);

  const validateName = useCallback(
    (newName: string) => {
      if (!newName.match(/^[\w_$]+$/)) {
        return 'Name can only contain letters, numbers, _, or $';
      }

      if (currentNames.includes(newName)) {
        return `A component or action with the name "${newName}" already exists`;
      }

      return '';
    },
    [currentNames]
  );

  const handleSubmitName = useCallback(
    async (newName: string) => {
      const errorMessage = validateName(newName);
      if (errorMessage) {
        dispatch(
          setSnackbarMessage({
            type: 'error',
            message: errorMessage,
          })
        );
        return;
      }

      const update = createElementReferenceUpdate(newName);
      extendUpdate(newName, update);

      const response = await updateTool(update);
      if (!isSuccessfulApiResponse(response)) {
        return;
      }

      onSuccess(newName, response);
    },
    [
      validateName,
      createElementReferenceUpdate,
      extendUpdate,
      updateTool,
      onSuccess,
      dispatch,
    ]
  );

  return handleSubmitName;
};
