import React, { FC, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { COMPONENT_CONFIGS } from '@app/constants';
import Image from 'next/image';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentData,
  ComponentType,
} from '@app/types';
import _ from 'lodash';
import { InspectorEditableName } from './InspectorEditableName';
import { useActiveTool } from '../../hooks/useActiveTool';
import { DeleteComponentButton } from './DeleteComponentButton';
import { InspectorSection } from './InspectorSection';
import { ButtonInspector } from './components/ButtonInspector';
import { TextInputInspector } from './components/TextInputInspector';
import { TextInspector } from './components/TextInspector';
import { NumberInputInspector } from './components/NumberInputInspector';
import { useUpdateComponentName } from '../../hooks/useUpdateComponentName';
import { TableInspector } from './components/TableInspector';

type ComponentInspectorProps = {
  component: Component;
};

const DEBOUNCE_TIME_MS = 300;

const COMPONENT_INSPECTOR_MAP: Record<
  ComponentType,
  FC<BaseComponentInspectorProps>
> = {
  [ComponentType.Button]: ButtonInspector,
  [ComponentType.TextInput]: TextInputInspector,
  [ComponentType.NumberInput]: NumberInputInspector,
  [ComponentType.Text]: TextInspector,
  [ComponentType.Table]: TableInspector,
};

export const ComponentInspector = ({ component }: ComponentInspectorProps) => {
  const { tool, updateTool } = useActiveTool();

  const handleUpdateName = useUpdateComponentName(component.name);

  const handleUpdateComponent = useCallback(
    async (update: RecursivePartial<Component>) => {
      await updateTool({
        components: tool.components.map((currComponent) => {
          return currComponent.name === component.name
            ? _.merge({}, currComponent, update)
            : currComponent;
        }),
      });
    },
    [component.name, tool.components, updateTool]
  );

  const debouncedHandleUpdateData = useMemo(() => {
    return _.debounce((update: RecursivePartial<ComponentData>) => {
      handleUpdateComponent({ data: update });
    }, DEBOUNCE_TIME_MS);
  }, [handleUpdateComponent]);

  const dataInspector = useMemo(() => {
    const Inspector = COMPONENT_INSPECTOR_MAP[component.type];
    if (!Inspector) {
      return null;
    }

    return (
      <Inspector
        name={component.name}
        data={component.data}
        onUpdate={debouncedHandleUpdateData}
      />
    );
  }, [component, debouncedHandleUpdateData]);

  return (
    <Box
      data-testid="component-inspector"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <InspectorEditableName
        icon={
          <Image
            style={{ height: '20px', width: '20px' }}
            src={COMPONENT_CONFIGS[component.type].icon}
            alt=""
          />
        }
        subtitle={COMPONENT_CONFIGS[component.type].label}
        value={component.name}
        onSubmit={handleUpdateName}
      />
      <Box sx={{ overflow: 'auto', minHeight: 0 }}>
        {dataInspector}
        <InspectorSection title="Actions">
          <DeleteComponentButton name={component.name} />
        </InspectorSection>
      </Box>
    </Box>
  );
};
