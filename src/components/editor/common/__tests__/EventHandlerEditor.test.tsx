import {
  EVENT_HANDLER_EVENT_CONFIGS,
  EVENT_HANDLER_CONFIGS,
  EVENT_HANDLER_DATA_TEMPLATES,
} from '@app/constants';
import { ActionMethod, ComponentEvent, EventHandlerType } from '@app/types';
import userEvent from '@testing-library/user-event';
import { validateSelectField } from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { EventHandlerEditor } from '../EventHandlerEditor';

const mockName = 'name';
const mockEventOptions = [ComponentEvent.Click, ComponentEvent.Submit];
const mockHandleChange = jest.fn();

const mockActionNames = ['action1', 'action2'];

jest.mock('@app/components/editor/hooks/useToolElementNames', () => ({
  useToolElementNames: jest.fn(() => ({
    actionNames: mockActionNames,
    componentNames: [],
  })),
}));

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('EventHandlerEditor', () => {
  describe('event', () => {
    it('renders select', async () => {
      const result = render(
        <EventHandlerEditor
          name={mockName}
          eventOptions={mockEventOptions}
          eventHandler={{
            event: ComponentEvent.Click,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: '',
                method: ActionMethod.Trigger,
              },
            },
          }}
          onChange={mockHandleChange}
        />
      );

      await validateSelectField(result, undefined, {
        field: 'event',
        label: 'Event',
        value: ComponentEvent.Click,
        onChange: mockHandleChange,
        data: {
          options: mockEventOptions.map((eventOption) => ({
            label: EVENT_HANDLER_EVENT_CONFIGS[eventOption].label,
            value: eventOption,
          })),
        },
      });
    });

    it('displays "Select event" placeholder', () => {
      const result = render(
        <EventHandlerEditor
          name={mockName}
          eventOptions={mockEventOptions}
          eventHandler={{
            event: '' as ComponentEvent,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: '',
                method: ActionMethod.Trigger,
              },
            },
          }}
          onChange={mockHandleChange}
        />
      );

      expect(result.getByText('Select event')).toBeTruthy();
    });
  });

  describe('type', () => {
    it('renders select', async () => {
      const result = render(
        <EventHandlerEditor
          name={mockName}
          eventOptions={mockEventOptions}
          eventHandler={{
            event: ComponentEvent.Click,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: '',
                method: ActionMethod.Trigger,
              },
            },
          }}
          onChange={mockHandleChange}
        />
      );

      await validateSelectField(result, undefined, {
        field: 'type',
        label: 'Effect',
        value: EventHandlerType.Action,
        onChange: mockHandleChange,
        data: {
          options: Object.values(EventHandlerType).map((eventHandlerType) => ({
            label: EVENT_HANDLER_CONFIGS[eventHandlerType].label,
            value: eventHandlerType,
          })),
        },
      });
    });

    it('renders "Select effect" placeholder', () => {
      const result = render(
        <EventHandlerEditor
          name={mockName}
          eventOptions={mockEventOptions}
          eventHandler={{
            event: ComponentEvent.Click,
            type: '' as EventHandlerType,
            data: {
              action: {
                actionName: '',
                method: ActionMethod.Trigger,
              },
            },
          }}
          onChange={mockHandleChange}
        />
      );

      expect(result.getByText('Select effect')).toBeTruthy();
    });

    it('updates data field on type change', async () => {
      const result = render(
        <EventHandlerEditor
          name={mockName}
          eventOptions={mockEventOptions}
          eventHandler={{
            event: ComponentEvent.Click,
            type: '' as EventHandlerType,
            data: {
              action: {
                actionName: '',
                method: ActionMethod.Trigger,
              },
            },
          }}
          onChange={mockHandleChange}
        />
      );

      await userEvent.click(result.getByLabelText('Effect'));
      await userEvent.click(
        result.getByRole('option', { name: EVENT_HANDLER_CONFIGS.action.label })
      );

      expect(mockHandleChange).toHaveBeenCalledWith({
        type: EventHandlerType.Action,
        data: {
          action: EVENT_HANDLER_DATA_TEMPLATES.action,
        },
      });
    });
  });

  describe('effect configuration', () => {
    it.each`
      eventHandlerType           | testId
      ${EventHandlerType.Action} | ${'event-handler-action-editor'}
      ${EventHandlerType.Url}    | ${'event-handler-url-editor'}
    `(
      'renders effect configuration component for $eventHandlerType',
      ({
        eventHandlerType,
        testId,
      }: {
        eventHandlerType: EventHandlerType;
        testId: string;
      }) => {
        const result = render(
          <EventHandlerEditor
            name={mockName}
            eventOptions={mockEventOptions}
            eventHandler={{
              event: ComponentEvent.Click,
              type: eventHandlerType,
              data: {
                action: {
                  actionName: '',
                  method: ActionMethod.Trigger,
                },
              },
            }}
            onChange={mockHandleChange}
          />
        );

        expect(result.getByTestId(testId)).toBeTruthy();
      }
    );

    it('updates data field on change', async () => {
      const result = render(
        <EventHandlerEditor
          name={mockName}
          eventOptions={mockEventOptions}
          eventHandler={{
            event: ComponentEvent.Click,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: '',
                method: ActionMethod.Trigger,
              },
            },
          }}
          onChange={mockHandleChange}
        />
      );

      await userEvent.click(result.getByLabelText('Action'));
      await userEvent.click(result.getByRole('option', { name: 'action1' }));

      expect(mockHandleChange).toHaveBeenCalledWith({
        data: {
          action: {
            actionName: 'action1',
          },
        },
      });
    });
  });
});
