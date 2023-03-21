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

describe('TextInputInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Basic');
    });

    it('defaultValue: renders "Default Value" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Basic', {
        field: 'defaultValue',
        label: 'Default Value',
        value: mockData.defaultValue,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.defaultValue },
      });
    });

    it('placeholder: renders "Placeholder" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Basic', {
        field: 'placeholder',
        label: 'Placeholder',
        value: mockData.placeholder,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.placeholder },
      });
    });
  });

  describe('Label', () => {
    it('renders "Label" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Label');
    });

    it('label: renders "Label" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Label', {
        field: 'label',
        label: 'Label',
        value: mockData.label,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.label },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Interaction');
    });

    it('disabled: renders "Disabled" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Interaction', {
        field: 'disabled',
        label: 'Disabled',
        value: mockData.disabled,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.disabled },
      });
    });

    it('eventHandlers: renders event handlers component', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateComponentEventHandlers(result, 'Interaction', {
        eventHandlers: mockEventHandlers,
        eventOptions: COMPONENT_CONFIGS.textInput.events,
        onChange: mockHandleChangeEventHandlers,
      });
    });
  });

  describe('Validation', () => {
    it('renders "Validation" title', () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Validation');
    });

    it('required: renders "Required" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Validation', {
        field: 'required',
        label: 'Required',
        value: mockData.required,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.required },
      });
    });

    it('minLength: renders "Min Length" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Validation', {
        field: 'minLength',
        label: 'Min Length',
        value: mockData.minLength,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.minLength },
      });
    });

    it('maxLength: renders "Max Length" text field', async () => {
      const result = render(
        <TextInputInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Validation', {
        field: 'maxLength',
        label: 'Max Length',
        value: mockData.maxLength,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.textInput.maxLength },
      });
    });
  });
});
