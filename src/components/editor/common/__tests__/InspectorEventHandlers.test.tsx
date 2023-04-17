import { EVENT_HANDLER_EVENT_CONFIGS, EVENT_HANDLER_DATA_TEMPLATES } from '@app/constants';
import { ComponentEvent, EventHandler, EventHandlerType } from '@app/types';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
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

describe('InspectorEventHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    render(
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
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('renders placeholder if there are no event handlers', () => {
    render(
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

    expect(screen.getByText(mockPlaceholder));
  });

  it('renders table of current event handlers', () => {
    render(
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

    expect(screen.getByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label));
    expect(screen.getByText('utils.openUrl()'));
  });

  it('deletes event handler', async () => {
    render(
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

    await userEvent.click(screen.getByTestId('MoreVertIcon'));
    await userEvent.click(screen.getByTestId('event-handler-delete-icon'));

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

    const createButton = screen.getByText('Add event handler');
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
    expect(screen.getByTestId('event-handler-editor')).toBeTruthy();
  });

  it('displays and edits event handler on row click', async () => {
    render(
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
      screen.getByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label)
    );
    expect(screen.getByTestId('event-handler-editor')).toBeTruthy();

    await userEvent.click(screen.getByLabelText('New Tab'));
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
    render(
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
      screen.getByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label)
    );
    expect(screen.getByTestId('event-handler-editor')).toBeTruthy();

    await userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(screen.queryByTestId('event-handler-editor')).toBeNull();
    });
  });

  it('hides event column if hideEventColumn is true', () => {
    render(
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

    expect(screen.queryByText('Event')).toBeNull();
    expect(
      screen.queryByText(EVENT_HANDLER_EVENT_CONFIGS[mockEventHandlers[0].event].label)
    ).toBeNull();
  });

  it('hides column headers if hideColumnHeaders is true', () => {
    render(
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

    expect(screen.getByText('Event')).not.toBeVisible();
    expect(screen.getByText('Effect')).not.toBeVisible();
  });
});
