import { Add } from '@mui/icons-material';
import { Button, Box, Menu, MenuItem, Typography } from '@mui/material';
import { useCallback } from 'react';
import Image from 'next/image';
import _ from 'lodash';
import { ACTION_CONFIGS } from '@app/constants/actions';
import { Action, ActionType } from '@app/types';
import { useMenuState } from '@app/hooks/useMenuState';
import { useAppDispatch } from '@app/redux/hooks';
import { focusAction } from '@app/redux/features/editorSlice';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { useActiveTool } from '../../hooks/useActiveTool';
import { createNameWithPrefix } from '../../utils/names';

const ACTIONS = [ActionType.Javascript, ActionType.SmartContractRead];

export const NewActionButton = () => {
  const { tool, updateTool } = useActiveTool();
  const dispatch = useAppDispatch();
  const { isMenuOpen, menuAnchor, onMenuOpen, onMenuClose } = useMenuState();

  const handleCreateAction = useCallback(
    async (type: ActionType) => {
      // TODO: Refactor this into a util function
      const newAction: Action = {
        type,
        name: createNameWithPrefix('action', _.map(tool.actions, 'name')),
        data: {
          [type]: {},
        },
        eventHandlers: [],
      };
      const response = await updateTool({
        actions: [...tool.actions, newAction],
      });

      if (!isSuccessfulApiResponse(response)) {
        return;
      }
      dispatch(focusAction(newAction.name));
    },
    [dispatch, tool.actions, updateTool]
  );

  return (
    <>
      <Button
        size="small"
        variant="text"
        sx={{ gap: 0.5 }}
        onClick={onMenuOpen}
      >
        <Box>New</Box>
        <Add fontSize="inherit" />
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={onMenuClose}
        onClick={onMenuClose}
      >
        {ACTIONS.map((actionType) => (
          <MenuItem
            key={actionType}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            onClick={() => handleCreateAction(actionType)}
          >
            <Image
              alt={ACTION_CONFIGS[actionType].label}
              src={ACTION_CONFIGS[actionType].icon}
            />
            <Typography variant="body2">
              {ACTION_CONFIGS[actionType].label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
