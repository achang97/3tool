import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component } from '@app/types';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TextInputInspector } from '../TextInputInspector';

const mockName = 'Name';
const mockData: Component['data'] = {
  textInput: {
    defaultValue: 'Default Value',
    placeholder: 'Placeholder',
    label: 'Label',
    disabled: 'disabled',
    required: 'required',
    minLength: '1',
    maxLength: '5',
  },
};

const mockHandleUpdateData = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

describe('TextInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Basic');
    });

    it('defaultValue: renders "Default Value" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.textInput?.defaultValue,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.defaultValue },
      });
    });

    it('placeholder: renders "Placeholder" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        field: 'placeholder',
        label: 'Placeholder',
        value: mockData.textInput?.placeholder,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.placeholder },
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Label');
    });

    it('label: renders "Label" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Label', {
        field: 'label',
        label: 'Label',
        value: mockData.textInput?.label,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.label },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Interaction', {
        field: 'disabled',
        label: 'Disabled',
        value: mockData.textInput?.disabled,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.disabled },
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Validation');
    });

    it('required: renders "Required" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        field: 'required',
        label: 'Required',
        value: mockData.textInput?.required,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.required },
      });
    });

    it('minLength: renders "Min Length" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        field: 'minLength',
        label: 'Min Length',
        value: mockData.textInput?.minLength,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.minLength },
      });
    });

    it('maxLength: renders "Max Length" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        field: 'maxLength',
        label: 'Max Length',
        value: mockData.textInput?.maxLength,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.textInput.maxLength },
      });
    });
  });
});
