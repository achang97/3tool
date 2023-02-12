import { DynamicTextField } from '@app/components/editor/common/DynamicTextField';
import { EvalResult } from '@app/components/editor/utils/eval';
import { ComponentData, ComponentType } from '@app/types';
import { Box } from '@mui/material';
import _ from 'lodash';
import { useCallback } from 'react';
import { InspectorEnumField } from '../fields/InspectorEnumField';
import { InspectorSection } from '../InspectorSection';

export type BaseInspectorSectionProps = {
  title: string;
  fields: BaseInspectorFieldProps[];
};

export type BaseInspectorFieldProps = {
  field: string;
  label: string;
  value?: any;
  data: {
    text?: {
      evalResult?: EvalResult;
    };
    enum?: {
      options: {
        label: string;
        value: any;
      }[];
    };
  };
};

type BaseInspectorProps = {
  name: string;
  type: ComponentType;
  config: BaseInspectorSectionProps[];
  onUpdate: (update: RecursivePartial<ComponentData>) => void;
  testId?: string;
};

export const BaseInspector = ({
  name,
  type,
  config,
  onUpdate,
  testId,
}: BaseInspectorProps) => {
  const handleUpdate = useCallback(
    (field: string, newValue: unknown) => {
      const update = {};
      _.set(update, field, newValue);

      onUpdate({ [type]: update });
    },
    [onUpdate, type]
  );

  const renderSectionField = useCallback(
    (field: BaseInspectorFieldProps) => {
      const handleUpdateField = (newValue: string) => {
        handleUpdate(field.field, newValue);
      };

      if (field.data.enum) {
        return (
          <InspectorEnumField
            label={field.label}
            value={field.value}
            options={field.data.enum.options}
            onChange={handleUpdateField}
          />
        );
      }

      if (field.data.text) {
        return (
          <DynamicTextField
            label={field.label}
            value={field.value}
            evalResult={field.data.text.evalResult}
            onChange={handleUpdateField}
          />
        );
      }

      return null;
    },
    [handleUpdate]
  );

  return (
    <Box data-testid={testId}>
      {config.map((section) => (
        <InspectorSection
          key={`${name}.${section.title}`}
          title={section.title}
        >
          {section.fields.map((field) => (
            <Box key={`${name}.${field.field}`}>
              {renderSectionField(field)}
            </Box>
          ))}
        </InspectorSection>
      ))}
    </Box>
  );
};
