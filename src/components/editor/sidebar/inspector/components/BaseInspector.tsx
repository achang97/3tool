import { InspectorEnumField } from '@app/components/editor/common/InspectorEnumField';
import { InspectorSelect } from '@app/components/editor/common/InspectorSelect';
import { InspectorSwitch } from '@app/components/editor/common/InspectorSwitch';
import { InspectorTextField } from '@app/components/editor/common/InspectorTextField';
import { FieldType } from '@app/types';
import { Box, Stack } from '@mui/material';
import { Fragment, ReactNode, useCallback } from 'react';
import { InspectorSection } from '../InspectorSection';

export type BaseInspectorSectionProps<T = any> = {
  title?: string;
  fields: BaseInspectorSectionFieldProps<T>[];
};

export type BaseInspectorSectionFieldProps<T = any> =
  | BaseInspectorFieldProps<T>
  | BaseInspectorCustomComponentProps;

export type BaseInspectorFieldProps<T = any> = {
  field: keyof NonNullable<T>;
  label: string;
  value?: any;
  data: {
    text?: {
      type: FieldType;
      placeholder?: string;
    };
    enum?: {
      options: {
        label: string;
        value: any;
      }[];
    };
    select?: {
      options: {
        label: string;
        value: any;
      }[];
      placeholder?: string;
      disabled?: boolean;
    };
    switch?: {};
  };
};

type BaseInspectorCustomComponentProps = {
  field: string;
  component: ReactNode;
};

type BaseInspectorProps<T = any> = {
  name: string;
  config: BaseInspectorSectionProps<T>[];
  onChange: (update: Record<string, unknown>) => void;
  isAutosaved?: boolean;
  testId?: string;
};

export const BaseInspector = ({
  name,
  config,
  onChange,
  isAutosaved,
  testId,
}: BaseInspectorProps) => {
  const handleUpdate = useCallback(
    (field: string, newValue: unknown) => {
      onChange({ [field]: newValue });
    },
    [onChange]
  );

  const renderSectionField = useCallback(
    (field: BaseInspectorSectionFieldProps) => {
      const handleUpdateField = (newValue: unknown) => {
        handleUpdate(field.field.toString(), newValue);
      };

      if ('component' in field) {
        return field.component;
      }

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
          <InspectorTextField
            name={`${name}.${field.field.toString()}`}
            label={field.label}
            value={field.value}
            type={field.data.text.type}
            placeholder={field.data.text.placeholder}
            onChange={handleUpdateField}
            isAutosaved={isAutosaved}
          />
        );
      }

      if (field.data.select) {
        return (
          <InspectorSelect
            value={field.value}
            label={field.label}
            placeholder={field.data.select.placeholder}
            options={field.data.select.options}
            disabled={field.data.select.disabled}
            onChange={handleUpdateField}
          />
        );
      }

      if (field.data.switch) {
        return (
          <InspectorSwitch label={field.label} checked={field.value} onChange={handleUpdateField} />
        );
      }

      return null;
    },
    [handleUpdate, name, isAutosaved]
  );

  const renderSection = useCallback(
    (section: BaseInspectorSectionProps) => {
      const sectionFields = section.fields.map((field) => (
        <Fragment key={field.field.toString()}>{renderSectionField(field)}</Fragment>
      ));

      if (section.title) {
        return <InspectorSection title={section.title}>{sectionFields}</InspectorSection>;
      }

      return <Stack spacing={1}>{sectionFields}</Stack>;
    },
    [renderSectionField]
  );

  return (
    <Box data-testid={testId}>
      {config.map((section, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={`section-${i}`}>{renderSection(section)}</Fragment>
      ))}
    </Box>
  );
};
