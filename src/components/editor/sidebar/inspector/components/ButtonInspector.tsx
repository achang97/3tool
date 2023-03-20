import { InspectorEventHandlers } from '@app/components/editor/common/InspectorEventHandlers';
import { COMPONENT_CONFIGS, COMPONENT_DATA_TYPES } from '@app/constants';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentType,
} from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.button;
const BUTTON_CONFIG = COMPONENT_CONFIGS.button;

export const ButtonInspector = ({
  name,
  data,
  eventHandlers,
  onChangeData,
  onChangeEventHandlers,
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
                <InspectorEventHandlers
                  name={name}
                  label="Event handlers"
                  eventHandlers={eventHandlers}
                  eventOptions={BUTTON_CONFIG.events}
                  onChange={onChangeEventHandlers}
                />
              ),
            },
          ],
        },
      ];
    }, [data, eventHandlers, name, onChangeEventHandlers]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onChange={onChangeData}
      testId="button-inspector"
    />
  );
};
