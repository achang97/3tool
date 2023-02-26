import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { BaseComponentInspectorProps, FieldType } from '@app/types';
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
      type: FieldType;
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
  config: BaseInspectorSectionProps[];
  onUpdateData: BaseComponentInspectorProps['onUpdateData'];
  testId?: string;
};

export const BaseInspector = ({
  name,
  config,
  onUpdateData,
  testId,
}: BaseInspectorProps) => {
  const handleUpdate = useCallback(
    (field: string, newValue: unknown) => {
      const update = {};
      _.set(update, field, newValue);
      onUpdateData(update);
    },
    [onUpdateData]
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
          <CodeMirror
            label={field.label}
            value={field.value}
            type={field.data.text.type}
            language="text"
            onChange={handleUpdateField}
            isAutosaved
          />
        );
      }

      return null;
    },
    [handleUpdate]
  );

  return (
    <Box data-testid={testId} key={name}>
      {config.map((section) => (
        <InspectorSection key={section.title} title={section.title}>
          {section.fields.map((field) => (
            <Box key={field.field}>{renderSectionField(field)}</Box>
          ))}
        </InspectorSection>
      ))}
    </Box>
  );
};
