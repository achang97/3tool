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
import { TextInputInspector } from '../TextInputInspector';

const mockName = 'name';
const mockData: Component['data']['textInput'] = {
  defaultValue: 'Default Value',
  placeholder: 'Placeholder',
  label: 'Label',
  disabled: 'disabled',
  required: 'required',
  minLength: '1',
  maxLength: '5',
};
const mockEventHandlers: EventHandler<ComponentEvent>[] = [
  {
    event: ComponentEvent.Submit,
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

describe('TextInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Basic');
    });

    it('defaultValue: renders "Default Value" text field', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Basic', {
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.defaultValue,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.textInput.defaultValue },
      });
    });

    it('placeholder: renders "Placeholder" text field', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Basic', {
        field: 'placeholder',
        label: 'Placeholder',
        value: mockData.placeholder,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.textInput.placeholder },
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Label');
    });

    it('label: renders "Label" text field', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Label', {
        field: 'label',
        label: 'Label',
        value: mockData.label,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.textInput.label },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      render(
        <TextInputInspector
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
        <TextInputInspector
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
        data: { type: COMPONENT_DATA_TYPES.textInput.disabled },
      });
    });

    it('eventHandlers: renders event handlers component', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateComponentEventHandlers('Interaction', {
        eventHandlers: mockEventHandlers,
        eventOptions: COMPONENT_CONFIGS.textInput.events,
        onChange: mockHandleEventHandlersChange,
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Validation');
    });

    it('required: renders "Required" text field', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Validation', {
        field: 'required',
        label: 'Required',
        value: mockData.required,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.textInput.required },
      });
    });

    it('minLength: renders "Min Length" text field', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Validation', {
        field: 'minLength',
        label: 'Min Length',
        value: mockData.minLength,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.textInput.minLength },
      });
    });

    it('maxLength: renders "Max Length" text field', async () => {
      render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Validation', {
        field: 'maxLength',
        label: 'Max Length',
        value: mockData.maxLength,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.textInput.maxLength },
      });
    });
  });
});
