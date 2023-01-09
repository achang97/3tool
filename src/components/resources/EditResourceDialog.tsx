import { useUpdateResourceMutation } from '@app/redux/services/resources';
import { Resource } from '@app/types';
import { useCallback, useEffect } from 'react';
import { BaseResourceDialog } from './BaseResourceDialog';

type EditResourceDialogProps = {
  onClose: () => void;
  open: boolean;
  resourceId: string;
};

export const EditResourceDialog = ({
  onClose,
  open,
  resourceId,
}: EditResourceDialogProps) => {
  const [updateResource, { isLoading, error, data: updatedResource }] =
    useUpdateResourceMutation();

  useEffect(() => {
    if (updatedResource) {
      onClose();
    }
  }, [updatedResource, onClose]);

  const handleUpdateResource = useCallback(
    (resource: Pick<Resource, 'type' | 'name' | 'metadata'>) => {
      updateResource({ id: resourceId, ...resource });
    },
    [updateResource, resourceId]
  );

  return (
    <BaseResourceDialog
      title="Edit Resource"
      testId="edit-resource-dialog"
      onClose={onClose}
      open={open}
      onSubmit={handleUpdateResource}
      error={error}
      isLoading={isLoading}
    />
  );
};
