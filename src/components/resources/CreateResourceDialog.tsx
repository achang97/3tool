import { useCreateResourceMutation } from '@app/redux/services/resources';
import { Resource } from '@app/types';
import { useCallback } from 'react';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { BaseResourceDialog } from './BaseResourceDialog';

type CreateResourceDialogProps = {
  resource: Resource;
  isOpen: boolean;
  isBackButtonVisible: boolean;
  onClose: () => void;
  onChange: (update: RecursivePartial<Resource>) => void;
  onCreate: (resource: Resource) => void;
};

export const CreateResourceDialog = ({
  resource,
  isOpen,
  isBackButtonVisible,
  onClose,
  onChange,
  onCreate,
}: CreateResourceDialogProps) => {
  const [createResource, { isLoading, error }] = useCreateResourceMutation();

  const handleCreateResource = useCallback(async () => {
    const response = await createResource(resource);

    if (!isSuccessfulApiResponse(response)) {
      return;
    }

    onCreate(response.data);
    onClose();
  }, [createResource, resource, onCreate, onClose]);

  return (
    <BaseResourceDialog
      title="Add Resource"
      testId="create-resource-dialog"
      resource={resource}
      onChange={onChange}
      onClose={onClose}
      isOpen={isOpen}
      isBackButtonVisible={isBackButtonVisible}
      onSubmit={handleCreateResource}
      error={error}
      isLoading={isLoading}
    />
  );
};
