import { useCallback } from 'react';
import { useActionFocusedState } from './useActionFocusedState';

export const useActionConfirmDiscard = () => {
  const { isEditing } = useActionFocusedState();

  const handleConfirmDiscard = useCallback(() => {
    if (!isEditing) {
      return true;
    }

    // eslint-disable-next-line no-alert
    return window.confirm(
      "You didn't save your action. Are you sure you want to discard your changes?"
    );
  }, [isEditing]);

  return handleConfirmDiscard;
};
