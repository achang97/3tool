import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component } from '@app/types';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { NumberInputInspector } from '../NumberInputInspector';

const mockData: Component['data']['numberInput'] = {
  defaultValue: 'Default Value',
  placeholder: 'Placeholder',
  label: 'Label',
  disabled: 'disabled',
  required: 'required',
  minimum: '1',
  maximum: '5',
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

describe('NumberInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Basic');
    });

    it('defaultValue: renders "Default Value" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.defaultValue,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.defaultValue },
      });
    });

    it('placeholder: renders "Placeholder" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        field: 'placeholder',
        label: 'Placeholder',
        value: mockData.placeholder,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.placeholder },
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Label');
    });

    it('label: renders "Label" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Label', {
        field: 'label',
        label: 'Label',
        value: mockData.label,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.label },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Interaction', {
        field: 'disabled',
        label: 'Disabled',
        value: mockData.disabled,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.disabled },
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Validation');
    });

    it('required: renders "Required" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        field: 'required',
        label: 'Required',
        value: mockData.required,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.required },
      });
    });

    it('minimum: renders "Minimum" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        field: 'minimum',
        label: 'Minimum',
        value: mockData.minimum,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.minimum },
      });
    });

    it('maximum: renders "Maximum" number field', async () => {
      const result = render(
        <NumberInputInspector
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        field: 'maximum',
        label: 'Maximum',
        value: mockData.maximum,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.numberInput.maximum },
      });
    });
  });
});
