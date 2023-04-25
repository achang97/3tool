import { useActionFocusedState } from '@app/components/editor/hooks/useActionFocusedState';
import { useActionSaveHandlers } from '@app/components/editor/hooks/useActionSaveHandlers';
import { ACTION_CONFIGS } from '@app/constants';
import { ActionType } from '@app/types';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';

type SaveRunButtonProps = {
  type: ActionType;
};

export const SaveRunButton = ({ type }: SaveRunButtonProps) => {
  const { isEditing, isLoading } = useActionFocusedState();
  const { saveAction, executeAction, saveAndExecuteAction } = useActionSaveHandlers();

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
    <LoadingButton
      size="small"
      loading={isLoading}
      onClick={buttonProps.onClick}
      data-testid="save-run-button"
    >
      {buttonProps.text}
    </LoadingButton>
  );
};
