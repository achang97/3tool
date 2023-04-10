import React, { FC, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { COMPONENT_CONFIGS } from '@app/constants';
import Image from 'next/image';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentEvent,
  ComponentType,
  EventHandler,
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
import { overwriteArrayMergeCustomizer } from '../../utils/javascript';

type ComponentInspectorProps = {
  component: Component;
};

const DEBOUNCE_TIME_MS = 300;

const COMPONENT_INSPECTOR_MAP: {
  [KeyType in ComponentType]: FC<BaseComponentInspectorProps<KeyType>>;
} = {
  [ComponentType.Button]: ButtonInspector,
  [ComponentType.TextInput]: TextInputInspector,
  [ComponentType.NumberInput]: NumberInputInspector,
  [ComponentType.Text]: TextInspector,
  [ComponentType.Table]: TableInspector,
};

export const ComponentInspector = ({ component }: ComponentInspectorProps) => {
  const { tool, updateTool } = useActiveTool();

  const handleUpdateName = useComponentUpdateName(component.name);

  const debouncedHandleUpdateComponent = useMemo(() => {
    return _.debounce((update: RecursivePartial<Component>) => {
      return updateTool({
        components: tool.components.map((currComponent) => {
          return currComponent.name === component.name
            ? _.mergeWith({}, component, update, overwriteArrayMergeCustomizer)
            : currComponent;
        }),
      });
    }, DEBOUNCE_TIME_MS);
  }, [component, tool.components, updateTool]);

  const debouncedHandleUpdateData = useCallback(
    (update: RecursivePartial<ValueOf<Component['data']>>) => {
      return debouncedHandleUpdateComponent({
        data: { [component.type]: update },
      });
    },
    [component, debouncedHandleUpdateComponent]
  );

  const debouncedHandleUpdateEventHandlers = useCallback(
    (eventHandlers: EventHandler<ComponentEvent>[]) => {
      return debouncedHandleUpdateComponent({ eventHandlers });
    },
    [debouncedHandleUpdateComponent]
  );

  const dataInspector = useMemo(() => {
    const TypedInspector = COMPONENT_INSPECTOR_MAP[component.type];
    return (
      <TypedInspector
        key={component.name}
        name={component.name}
        eventHandlers={component.eventHandlers}
        // @ts-ignore We know that this accesses the correct data key
        data={component.data[component.type]}
        onDataChange={debouncedHandleUpdateData}
        onEventHandlersChange={debouncedHandleUpdateEventHandlers}
      />
    );
  }, [component, debouncedHandleUpdateData, debouncedHandleUpdateEventHandlers]);

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
