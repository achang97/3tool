import { useCreateResourceMutation } from '@app/redux/services/resources';
import { Resource } from '@app/types';
import { useCallback } from 'react';
import { BaseResourceDialog } from './BaseResourceDialog';

type CreateResourceDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const CreateResourceDialog = ({
  onClose,
  open,
}: CreateResourceDialogProps) => {
  const [createResource, { isLoading, error }] = useCreateResourceMutation();

  const handleCreateResource = useCallback(
    async (resource: Pick<Resource, 'type' | 'name' | 'metadata'>) => {
      await createResource(resource);
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
