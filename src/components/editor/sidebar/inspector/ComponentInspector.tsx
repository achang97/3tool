import { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { COMPONENTS_BY_TYPE } from '@app/constants';
import Image from 'next/image';
import { Component } from '@app/types';
import { useAppDispatch } from '@app/redux/hooks';
import {
  focusComponent,
  setSnackbarMessage,
} from '@app/redux/features/editorSlice';
import { InspectorEditableName } from './InspectorEditableName';
import { useGetActiveTool } from '../../hooks/useGetActiveTool';
import { useUpdateActiveTool } from '../../hooks/useUpdateActiveTool';
import { DeleteComponentButton } from './DeleteComponentButton';
import { InspectorSection } from './InspectorSection';

type ComponentInspectorProps = {
  name: string;
};

export const ComponentInspector = ({ name }: ComponentInspectorProps) => {
  const tool = useGetActiveTool();
  const updateTool = useUpdateActiveTool();
  const dispatch = useAppDispatch();

  const component = useMemo(() => {
    return tool?.components.find(
      (currComponent) => currComponent.name === name
    );
  }, [tool, name]);

  const handleUpdateComponent = useCallback(
    async (update: Partial<Component>) => {
      await updateTool({
        components: tool?.components.map((currComponent) => {
          return currComponent.name === name
            ? { ...currComponent, ...update }
            : currComponent;
        }),
      });
    },
    [name, tool, updateTool]
  );

  const handleSubmitName = useCallback(
    async (newName: string) => {
      if (!newName.match(/^[\w_$]+$/)) {
        dispatch(
          setSnackbarMessage({
            type: 'error',
            message: 'Name can only contain letters, numbers, _, or $',
          })
        );
        return;
      }

      await handleUpdateComponent({ name: newName });
      dispatch(focusComponent(newName));
    },
    [handleUpdateComponent, dispatch]
  );

  if (!component) {
    return null;
  }

  return (
    <Box data-testid="component-inspector">
      <InspectorEditableName
        icon={
          <Image
            style={{ height: '20px', width: '20px' }}
            src={COMPONENTS_BY_TYPE[component.type].icon}
            alt=""
          />
        }
        subtitle={COMPONENTS_BY_TYPE[component.type].label}
        value={name}
        onSubmit={handleSubmitName}
      />
      <InspectorSection title="Actions">
        <DeleteComponentButton name={name} />
      </InspectorSection>
    </Box>
  );
};
