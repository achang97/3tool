import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component, ComponentEvent, EventHandler } from '@app/types';
import {
  validateTextField,
  validateEnumField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TextInspector } from '../TextInspector';

const mockName = 'name';
const mockData: Component['data']['text'] = {
  value: 'value',
  horizontalAlignment: 'left',
};
const mockEventHandlers: EventHandler<ComponentEvent>[] = [];

const mockHandleChangeData = jest.fn();
const mockHandleChangeEventHandlers = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

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
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Basic');
    });

    it('value: renders "Value" text field', async () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Basic', {
        field: 'value',
        label: 'Value',
        value: mockData.value,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.text.value },
      });
    });
  });

  describe('Layout', () => {
    it('renders "Layout" title', () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Layout');
    });

    it('horizontalAlignment: renders "Horizontal Alignment" enum field', async () => {
      const result = render(
        <TextInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateEnumField(result, 'Layout', {
        field: 'horizontalAlignment',
        label: 'Horizontal Alignment',
        value: mockData.horizontalAlignment,
        onChange: mockHandleChangeData,
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
