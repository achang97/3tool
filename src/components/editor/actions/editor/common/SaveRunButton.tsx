import { useActionIsEditing } from '@app/components/editor/hooks/useActionIsEditing';
import { useActionSaveHandlers } from '@app/components/editor/hooks/useActionSaveHandlers';
import { ACTION_CONFIGS } from '@app/constants';
import { ActionType } from '@app/types';
import { Button } from '@mui/material';
import { useMemo } from 'react';

type SaveRunButtonProps = {
  type: ActionType;
};

export const SaveRunButton = ({ type }: SaveRunButtonProps) => {
  const isEditing = useActionIsEditing();
  const { saveAction, executeAction, saveAndExecuteAction } =
    useActionSaveHandlers();

  const mode = useMemo(() => {
    return ACTION_CONFIGS[type].mode;
  }, [type]);

  const buttonProps = useMemo(() => {
    if (!isEditing) {
      return {
        text: 'Run',
        onClick: executeAction,
      };
    }

    if (mode === 'read') {
      return {
        text: 'Save & Run',
        onClick: saveAndExecuteAction,
      };
    }

    // mode === 'write'
    return {
      text: 'Save',
      onClick: saveAction,
    };
  }, [executeAction, isEditing, mode, saveAction, saveAndExecuteAction]);

  return (
    <Button
      size="small"
      onClick={buttonProps.onClick}
      data-testid="save-run-button"
    >
      {buttonProps.text}
    </Button>
  );
};
