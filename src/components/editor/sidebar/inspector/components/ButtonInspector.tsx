import { COMPONENT_CONFIGS, COMPONENT_DATA_TYPES } from '@app/constants';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentType,
} from '@app/types';
import { useMemo } from 'react';
import { ComponentEventHandlers } from '../ComponentEventHandlers';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.button;
const BUTTON_CONFIG = COMPONENT_CONFIGS.button;

export const ButtonInspector = ({
  name,
  data,
  eventHandlers,
  onDataChange,
  onEventHandlersChange,
}: BaseComponentInspectorProps<ComponentType.Button>) => {
  const config: BaseInspectorSectionProps<Component['data']['button']>[] =
    useMemo(() => {
      return [
        {
          title: 'Basic',
          fields: [
            {
              field: 'text',
              label: 'Text',
              value: data?.text,
              data: {
                text: {
                  type: DATA_TYPES.text,
                },
              },
            },
          ],
        },
        {
          title: 'Interaction',
          fields: [
            {
              field: 'disabled',
              label: 'Disabled',
              value: data?.disabled,
              data: {
                text: {
                  type: DATA_TYPES.disabled,
                },
              },
            },
            {
              field: 'loading',
              label: 'Loading',
              value: data?.loading,
              data: {
                text: {
                  type: DATA_TYPES.loading,
                },
              },
            },
            {
              field: 'eventHandlers',
              component: (
                <ComponentEventHandlers
                  name={name}
                  eventHandlers={eventHandlers}
                  eventOptions={BUTTON_CONFIG.events}
                  onChange={onEventHandlersChange}
                />
              ),
            },
          ],
        },
      ];
    }, [data, eventHandlers, name, onEventHandlersChange]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onChange={onDataChange}
      isAutosaved
      testId="button-inspector"
    />
  );
};
