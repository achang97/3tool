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
import { NumberInputInspector } from '../NumberInputInspector';

const mockName = 'name';
const mockData: Component['data']['numberInput'] = {
  defaultValue: 'Default Value',
  placeholder: 'Placeholder',
  label: 'Label',
  disabled: 'disabled',
  required: 'required',
  minimum: '1',
  maximum: '5',
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

describe('NumberInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Basic');
    });

    it('defaultValue: renders "Default Value" number field', async () => {
      render(
        <NumberInputInspector
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
        data: { type: COMPONENT_DATA_TYPES.numberInput.defaultValue },
      });
    });

    it('placeholder: renders "Placeholder" number field', async () => {
      render(
        <NumberInputInspector
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
        data: { type: COMPONENT_DATA_TYPES.numberInput.placeholder },
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Label');
    });

    it('label: renders "Label" number field', async () => {
      render(
        <NumberInputInspector
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
        data: { type: COMPONENT_DATA_TYPES.numberInput.label },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Interaction');
    });

    it('disabled: renders "Disabled" number field', async () => {
      render(
        <NumberInputInspector
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
        data: { type: COMPONENT_DATA_TYPES.numberInput.disabled },
      });
    });

    it('eventHandlers: renders event handlers component', async () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateComponentEventHandlers('Interaction', {
        eventHandlers: mockEventHandlers,
        eventOptions: COMPONENT_CONFIGS.numberInput.events,
        onChange: mockHandleEventHandlersChange,
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection('Validation');
    });

    it('required: renders "Required" number field', async () => {
      render(
        <NumberInputInspector
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
        data: { type: COMPONENT_DATA_TYPES.numberInput.required },
      });
    });

    it('minimum: renders "Minimum" number field', async () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Validation', {
        field: 'minimum',
        label: 'Minimum',
        value: mockData.minimum,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.minimum },
      });
    });

    it('maximum: renders "Maximum" number field', async () => {
      render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField('Validation', {
        field: 'maximum',
        label: 'Maximum',
        value: mockData.maximum,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.maximum },
      });
    });
  });
});
