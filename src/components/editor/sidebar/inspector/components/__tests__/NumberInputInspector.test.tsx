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

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('NumberInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection(result, 'Basic');
    });

    it('defaultValue: renders "Default Value" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Basic', {
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.defaultValue,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.defaultValue },
      });
    });

    it('placeholder: renders "Placeholder" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Basic', {
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
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection(result, 'Label');
    });

    it('label: renders "Label" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Label', {
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
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Interaction', {
        field: 'disabled',
        label: 'Disabled',
        value: mockData.disabled,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.disabled },
      });
    });

    it('eventHandlers: renders event handlers component', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateComponentEventHandlers(result, 'Interaction', {
        eventHandlers: mockEventHandlers,
        eventOptions: COMPONENT_CONFIGS.numberInput.events,
        onChange: mockHandleEventHandlersChange,
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );
      validateSection(result, 'Validation');
    });

    it('required: renders "Required" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Validation', {
        field: 'required',
        label: 'Required',
        value: mockData.required,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.required },
      });
    });

    it('minimum: renders "Minimum" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Validation', {
        field: 'minimum',
        label: 'Minimum',
        value: mockData.minimum,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.minimum },
      });
    });

    it('maximum: renders "Maximum" number field', async () => {
      const result = render(
        <NumberInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onDataChange={mockHandleDataChange}
          onEventHandlersChange={mockHandleEventHandlersChange}
        />
      );

      await validateTextField(result, 'Validation', {
        field: 'maximum',
        label: 'Maximum',
        value: mockData.maximum,
        onChange: mockHandleDataChange,
        data: { type: COMPONENT_DATA_TYPES.numberInput.maximum },
      });
    });
  });
});
