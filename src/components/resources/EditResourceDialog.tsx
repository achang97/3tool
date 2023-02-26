import { useUpdateResourceMutation } from '@app/redux/services/resources';
import { Resource } from '@app/types';
import { useCallback, useEffect } from 'react';
import { BaseResourceDialog } from './BaseResourceDialog';

type EditResourceDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  resourceId: string;
};

export const EditResourceDialog = ({
  onClose,
  isOpen,
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
    (resource: Pick<Resource, 'type' | 'name' | 'data'>) => {
      updateResource({ id: resourceId, ...resource });
    },
    [updateResource, resourceId]
  );

  return (
    <BaseResourceDialog
      title="Edit Resource"
      testId="edit-resource-dialog"
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleUpdateResource}
      error={error}
      isLoading={isLoading}
    />
  );
};
