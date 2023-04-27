import { useCallback } from 'react';
import { Add } from '@mui/icons-material';
import { Button, ButtonProps, Menu } from '@mui/material';
import { useMenuState } from '@app/hooks/useMenuState';
import { Resource, ResourceType } from '@app/types';
import { RESOURCE_CONFIGS, RESOURCE_DATA_TEMPLATES } from '@app/constants';
import { useAppDispatch } from '@app/redux/hooks';
import { pushResource } from '@app/redux/features/resourcesSlice';
import { MenuItem } from '../common/MenuItem';

const RESOURCES = [ResourceType.SmartContract, ResourceType.Abi];

type CreateResourceButtonProps = Omit<ButtonProps, 'children'>;

export const CreateResourceButton = (props: CreateResourceButtonProps) => {
  const dispatch = useAppDispatch();
  const { isMenuOpen, menuAnchor, onMenuOpen, onMenuClose } = useMenuState();

  const handleCreateResource = useCallback(
    (resourceType: ResourceType) => {
      const newResource: Resource = {
        name: '',
        type: resourceType,
        data: {
          [resourceType]: RESOURCE_DATA_TEMPLATES[resourceType],
        },
        // These values are all generated on the BE, but we provide placeholder values until the
        // object is created.
        _id: '',
        createdAt: '',
        updatedAt: '',
      };
      dispatch(pushResource({ type: 'create', resource: newResource }));
    },
    [dispatch]
  );

  return (
    <>
      <Button
        variant="text"
        startIcon={<Add />}
        onClick={onMenuOpen}
        data-testid="create-resource-button"
        {...props}
      >
        Add new resource
      </Button>
      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={onMenuClose} onClick={onMenuClose}>
        {RESOURCES.map((resourceType) => (
          <MenuItem
            key={resourceType}
            onClick={() => handleCreateResource(resourceType)}
            label={RESOURCE_CONFIGS[resourceType].label}
          />
        ))}
      </Menu>
    </>
  );
};
