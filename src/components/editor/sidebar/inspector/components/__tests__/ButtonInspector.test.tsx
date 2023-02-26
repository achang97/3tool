import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component } from '@app/types';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { ButtonInspector } from '../ButtonInspector';

const mockData: Component['data']['button'] = {
  text: 'text',
  disabled: 'disabled',
  loading: 'loading',
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

describe('ButtonInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <ButtonInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );
      validateSection(result, 'Basic');
    });

    it('text: renders "Text" text field', async () => {
      const result = render(
        <ButtonInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );

      await validateDynamicInputField(result, 'Basic', {
        field: 'text',
        label: 'Text',
        value: mockData.text,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.button.text },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <ButtonInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" text field', async () => {
      const result = render(
        <ButtonInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );

      await validateDynamicInputField(result, 'Interaction', {
        field: 'disabled',
        label: 'Disabled',
        value: mockData.disabled,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.button.disabled },
      });
    });

    it('loading: renders "Loading" text field', async () => {
      const result = render(
        <ButtonInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );

      await validateDynamicInputField(result, 'Interaction', {
        field: 'loading',
        label: 'Loading',
        value: mockData.loading,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.button.loading },
      });
    });
  });
});
