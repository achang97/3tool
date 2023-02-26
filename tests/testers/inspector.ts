import { CodeMirrorProps } from '@app/components/editor/common/CodeMirror';
import { useCodeMirrorPreview } from '@app/components/editor/hooks/useCodeMirrorPreview';
import { InspectorEnumFieldProps } from '@app/components/editor/sidebar/inspector/fields/InspectorEnumField';
import { RenderResult, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';

export const validateSection = (result: RenderResult, title: string) => {
  expect(result.getByText(title, { selector: 'h6' })).toBeTruthy();
};

const getFieldContainer = (
  result: RenderResult,
  title: string,
  label: string
) => {
  const section = within(result.getByTestId(`inspector-section-${title}`));
  const field = within(section.getByTestId(label));
  return field;
};

type BaseValidateProps<T> = {
  field: string;
  label: string;
  value: any;
  onChange: jest.Mock;
  config: T;
};

type ValidateEnumFieldProps = BaseValidateProps<
  Pick<InspectorEnumFieldProps, 'options'>
>;

const createUpdateObject = (field: string, value: unknown) => {
  const update = {};
  _.set(update, field, value);
  return update;
};

export const validateEnumField = async (
  result: RenderResult,
  sectionTitle: string,
  { label, value, field, onChange, config: { options } }: ValidateEnumFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `inspector-enum-field-${label}`
  );

  expect(container.getByText(label, { selector: 'label' })).toBeTruthy();

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    const labelElement = container.getByText(option.label, {
      selector: 'button',
    });
    expect(labelElement).toBeTruthy();

    // eslint-disable-next-line no-await-in-loop
    await userEvent.click(labelElement);

    if (value === option.value) {
      expect(onChange).not.toHaveBeenCalled();
    } else {
      expect(onChange).toHaveBeenCalledWith(
        createUpdateObject(field, option.value)
      );
    }

    onChange.mockClear();
  }
};

type ValidateDynamicInputFieldProps = BaseValidateProps<
  Pick<CodeMirrorProps, 'type'>
>;

export const validateDynamicInputField = async (
  result: RenderResult,
  sectionTitle: string,
  {
    label,
    value,
    field,
    onChange,
    config: { type: inputType },
  }: ValidateDynamicInputFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `code-mirror-${label}`
  );

  expect(container.getByText(label, { selector: 'label' })).toBeTruthy();

  const input = container.getByRole('textbox');
  if (value) {
    expect(input).toHaveTextContent(value);
  }

  expect(useCodeMirrorPreview as jest.Mock).toHaveBeenCalledWith({
    type: inputType,
    isDynamic: true,
    expression: value,
  });

  const inputText = 'h';
  await userEvent.type(input, inputText);

  expect(onChange).toHaveBeenCalledWith(
    createUpdateObject(field, `${inputText}${value}`)
  );
};
