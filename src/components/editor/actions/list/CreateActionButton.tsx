import { Add } from '@mui/icons-material';
import { Button, Box, Menu } from '@mui/material';
import { useCallback } from 'react';
import Image from 'next/image';
import _ from 'lodash';
import { ACTION_CONFIGS, ACTION_DATA_TEMPLATES } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { useMenuState } from '@app/hooks/useMenuState';
import { useAppDispatch } from '@app/redux/hooks';
import { focusAction } from '@app/redux/features/editorSlice';
import { MenuItem } from '@app/components/common/MenuItem';
import { useActiveTool } from '../../hooks/useActiveTool';
import { createNameWithPrefix } from '../../utils/elements';
import { useActionConfirmDiscard } from '../../hooks/useActionConfirmDiscard';

const ACTIONS = [ActionType.Javascript, ActionType.SmartContractRead];

export const CreateActionButton = () => {
  const { tool, updateTool } = useActiveTool();
  const dispatch = useAppDispatch();
  const { isMenuOpen, menuAnchor, onMenuOpen, onMenuClose } = useMenuState();
  const confirmDiscard = useActionConfirmDiscard();

  const handleCreateAction = useCallback(
    async (type: ActionType) => {
      if (!confirmDiscard()) {
        return;
      }

      const newAction: Action = {
        type,
        name: createNameWithPrefix('action', _.map(tool.actions, 'name')),
        data: {
          [type]: ACTION_DATA_TEMPLATES[type],
        },
        eventHandlers: [],
      };
      if (type === ActionType.SmartContractRead) {
        newAction.data[ActionType.SmartContractWrite] =
          ACTION_DATA_TEMPLATES[ActionType.SmartContractWrite];
      }

      const updatedTool = await updateTool({
        actions: [...tool.actions, newAction],
      });
      if (!updatedTool) {
        return;
      }
      dispatch(focusAction(newAction));
    },
    [confirmDiscard, dispatch, tool.actions, updateTool]
  );

  return (
    <>
      <Button size="small" variant="text" sx={{ gap: 0.5 }} onClick={onMenuOpen}>
        <Box>New</Box>
        <Add fontSize="inherit" />
      </Button>
      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose} onClick={onMenuClose}>
        {ACTIONS.map((actionType) => (
          <MenuItem
            key={actionType}
            onClick={() => handleCreateAction(actionType)}
            icon={
              <Image alt={ACTION_CONFIGS[actionType].label} src={ACTION_CONFIGS[actionType].icon} />
            }
            label={ACTION_CONFIGS[actionType].label}
          />
        ))}
      </Menu>
    </>
  );
};
