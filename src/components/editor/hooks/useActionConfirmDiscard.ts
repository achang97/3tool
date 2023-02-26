import { useCallback } from 'react';
import { useActionIsEditing } from './useActionIsEditing';

export const useActionConfirmDiscard = () => {
  const isEditingFocusedAction = useActionIsEditing();

  const handleConfirmDiscard = useCallback(() => {
    if (!isEditingFocusedAction) {
      return true;
    }

    // eslint-disable-next-line no-alert
    return window.confirm(
      "You didn't save your action. Are you sure you want to discard your changes?"
    );
  }, [isEditingFocusedAction]);

  return handleConfirmDiscard;
};
