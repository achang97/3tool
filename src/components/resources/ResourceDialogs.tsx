import {
  ResourceStackElement,
  popResource,
  updateResource,
} from '@app/redux/features/resourcesSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Resource, ResourceType } from '@app/types';
import { Box } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { EditResourceDialog } from './EditResourceDialog';
import { CreateResourceDialog } from './CreateResourceDialog';

export const ResourceDialogs = () => {
  const dispatch = useAppDispatch();
  const { resourceStack } = useAppSelector((state) => state.resources);

  const activeResourceElement = useMemo((): ResourceStackElement | undefined => {
    return resourceStack[0];
  }, [resourceStack]);

  const isBackButtonVisible = useMemo(() => {
    return resourceStack.length > 1;
  }, [resourceStack.length]);

  const handleChange = useCallback(
    (update: RecursivePartial<Resource>) => {
      dispatch(updateResource({ index: 0, update }));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (newResource: Resource) => {
      const baseResource = resourceStack[1]?.resource;

      if (
        newResource.type === ResourceType.Abi &&
        baseResource?.type === ResourceType.SmartContract
      ) {
        dispatch(
          updateResource({
            index: 1,
            update: {
              data: {
                smartContract: {
                  abiId: newResource._id,
                },
              },
            },
          })
        );
      }
    },
    [dispatch, resourceStack]
  );

  const handleDialogClose = useCallback(() => {
    dispatch(popResource());
  }, [dispatch]);

  const modal = useMemo(() => {
    switch (activeResourceElement?.type) {
      case 'create':
        return (
          <CreateResourceDialog
            resource={activeResourceElement.resource}
            isOpen
            isBackButtonVisible={isBackButtonVisible}
            onClose={handleDialogClose}
            onChange={handleChange}
            onCreate={handleCreate}
          />
        );
      case 'edit':
        return (
          <EditResourceDialog
            resource={activeResourceElement.resource}
            isOpen
            isBackButtonVisible={isBackButtonVisible}
            onClose={handleDialogClose}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  }, [activeResourceElement, handleChange, handleCreate, handleDialogClose, isBackButtonVisible]);

  return <Box data-testid="resource-dialogs">{modal}</Box>;
};
