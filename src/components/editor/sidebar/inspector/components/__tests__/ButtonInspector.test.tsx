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
  validateEventHandlers,
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

describe('ButtonInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic', () => {
    it('renders "Basic" title', () => {
      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Basic');
    });

    it('text: renders "Text" text field', async () => {
      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Basic', {
        field: 'text',
        label: 'Text',
        value: mockData.text,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.button.text },
      });
    });
  });

  describe('Interaction', () => {
    it('renders "Interaction" title', () => {
      const result = render(
        <ButtonInspector
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
        <ButtonInspector
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
        data: { type: COMPONENT_DATA_TYPES.button.disabled },
      });
    });

    it('loading: renders "Loading" text field', async () => {
      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Interaction', {
        field: 'loading',
        label: 'Loading',
        value: mockData.loading,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.button.loading },
      });
    });

    it('eventHandlers: renders event handlers component', async () => {
      const result = render(
        <ButtonInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateEventHandlers(result, 'Interaction', {
        label: 'Event handlers',
        eventHandlers: mockEventHandlers,
        eventOptions: COMPONENT_CONFIGS.button.events,
        onChange: mockHandleChangeEventHandlers,
      });
    });
  });
});
