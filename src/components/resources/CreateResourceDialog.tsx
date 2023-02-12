import { useCreateResourceMutation } from '@app/redux/services/resources';
import { Resource } from '@app/types';
import { useCallback, useEffect } from 'react';
import { BaseResourceDialog } from './BaseResourceDialog';

type CreateResourceDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const CreateResourceDialog = ({
  onClose,
  open,
}: CreateResourceDialogProps) => {
  const [createResource, { isLoading, error, data: newResource }] =
    useCreateResourceMutation();

  useEffect(() => {
    if (newResource) {
      onClose();
    }
  }, [newResource, onClose]);

  const handleCreateResource = useCallback(
    (resource: Pick<Resource, 'type' | 'name' | 'data'>) => {
      createResource(resource);
    },
    [createResource]
  );

  return (
    <BaseResourceDialog
      title="Add Resource"
      testId="create-resource-dialog"
      onClose={onClose}
      open={open}
      onSubmit={handleCreateResource}
      error={error}
      isLoading={isLoading}
    />
  );
};
