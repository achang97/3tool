import {
  setActionView,
  updateFocusedAction,
} from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { Action, ActionType, ActionViewType } from '@app/types';
import { within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockTool } from '@tests/constants/data';
import { useActionCycleListener } from '../../hooks/useActionCycleListener';
import { ActionEditor } from '../ActionEditor';

const mockAction = {
  name: 'action1',
  type: ActionType.Javascript,
  data: {},
} as Action;
const mockDispatch = jest.fn();

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
      from: 0,
      options: [],
    })),
  })
);

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

jest.mock('@app/components/editor/hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
  })),
}));

jest.mock('@app/components/editor/hooks/useActionCycleListener');

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(() => ({})),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('ActionEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      actionView: ActionViewType.General,
    }));
  });

  it('renders tabs', () => {
    const result = render(<ActionEditor action={mockAction} />);
    expect(result.getByText('General')).toBeTruthy();
    expect(result.getByText('Response Handler')).toBeTruthy();
  });

  it('renders button to run and save', () => {
    const result = render(<ActionEditor action={mockAction} />);
    expect(result.getByTestId('save-run-button')).toBeTruthy();
  });

  it('renders button to maximize / minimize editor', () => {
    const result = render(<ActionEditor action={mockAction} />);
    expect(result.getByTestId('size-control-button')).toBeTruthy();
  });

  it('calls useActionCycleListener to start listening for cycle changes', () => {
    render(<ActionEditor action={mockAction} />);
    expect(useActionCycleListener).toHaveBeenCalledWith(mockAction.name);
  });

  describe('tab navigation', () => {
    it('navigates to General tab', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        actionView: ActionViewType.ResponseHandler,
      }));

      const result = render(<ActionEditor action={mockAction} />);
      await userEvent.click(result.getByText('General'));
      expect(mockDispatch).toHaveBeenCalledWith(
        setActionView(ActionViewType.General)
      );
    });

    it('navigates to Response Handler tab', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        actionView: ActionViewType.General,
      }));

      const result = render(<ActionEditor action={mockAction} />);
      await userEvent.click(result.getByText('Response Handler'));
      expect(mockDispatch).toHaveBeenCalledWith(
        setActionView(ActionViewType.ResponseHandler)
      );
    });
  });

  describe('general', () => {
    it.each`
      type                             | testId
      ${ActionType.Javascript}         | ${'javascript-editor'}
      ${ActionType.SmartContractRead}  | ${'smart-contract-editor'}
      ${ActionType.SmartContractWrite} | ${'smart-contract-editor'}
    `(
      'displays editor for $type type',
      async ({ type, testId }: { type: ActionType; testId: string }) => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          actionView: ActionViewType.General,
        }));

        const result = render(
          <ActionEditor action={{ ...mockAction, type }} />
        );
        expect(result.getByTestId(testId)).toBeTruthy();
      }
    );
  });

  describe('response handler', () => {
    it('renders response handler editor', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        actionView: ActionViewType.ResponseHandler,
      }));

      const result = render(<ActionEditor action={mockAction} />);
      expect(result.getByTestId('response-handler-editor')).toBeTruthy();
    });
  });

  describe('updates', () => {
    it('dispatches action to update focused action', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        actionView: ActionViewType.General,
      }));

      const result = render(
        <ActionEditor action={{ ...mockAction, type: ActionType.Javascript }} />
      );

      const input = within(
        result.getByTestId('code-mirror-JS Code (JavaScript)')
      ).getByRole('textbox');

      const mockValue = '123';
      await userEvent.type(input, mockValue);

      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedAction({
          data: {
            [ActionType.Javascript]: {
              code: mockValue,
            },
          },
        })
      );
    });
  });
});
