import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { ComponentData, ComponentType } from '@app/types';
import { mockEvalResult } from '@tests/constants/eval';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { ButtonInspector } from '../ButtonInspector';

const mockName = 'Name';
const mockData: ComponentData = {
  button: {
    text: 'text',
    disabled: 'disabled',
    loading: 'loading',
  },
};

const mockHandleUpdate = jest.fn();

jest.mock('@app/components/editor/hooks/useComponentEvalData');

describe('ButtonInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalData: {},
    }));
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Basic');
    });

    it('text: renders "Text" text field', async () => {
      const mockEvalData = { text: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        type: ComponentType.Button,
        field: 'text',
        label: 'Text',
        value: mockData.button?.text,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.text,
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <ButtonInspector
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
        <ButtonInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Interaction', {
        type: ComponentType.Button,
        field: 'disabled',
        label: 'Disabled',
        value: mockData.button?.disabled,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.disabled,
      });
    });

    it('loading: renders "Loading" text field', async () => {
      const mockEvalData = { loading: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Interaction', {
        type: ComponentType.Button,
        field: 'loading',
        label: 'Loading',
        value: mockData.button?.loading,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.loading,
      });
    });
  });
});
