import { useCreateResourceMutation } from '@app/redux/services/resources';
import { ApiErrorResponse, Resource } from '@app/types';
import { useCallback } from 'react';
import _ from 'lodash';
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
    try {
      const newResource = await createResource(
        _.omit(resource, ['_id', 'createdAt', 'updatedAt'])
      ).unwrap();

      onCreate(newResource);
      onClose();
    } catch {
      // Do nothing
    }
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
      error={error as ApiErrorResponse['error']}
      isLoading={isLoading}
    />
  );
};
