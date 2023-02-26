import React, { FC, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { COMPONENT_CONFIGS } from '@app/constants';
import Image from 'next/image';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentType,
} from '@app/types';
import _ from 'lodash';
import { InspectorHeader } from './InspectorHeader';
import { useActiveTool } from '../../hooks/useActiveTool';
import { DeleteComponentButton } from './DeleteComponentButton';
import { InspectorSection } from './InspectorSection';
import { ButtonInspector } from './components/ButtonInspector';
import { TextInputInspector } from './components/TextInputInspector';
import { TextInspector } from './components/TextInspector';
import { NumberInputInspector } from './components/NumberInputInspector';
import { useComponentUpdateName } from '../../hooks/useComponentUpdateName';
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

  const handleUpdateName = useComponentUpdateName(component.name);

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
    return _.debounce(
      (update: RecursivePartial<ValueOf<Component['data']>>) => {
        handleUpdateComponent({ data: { [component.type]: update } });
      },
      DEBOUNCE_TIME_MS
    );
  }, [component.type, handleUpdateComponent]);

  const dataInspector = useMemo(() => {
    const TypedInspector = COMPONENT_INSPECTOR_MAP[component.type];
    if (!TypedInspector) {
      return null;
    }

    return (
      <TypedInspector
        name={component.name}
        data={component.data}
        onUpdateData={debouncedHandleUpdateData}
      />
    );
  }, [component, debouncedHandleUpdateData]);

  return (
    <Box
      data-testid="component-inspector"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <InspectorHeader
        icon={
          <Image
            style={{ height: '20px', width: '20px' }}
            src={COMPONENT_CONFIGS[component.type].icon}
            alt=""
          />
        }
        title={component.name}
        subtitle={COMPONENT_CONFIGS[component.type].label}
        onSubmit={handleUpdateName}
        isEditable
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
