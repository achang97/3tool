import { useDeleteResourceMutation } from '@app/redux/services/resources';
import { ResourceWithLinkedActions } from '@app/types';
import { styled, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { BaseDeleteDialog } from './BaseDeleteDialog';

const Bold = styled('b')(() => ({
  fontWeight: 600,
}));

type DeleteResourceDialogProps = {
  resource: ResourceWithLinkedActions;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteResourceDialog = ({ resource, isOpen, onClose }: DeleteResourceDialogProps) => {
  const [deleteResource, { isLoading, error }] = useDeleteResourceMutation();

  const handleDeleteResource = useCallback(async () => {
    await deleteResource({ _id: resource._id }).unwrap();
  }, [deleteResource, resource]);

  const linkedActionsCount = useMemo(
    () => resource.linkedActions?.length ?? 0,
    [resource.linkedActions?.length]
  );

  const customBody = useMemo(() => {
    if (linkedActionsCount === 0) {
      return undefined;
    }

    return (
      <Typography>
        <Bold>{resource.name}</Bold> is being used in <Bold>{linkedActionsCount}</Bold>{' '}
        {linkedActionsCount === 1 ? 'app' : 'apps'}.
        <br />
        Once deleted, all actions on top of this resource will be removed from your applications.
      </Typography>
    );
  }, [resource.name, linkedActionsCount]);

  return (
    <BaseDeleteDialog
      testId="delete-resource-dialog"
      entityType="resource"
      entityName={resource.name}
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      error={error}
      onDelete={handleDeleteResource}
      showConfirmation={linkedActionsCount > 0}
      customBody={customBody}
    />
  );
};
