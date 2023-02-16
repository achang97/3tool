import { EditableTextField } from '@app/components/common/EditableTextField';
import { ACTION_CONFIGS } from '@app/constants/actions';
import { useMenuState } from '@app/hooks/useMenuState';
import { focusAction } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { ActionType } from '@app/types';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { DeleteDialog } from '../../common/DeleteDialog';
import { useDeleteAction } from '../../hooks/useDeleteAction';
import { useUpdateActionName } from '../../hooks/useUpdateActionName';

type ActionListItemProps = {
  name: string;
  type: ActionType;
};

export const ActionListItem = ({ name, type }: ActionListItemProps) => {
  const { icon, label } = ACTION_CONFIGS[type];

  const dispatch = useAppDispatch();
  const { focusedActionName } = useAppSelector((state) => state.editor);

  const { isMenuOpen, menuAnchor, onMenuClose, onMenuOpen } = useMenuState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateActionName = useUpdateActionName(name);
  const handleDeleteAction = useDeleteAction(name);

  const isFocused = useMemo(() => {
    return focusedActionName === name;
  }, [focusedActionName, name]);

  const handleFocusClick = useCallback(() => {
    dispatch(focusAction(name));
  }, [dispatch, name]);

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
            value={name}
            isEditable={isFocused}
            TextFieldProps={{ size: 'small' }}
            TypographyProps={{ variant: 'body2' }}
            height={30}
            onSubmit={handleUpdateActionName}
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
          <MenuItem onClick={handleDeleteDialogOpen}>
            <Typography variant="body2" color="error.main">
              Delete
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
      <DeleteDialog
        name={name}
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteAction}
      />
    </>
  );
};
