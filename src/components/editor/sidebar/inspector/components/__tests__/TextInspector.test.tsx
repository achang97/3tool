import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component } from '@app/types';
import {
  validateDynamicInputField,
  validateEnumField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TextInspector } from '../TextInspector';

const mockName = 'Name';
const mockData: Component['data'] = {
  text: {
    value: 'value',
    horizontalAlignment: 'left',
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

describe('TextInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Basic');
    });

    it('value: renders "Value" text field', async () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Basic', {
        field: 'value',
        label: 'Value',
        value: mockData.text?.value,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.text.value },
      });
    });
  });

  describe('Layout', () => {
    it('renders "Layout" title', () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      validateSection(result, 'Layout');
    });

    it('horizontalAlignment: renders "Horizontal Alignment" enum field', async () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateEnumField(result, 'Layout', {
        field: 'horizontalAlignment',
        label: 'Horizontal Alignment',
        value: mockData.text?.horizontalAlignment,
        onChange: mockHandleUpdateData,
        config: {
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
        },
      });
    });
  });
});
