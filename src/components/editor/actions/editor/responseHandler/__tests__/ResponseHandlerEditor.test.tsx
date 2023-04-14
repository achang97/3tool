import { updateFocusedAction } from '@app/redux/features/editorSlice';
import { ActionEvent, ActionMethod, EventHandlerType, EventHandler } from '@app/types';
import { within } from '@testing-library/dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { ResponseHandlerEditor } from '../ResponseHandlerEditor';

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(() => ({})),
}));

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('ResponseHandlerEditor', () => {
  const getSuccessContainer = () => {
    const container = within(screen.getByTestId('action-success-handlers'));
    return container;
  };

  const getErrorContainer = () => {
    const container = within(screen.getByTestId('action-error-handlers'));
    return container;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('general', () => {
    it('does not render event column', () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      expect(screen.queryByText('Event')).toBeNull();
    });

    it('does not render column headers', () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);

      expect(getSuccessContainer().getByText('Effect')).not.toBeVisible();
      expect(getErrorContainer().getByText('Effect')).not.toBeVisible();
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
      render(<ResponseHandlerEditor eventHandlers={mockEventHandlers} />);

      const container = getErrorContainer();
      await userEvent.click(container.getByText('utils.openUrl()'));
      await userEvent.click(screen.getByLabelText('New Tab'));

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
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      const container = getSuccessContainer();

      expect(container.getByText('Success handlers')).toBeTruthy();
    });

    it('renders placeholder', () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      const container = getSuccessContainer();

      expect(
        container.getByText(
          'Trigger actions, control components, or call other APIs in response to action success.'
        )
      ).toBeTruthy();
    });

    it('renders success handlers', () => {
      render(
        <ResponseHandlerEditor
          eventHandlers={[
            {
              event: ActionEvent.Success,
              type: EventHandlerType.Url,
              data: {},
            },
          ]}
        />
      );
      const container = getSuccessContainer();

      expect(container.getByText('utils.openUrl()')).toBeTruthy();
    });

    it('creates new success handler', async () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      const container = getSuccessContainer();

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

    it('shows Success as the only event option', async () => {
      render(
        <ResponseHandlerEditor
          eventHandlers={[
            {
              event: ActionEvent.Success,
              type: EventHandlerType.Url,
              data: {},
            },
          ]}
        />
      );
      const container = getSuccessContainer();

      await userEvent.click(container.getByText('utils.openUrl()'));
      await userEvent.click(screen.getByLabelText('Event'));
      const options = screen.getAllByRole('option');
      expect(options.map((option) => option.getAttribute('data-value'))).toEqual([
        ActionEvent.Success,
      ]);
    });
  });

  describe('error handlers', () => {
    it('renders label', () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      const container = getErrorContainer();

      expect(container.getByText('Error handlers')).toBeTruthy();
    });

    it('renders placeholder', () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      const container = getErrorContainer();

      expect(
        container.getByText(
          'Trigger actions, control components, or call other APIs in response to action failure.'
        )
      ).toBeTruthy();
    });

    it('renders error handlers', () => {
      render(
        <ResponseHandlerEditor
          eventHandlers={[
            {
              event: ActionEvent.Error,
              type: EventHandlerType.Url,
              data: {},
            },
          ]}
        />
      );
      const container = getErrorContainer();

      expect(container.getByText('utils.openUrl()')).toBeTruthy();
    });

    it('creates new error handler', async () => {
      render(<ResponseHandlerEditor eventHandlers={[]} />);
      const container = getErrorContainer();

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

    it('shows Error as the only event option', async () => {
      render(
        <ResponseHandlerEditor
          eventHandlers={[
            {
              event: ActionEvent.Error,
              type: EventHandlerType.Url,
              data: {},
            },
          ]}
        />
      );
      const container = getErrorContainer();

      await userEvent.click(container.getByText('utils.openUrl()'));
      await userEvent.click(screen.getByLabelText('Event'));
      const options = screen.getAllByRole('option');
      expect(options.map((option) => option.getAttribute('data-value'))).toEqual([
        ActionEvent.Error,
      ]);
    });
  });
});
