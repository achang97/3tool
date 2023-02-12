import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { ComponentData, ComponentType } from '@app/types';
import { mockEvalResult } from '@tests/constants/eval';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { NumberInputInspector } from '../NumberInputInspector';

const mockName = 'Name';
const mockData: ComponentData = {
  numberInput: {
    defaultValue: 'Default Value',
    placeholder: 'Placeholder',
    label: 'Label',
    disabled: 'disabled',
    required: 'required',
    minimum: '1',
    maximum: '5',
  },
};

const mockHandleUpdate = jest.fn();

jest.mock('@app/components/editor/hooks/useComponentEvalData');

describe('NumberInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalData: {},
    }));
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Basic');
    });

    it('defaultValue: renders "Default Value" number field', async () => {
      const mockEvalData = { defaultValue: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        type: ComponentType.NumberInput,
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.numberInput?.defaultValue,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.defaultValue,
      });
    });

    it('placeholder: renders "Placeholder" number field', async () => {
      const mockEvalData = { placeholder: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        type: ComponentType.NumberInput,
        field: 'placeholder',
        label: 'Placeholder',
        value: mockData.numberInput?.placeholder,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.placeholder,
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Label');
    });

    it('label: renders "Label" number field', async () => {
      const mockEvalData = { label: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Label', {
        type: ComponentType.NumberInput,
        field: 'label',
        label: 'Label',
        value: mockData.numberInput?.label,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.label,
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" number field', async () => {
      const mockEvalData = { disabled: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Interaction', {
        type: ComponentType.NumberInput,
        field: 'disabled',
        label: 'Disabled',
        value: mockData.numberInput?.disabled,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.disabled,
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Validation');
    });

    it('required: renders "Required" number field', async () => {
      const mockEvalData = { required: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        type: ComponentType.NumberInput,
        field: 'required',
        label: 'Required',
        value: mockData.numberInput?.required,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.required,
      });
    });

    it('minimum: renders "Minimum" number field', async () => {
      const mockEvalData = { minimum: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        type: ComponentType.NumberInput,
        field: 'minimum',
        label: 'Minimum',
        value: mockData.numberInput?.minimum,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.minimum,
      });
    });

    it('maximum: renders "Maximum" number field', async () => {
      const mockEvalData = { maximum: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Validation', {
        type: ComponentType.NumberInput,
        field: 'maximum',
        label: 'Maximum',
        value: mockData.numberInput?.maximum,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.maximum,
      });
    });
  });
});
