import { useUpdateResourceMutation } from '@app/redux/services/resources';
import { Resource } from '@app/types';
import { useCallback } from 'react';
import { BaseResourceDialog } from './BaseResourceDialog';

type EditResourceDialogProps = {
  resource: Resource;
  isOpen: boolean;
  isBackButtonVisible: boolean;
  onClose: () => void;
  onChange: (update: RecursivePartial<Resource>) => void;
};

export const EditResourceDialog = ({
  resource,
  isOpen,
  isBackButtonVisible,
  onClose,
  onChange,
}: EditResourceDialogProps) => {
  const [updateResource, { isLoading, error }] = useUpdateResourceMutation();

  const handleUpdateResource = useCallback(async () => {
    try {
      await updateResource(resource).unwrap();
      onClose();
    } catch {
      // Do nothing
    }
  }, [updateResource, resource, onClose]);

  return (
    <BaseResourceDialog
      title="Edit Resource"
      testId="edit-resource-dialog"
      resource={resource}
      onChange={onChange}
      onClose={onClose}
      isOpen={isOpen}
      isBackButtonVisible={isBackButtonVisible}
      onSubmit={handleUpdateResource}
      error={error}
      isLoading={isLoading}
    />
  );
};
