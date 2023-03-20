import { InspectorEventHandlersProps } from '@app/components/editor/common/InspectorEventHandlers';
import { useCodeMirrorPreview } from '@app/components/editor/hooks/useCodeMirrorPreview';
import { BaseInspectorFieldProps } from '@app/components/editor/sidebar/inspector/components/BaseInspector';
import {
  EVENT_HANDLER_COMPONENT_EVENT_CONFIGS,
  EVENT_HANDLER_CONFIGS,
} from '@app/constants';
import { RenderResult, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';

export const validateSection = (result: RenderResult, title: string) => {
  expect(result.getByText(title, { selector: 'h6' })).toBeTruthy();
};

const getFieldContainer = (
  result: RenderResult,
  title: string | undefined,
  label: string
) => {
  const section = title
    ? within(result.getByTestId(`inspector-section-${title}`))
    : result;
  const container = label ? within(section.getByTestId(label)) : section;
  return container;
};

type BaseValidateProps<T extends keyof BaseInspectorFieldProps['data']> = {
  field: string;
  label: string;
  value: any;
  onChange: jest.Mock;
  data: NonNullable<BaseInspectorFieldProps['data'][T]>;
};

type ValidateEnumFieldProps = BaseValidateProps<'enum'>;

export const validateEnumField = async (
  result: RenderResult,
  sectionTitle: string | undefined,
  { label, value, field, onChange, data: { options } }: ValidateEnumFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `inspector-enum-${label}`
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
        expect.objectContaining({ [field]: option.value })
      );
    }

    onChange.mockClear();
  }
};

type ValidateTextFieldProps = BaseValidateProps<'text'>;

export const validateTextField = async (
  result: RenderResult,
  sectionTitle: string | undefined,
  { label, value, field, onChange, data: { type } }: ValidateTextFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `inspector-text-${label}`
  );

  expect(container.getByText(label, { selector: 'label' })).toBeTruthy();

  const input = container.getByRole('textbox');
  expect(input).toHaveTextContent(value);

  expect(useCodeMirrorPreview as jest.Mock).toHaveBeenCalledWith({
    type,
    isDynamic: true,
    expression: value,
  });

  const inputText = 'h';
  await userEvent.type(input, inputText);

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      [field]: `${inputText}${value}`,
    })
  );

  onChange.mockClear();
};

type ValidateSelectFieldProps = BaseValidateProps<'select'>;

export const validateSelectField = async (
  result: RenderResult,
  sectionTitle: string | undefined,
  { label, value, field, onChange, data: { options } }: ValidateSelectFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `inspector-select-${label}`
  );

  expect(container.getByText(label, { selector: 'label' })).toBeTruthy();
  expect(container.getByDisplayValue(value)).toBeTruthy();

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    // eslint-disable-next-line no-await-in-loop
    await userEvent.click(container.getByLabelText(label, { selector: 'div' }));

    // NOTE: We have to look in the result object, because the options render outside of
    // the given container.
    // eslint-disable-next-line no-await-in-loop
    await userEvent.click(result.getByRole('option', { name: option.label }));

    if (value === option.value) {
      expect(onChange).not.toHaveBeenCalled();
    } else {
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ [field]: option.value })
      );

      onChange.mockClear();
    }
  }
};

type ValidateSwitchFieldProps = BaseValidateProps<'switch'>;

export const validateSwitchField = async (
  result: RenderResult,
  sectionTitle: string | undefined,
  { label, value, field, onChange }: ValidateSwitchFieldProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    `inspector-switch-${label}`
  );

  const element = container.getByLabelText(label);
  if (value) {
    expect(element).toHaveAttribute('checked');
  } else {
    expect(element).not.toHaveAttribute('checked');
  }

  await userEvent.click(element);
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ [field]: !value })
  );

  onChange.mockClear();
};

type ValidateEventHandlersProps = Omit<
  InspectorEventHandlersProps,
  'onChange' | 'name'
> & {
  onChange: jest.Mock;
};

export const validateEventHandlers = async (
  result: RenderResult,
  sectionTitle: string | undefined,
  { label, eventHandlers, eventOptions, onChange }: ValidateEventHandlersProps
) => {
  const container = getFieldContainer(
    result,
    sectionTitle,
    'inspector-event-handlers'
  );

  expect(container.getByText(label, { selector: 'label' })).toBeTruthy();

  await userEvent.click(
    container.getByText(
      EVENT_HANDLER_COMPONENT_EVENT_CONFIGS[eventHandlers[0].event].label
    )
  );
  const editor = within(result.getByTestId('event-handler-editor'));

  await userEvent.click(editor.getByLabelText('Event'));
  const options = result.getAllByRole('option');
  expect(options.map((option) => option.getAttribute('data-value'))).toEqual(
    eventOptions
  );

  await userEvent.click(editor.getByLabelText('Effect'));
  await userEvent.click(
    result.getByRole('option', { name: EVENT_HANDLER_CONFIGS.url.label })
  );
  expect(onChange).toHaveBeenCalledWith([
    _.merge(eventHandlers[0], {
      data: {
        url: {
          newTab: true,
          url: '',
        },
      },
      type: 'url',
    }),
  ]);

  onChange.mockClear();
};
