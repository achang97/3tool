import { useActionFocusedState } from '@app/components/editor/hooks/useActionFocusedState';
import { useActionSaveHandlers } from '@app/components/editor/hooks/useActionSaveHandlers';
import { ACTION_CONFIGS } from '@app/constants';
import { useKeyPress } from '@app/hooks/useKeyPress';
import { ActionType } from '@app/types';
import { PlayArrow } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { ButtonProps } from '@mui/material';
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

  const buttonProps: ButtonProps & { onClick: () => void } = useMemo(() => {
    if (!isEditing) {
      return {
        children: 'Run',
        variant: 'outlined',
        startIcon: <PlayArrow />,
        onClick: executeAction,
      };
    }

    if (mode === 'read') {
      return {
        children: 'Save & Run',
        variant: 'contained',
        startIcon: <PlayArrow />,
        onClick: saveAndExecuteAction,
      };
    }

    // mode === 'write'
    return {
      children: 'Save',
      variant: 'contained',
      onClick: saveAction,
    };
  }, [executeAction, isEditing, mode, saveAction, saveAndExecuteAction]);

  useKeyPress({ key: 's', cmdKey: true, onPress: buttonProps.onClick });

  return (
    <LoadingButton
      {...buttonProps}
      size="small"
      loading={isLoading}
      data-testid="save-run-button"
    />
  );
};
