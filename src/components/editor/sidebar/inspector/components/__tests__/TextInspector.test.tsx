import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { ComponentData, ComponentType } from '@app/types';
import { mockEvalResult } from '@tests/constants/eval';
import {
  validateDynamicInputField,
  validateEnumField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TextInspector } from '../TextInspector';

const mockName = 'Name';
const mockData: ComponentData = {
  text: {
    value: 'value',
    horizontalAlignment: 'left',
  },
};

const mockHandleUpdate = jest.fn();

jest.mock('@app/components/editor/hooks/useComponentEvalData');

describe('TextInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalData: {},
    }));
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Basic');
    });

    it('value: renders "Value" text field', async () => {
      const mockEvalData = { value: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        type: ComponentType.Text,
        field: 'value',
        label: 'Value',
        value: mockData.text?.value,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.value,
      });
    });
  });

  describe('Layout', () => {
    it('renders "Layout" title', () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Layout');
    });

    it('horizontalAlignment: renders "Horizontal Alignment" enum field', async () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateEnumField(result, 'Layout', {
        type: ComponentType.Text,
        field: 'horizontalAlignment',
        label: 'Horizontal Alignment',
        value: mockData.text?.horizontalAlignment,
        onChange: mockHandleUpdate,
        options: [
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'Right',
            value: 'right',
          },
        ],
      });
    });
  });
});
