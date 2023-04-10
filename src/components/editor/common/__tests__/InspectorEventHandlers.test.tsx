import { EVENT_HANDLER_EVENT_CONFIGS, EVENT_HANDLER_DATA_TEMPLATES } from '@app/constants';
import { ComponentEvent, EventHandler, EventHandlerType } from '@app/types';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import _ from 'lodash';
import { InspectorEventHandlers } from '../InspectorEventHandlers';

const mockLabel = 'label';
const mockName = 'name';
const mockEventHandlers: EventHandler<ComponentEvent>[] = [
  {
    event: ComponentEvent.Click,
    type: EventHandlerType.Url,
    data: {},
  },
];
const mockPlaceholder = 'placeholder';
const mockEventOptions: ComponentEvent[] = [ComponentEvent.Click, ComponentEvent.Submit];
const mockHandleChange = jest.fn();

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('InspectorEventHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );
    expect(result.getByText(mockLabel)).toBeTruthy();
  });

  it('renders placeholder if there are no event handlers', () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={[]}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );

    expect(result.getByText(mockPlaceholder));
  });

  it('renders table of current event handlers', () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );

    expect(result.getByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label));
    expect(result.getByText('utils.openUrl()'));
  });

  it('deletes event handler', async () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );

    await userEvent.click(result.getByTestId('MoreVertIcon'));
    await userEvent.click(result.getByTestId('event-handler-delete-icon'));

    expect(mockHandleChange).toHaveBeenCalledWith([]);
  });

  it('renders button to create new event handler', async () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={[]}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );

    const createButton = result.getByText('Add event handler');
    await userEvent.click(createButton);

    const newEventHandler: EventHandler<ComponentEvent> = {
      type: EventHandlerType.Action,
      event: mockEventOptions[0],
      data: {
        action: EVENT_HANDLER_DATA_TEMPLATES.action,
      },
    };
    expect(mockHandleChange).toHaveBeenCalledWith([newEventHandler]);

    result.rerender(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={[newEventHandler]}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );
    expect(result.getByTestId('event-handler-editor')).toBeTruthy();
  });

  it('displays and edits event handler on row click', async () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );

    await userEvent.click(
      result.getByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label)
    );
    expect(result.getByTestId('event-handler-editor')).toBeTruthy();

    await userEvent.click(result.getByLabelText('New Tab'));
    expect(mockHandleChange).toHaveBeenCalledWith([
      _.merge(mockEventHandlers[0], {
        data: {
          url: {
            newTab: true,
          },
        },
      }),
    ]);
  });

  it('closes event handler editor when clicking outside of event handler editor', async () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
      />
    );

    await userEvent.click(
      result.getByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label)
    );
    expect(result.getByTestId('event-handler-editor')).toBeTruthy();

    await userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId('event-handler-editor')).toBeNull();
    });
  });

  it('hides event column if hideEventColumn is true', () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
        hideEventColumn
      />
    );

    expect(result.queryByText('Event')).toBeNull();
    expect(
      result.queryByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label)
    ).toBeNull();
  });

  it('hides column headers if hideColumnHeaders is true', () => {
    const result = render(
      <InspectorEventHandlers
        label={mockLabel}
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
        placeholder={mockPlaceholder}
        menuPosition="left"
        hideColumnHeaders
      />
    );

    expect(result.getByText('Event')).not.toBeVisible();
    expect(result.getByText('Effect')).not.toBeVisible();
  });
});
