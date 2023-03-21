import { updateFocusedAction } from '@app/redux/features/editorSlice';
import {
  ActionEvent,
  ActionMethod,
  EventHandlerType,
  EventHandler,
} from '@app/types';
import { within } from '@testing-library/dom';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponseHandlerEditor } from '../ResponseHandlerEditor';

const mockName = 'name';
const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(() => ({})),
}));

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('ResponseHandlerEditor', () => {
  const getSuccessContainer = (result: RenderResult) => {
    const container = within(result.getByTestId('action-success-handlers'));
    return container;
  };

  const getErrorContainer = (result: RenderResult) => {
    const container = within(result.getByTestId('action-error-handlers'));
    return container;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('general', () => {
    it('does not render event column', () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      expect(result.queryByText('Event')).toBeNull();
    });

    it('does not render column headers', () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );

      expect(getSuccessContainer(result).getByText('Effect')).not.toBeVisible();
      expect(getErrorContainer(result).getByText('Effect')).not.toBeVisible();
    });

    it('only updates event handlers of edited type', async () => {
      const mockEventHandlers: EventHandler[] = [
        {
          event: ActionEvent.Success,
          type: EventHandlerType.Url,
          data: {},
        },
        {
          event: ActionEvent.Error,
          type: EventHandlerType.Url,
          data: {},
        },
        {
          event: ActionEvent.Success,
          type: EventHandlerType.Url,
          data: {},
        },
      ];
      const result = render(
        <ResponseHandlerEditor
          name={mockName}
          eventHandlers={mockEventHandlers}
        />
      );

      const container = getErrorContainer(result);
      await userEvent.click(container.getByText('utils.openUrl()'));
      await userEvent.click(result.getByLabelText('New Tab'));

      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedAction({
          eventHandlers: [
            mockEventHandlers[0],
            mockEventHandlers[2],
            {
              type: EventHandlerType.Url,
              event: ActionEvent.Error,
              data: {
                url: { newTab: true },
              },
            },
          ],
        })
      );
    });
  });

  describe('success handlers', () => {
    it('renders label', () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      const container = getSuccessContainer(result);

      expect(container.getByText('Success handlers')).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      const container = getSuccessContainer(result);

      expect(
        container.getByText(
          'Trigger actions, control components, or call other APIs in response to action success.'
        )
      ).toBeTruthy();
    });

    it('renders success handlers', () => {
      const result = render(
        <ResponseHandlerEditor
          name={mockName}
          eventHandlers={[
            {
              event: ActionEvent.Success,
              type: EventHandlerType.Url,
              data: {},
            },
          ]}
        />
      );
      const container = getSuccessContainer(result);

      expect(container.getByText('utils.openUrl()')).toBeTruthy();
    });

    it('creates new success handler', async () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      const container = getSuccessContainer(result);

      await userEvent.click(container.getByText('Add event handler'));
      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedAction({
          eventHandlers: [
            {
              type: EventHandlerType.Action,
              event: ActionEvent.Success,
              data: {
                action: { actionName: '', method: ActionMethod.Trigger },
              },
            },
          ],
        })
      );
    });
  });

  describe('error handlers', () => {
    it('renders label', () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      const container = getErrorContainer(result);

      expect(container.getByText('Error handlers')).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      const container = getErrorContainer(result);

      expect(
        container.getByText(
          'Trigger actions, control components, or call other APIs in response to action failure.'
        )
      ).toBeTruthy();
    });

    it('renders error handlers', () => {
      const result = render(
        <ResponseHandlerEditor
          name={mockName}
          eventHandlers={[
            {
              event: ActionEvent.Error,
              type: EventHandlerType.Url,
              data: {},
            },
          ]}
        />
      );
      const container = getErrorContainer(result);

      expect(container.getByText('utils.openUrl()')).toBeTruthy();
    });

    it('creates new error handler', async () => {
      const result = render(
        <ResponseHandlerEditor name={mockName} eventHandlers={[]} />
      );
      const container = getErrorContainer(result);

      await userEvent.click(container.getByText('Add event handler'));
      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedAction({
          eventHandlers: [
            {
              type: EventHandlerType.Action,
              event: ActionEvent.Error,
              data: {
                action: { actionName: '', method: ActionMethod.Trigger },
              },
            },
          ],
        })
      );
    });
  });
});
