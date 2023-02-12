import { DynamicTextFieldProps } from '@app/components/editor/common/DynamicTextField';
import {
  Preview,
  useDynamicTextFieldPreview,
} from '@app/components/editor/hooks/useDynamicTextFieldPreview';
import { InspectorEnumFieldProps } from '@app/components/editor/sidebar/inspector/fields/InspectorEnumField';
import { EvalResult } from '@app/components/editor/utils/eval';
import { ComponentType } from '@app/types';
import { renderHook, RenderResult, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

type ValidateEnumFieldProps = Omit<InspectorEnumFieldProps, 'onChange'> & {
  field: string;
  type: ComponentType;
  onChange: jest.Mock;
};

export const validateEnumField = async (
  result: RenderResult,
  sectionTitle: string,
  { label, value, options, field, type, onChange }: ValidateEnumFieldProps
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
      expect(onChange).toHaveBeenCalledWith({
        [type]: {
          [field]: option.value,
        },
      });
    }

    onChange.mockClear();
  }
};

type ValidateDynamicInputFieldProps = Omit<
  DynamicTextFieldProps,
  'onChange' | 'evalResult'
> & {
  field: string;
  type: ComponentType;
  onChange: jest.Mock;
  evalResult: EvalResult;
};

const getPreviewFromEval = (evalResult: EvalResult): Preview => {
  const { result } = renderHook(() => useDynamicTextFieldPreview(evalResult));
  return result.current;
};

export const validateDynamicInputField = async (
  result: RenderResult,
  sectionTitle: string,
  {
    label,
    value,
    evalResult,
    field,
    type,
    onChange,
  }: ValidateDynamicInputFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `dynamic-text-field-${label}`
  );

  expect(container.getByText(label, { selector: 'label' })).toBeTruthy();

  const input = container.getByRole('textbox');
  if (value) {
    expect(input).toHaveTextContent(value);
  }

  const inputText = 'h';
  await userEvent.type(input, inputText);

  const previewData = getPreviewFromEval(evalResult);
  const previewElement = within(
    container.getByTestId('dynamic-test-field-preview')
  );

  if (previewData.message) {
    expect(
      previewElement.getByText(previewData.message.toString())
    ).toBeTruthy();
  }
  if (previewData.type) {
    expect(previewElement.getByText(previewData.type)).toBeTruthy();
  }

  expect(onChange).toHaveBeenCalledWith({
    [type]: {
      [field]: `${inputText}${value}`,
    },
  });
};
