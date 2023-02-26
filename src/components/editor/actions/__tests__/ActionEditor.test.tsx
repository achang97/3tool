import { updateFocusedAction } from '@app/redux/features/editorSlice';
import { Action, ActionType } from '@app/types';
import { within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockTool } from '@tests/constants/data';
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

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(() => ({})),
}));

describe('ActionEditor', () => {
  it('renders tabs', () => {
    const result = render(<ActionEditor action={mockAction} />);
    expect(result.getByText('General')).toBeTruthy();
    expect(result.getByText('Response Handler')).toBeTruthy();
  });

  it('renders button to run and save', () => {
    const result = render(<ActionEditor action={mockAction} />);
    expect(result.getByTestId('save-run-button')).toBeTruthy();
  });

  describe('tab navigation', () => {
    it('navigates to General tab', async () => {
      const result = render(<ActionEditor action={mockAction} />);
      await userEvent.click(result.getByText('General'));
      expect(result.getByTestId('javascript-editor')).toBeTruthy();
    });

    it('navigates to Response Handler tab', async () => {
      const result = render(<ActionEditor action={mockAction} />);
      await userEvent.click(result.getByText('Response Handler'));
      expect(result.getByTestId('response-handler-editor')).toBeTruthy();
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
      ({ type, testId }: { type: ActionType; testId: string }) => {
        const result = render(
          <ActionEditor action={{ ...mockAction, type }} />
        );
        expect(result.getByTestId(testId)).toBeTruthy();
      }
    );

    it('dispatches action to update focused action', async () => {
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
