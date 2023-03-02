import { EditableTextField } from '@app/components/common/EditableTextField';
import { MenuItem } from '@app/components/common/MenuItem';
import { ACTION_CONFIGS } from '@app/constants';
import { useMenuState } from '@app/hooks/useMenuState';
import { focusAction } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Action } from '@app/types';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Menu } from '@mui/material';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { DeleteDialog } from '../../common/DeleteDialog';
import { useActionConfirmDiscard } from '../../hooks/useActionConfirmDiscard';
import { useActionDelete } from '../../hooks/useActionDelete';
import { useActionIsEditing } from '../../hooks/useActionIsEditing';
import { useActionUpdateName } from '../../hooks/useActionUpdateName';

type ActionListItemProps = {
  action: Action;
};

export const ActionListItem = ({ action }: ActionListItemProps) => {
  const { icon, label } = ACTION_CONFIGS[action.type];

  const dispatch = useAppDispatch();
  const { focusedAction } = useAppSelector((state) => state.editor);

  const { isMenuOpen, menuAnchor, onMenuClose, onMenuOpen } = useMenuState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateActionName = useActionUpdateName(action.name);
  const handleDeleteAction = useActionDelete(action.name);
  const isEditingFocusedAction = useActionIsEditing();
  const confirmDiscard = useActionConfirmDiscard();

  const isFocused = useMemo(() => {
    return focusedAction?.name === action.name;
  }, [focusedAction, action.name]);

  const isNameEditable = useMemo(() => {
    return isFocused && !isEditingFocusedAction;
  }, [isEditingFocusedAction, isFocused]);

  const handleFocusClick = useCallback(() => {
    if (isFocused) {
      return;
    }
    if (!confirmDiscard()) {
      return;
    }
    dispatch(focusAction(action));
  }, [isFocused, confirmDiscard, dispatch, action]);

  const handleDeleteDialogOpen = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isFocused ? 'greyscale.offwhite.main' : undefined,
          borderRadius: 1,
          padding: 0.5,
          cursor: 'pointer',
        }}
        onClick={handleFocusClick}
        data-testid={`action-list-item-${action.name}`}
      >
        <Image alt={label} src={icon} />
        <Box
          sx={{
            marginLeft: 2,
            flex: 1,
            minWidth: 0,
          }}
        >
          <EditableTextField
            value={action.name}
            isEditable={isNameEditable}
            showIcon={isFocused}
            TextFieldProps={{ size: 'small' }}
            TypographyProps={{ variant: 'body2' }}
            height={30}
            onSubmit={handleUpdateActionName}
            iconTooltip={
              !isNameEditable
                ? 'You must save any changes before this can be renamed.'
                : ''
            }
          />
        </Box>
        <IconButton
          size="small"
          onClick={onMenuOpen}
          data-testid="action-list-item-menu-button"
        >
          <MoreVert fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={onMenuClose}
          onClick={onMenuClose}
        >
          <MenuItem
            onClick={handleDeleteDialogOpen}
            color="error.main"
            label="Delete"
          />
        </Menu>
      </Box>
      <DeleteDialog
        name={action.name}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteAction}
      />
    </>
  );
};
