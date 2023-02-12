import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { ComponentData, ComponentType } from '@app/types';
import { mockEvalResult } from '@tests/constants/eval';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TextInputInspector } from '../TextInputInspector';

const mockName = 'Name';
const mockData: ComponentData = {
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

const mockHandleUpdate = jest.fn();

jest.mock('@app/components/editor/hooks/useComponentEvalData');

describe('TextInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalData: {},
    }));
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Basic');
    });

    it('defaultValue: renders "Default Value" text field', async () => {
      const mockEvalData = { defaultValue: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        type: ComponentType.TextInput,
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.textInput?.defaultValue,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.defaultValue,
      });
    });

    it('placeholder: renders "Placeholder" text field', async () => {
      const mockEvalData = { placeholder: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        type: ComponentType.TextInput,
        field: 'placeholder',
        label: 'Placeholder',
        value: mockData.textInput?.placeholder,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.placeholder,
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Label');
    });

    it('label: renders "Label" text field', async () => {
      const mockEvalData = { label: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Label', {
        type: ComponentType.TextInput,
        field: 'label',
        label: 'Label',
        value: mockData.textInput?.label,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.label,
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" text field', async () => {
      const mockEvalData = { disabled: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Interaction', {
        type: ComponentType.TextInput,
        field: 'disabled',
        label: 'Disabled',
        value: mockData.textInput?.disabled,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.disabled,
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Validation');
    });

    it('required: renders "Required" text field', async () => {
      const mockEvalData = { required: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        type: ComponentType.TextInput,
        field: 'required',
        label: 'Required',
        value: mockData.textInput?.required,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.required,
      });
    });

    it('minLength: renders "Min Length" text field', async () => {
      const mockEvalData = { minLength: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        type: ComponentType.TextInput,
        field: 'minLength',
        label: 'Min Length',
        value: mockData.textInput?.minLength,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.minLength,
      });
    });

    it('maxLength: renders "Max Length" text field', async () => {
      const mockEvalData = { maxLength: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        type: ComponentType.TextInput,
        field: 'maxLength',
        label: 'Max Length',
        value: mockData.textInput?.maxLength,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.maxLength,
      });
    });
  });
});
