import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component, ComponentEvent, EventHandler } from '@app/types';
import { validateTextField, validateEnumField, validateSection } from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TextInspector } from '../TextInspector';

const mockName = 'name';
const mockData: Component['data']['text'] = {
  value: 'value',
  horizontalAlignment: 'left',
};
const mockEventHandlers: EventHandler<ComponentEvent>[] = [];

const mockHandleDataChange = jest.fn();
const mockHandleEventHandlersChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
}));

describe('TextInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Basic');
    });

    it('value: renders "Value" text field', async () => {
      render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Basic', {
        field: 'value',
        label: 'Value',
        value: mockData.value,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.text.value },
      });
    });
  });

  describe('Layout', () => {
    it('renders "Layout" title', () => {
      render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Layout');
    });

    it('horizontalAlignment: renders "Horizontal Alignment" enum field', async () => {
      render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateEnumField('Layout', {
        field: 'horizontalAlignment',
        label: 'Horizontal Alignment',
        value: mockData.horizontalAlignment,
        onChange: mockHandleDataChange,
        data: {
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
