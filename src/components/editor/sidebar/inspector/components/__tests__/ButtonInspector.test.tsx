import { COMPONENT_CONFIGS, COMPONENT_DATA_TYPES } from '@app/constants';
import {
  ActionMethod,
  Component,
  ComponentEvent,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import {
  validateTextField,
  validateSection,
  validateComponentEventHandlers,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { ButtonInspector } from '../ButtonInspector';

const mockName = 'name';
const mockData: Component['data']['button'] = {
  text: 'text',
  disabled: 'disabled',
  loading: 'loading',
};
const mockEventHandlers: EventHandler<ComponentEvent>[] = [
  {
    event: ComponentEvent.Click,
    type: EventHandlerType.Action,
    data: {
      action: {
        actionName: '',
        method: ActionMethod.Trigger,
      },
    },
  },
];

const mockHandleDataChange = jest.fn();
const mockHandleEventHandlersChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
}));

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('ButtonInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Basic');
    });

    it('text: renders "Text" text field', async () => {
      render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Basic', {
        field: 'text',
        label: 'Text',
        value: mockData.text,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.button.text },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Interaction');
    });

    it('disabled: renders "Disabled" text field', async () => {
      render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Interaction', {
        field: 'disabled',
        label: 'Disabled',
        value: mockData.disabled,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.button.disabled },
      });
    });

    it('loading: renders "Loading" text field', async () => {
      render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Interaction', {
        field: 'loading',
        label: 'Loading',
        value: mockData.loading,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.button.loading },
      });
    });

    it('eventHandlers: renders event handlers component', async () => {
      render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateComponentEventHandlers('Interaction', {
        eventHandlers: mockEventHandlers,
        eventOptions: COMPONENT_CONFIGS.button.events,
        onChange: mockHandleEventHandlersChange,
      });
    });
  });
});
