import { ActionResult } from '@app/constants';
import { setActionResult } from '@app/redux/features/activeToolSlice';
import { Action, ActionEvent, ActionType } from '@app/types';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useActionHandleResult } from '../useActionHandleResult';

const mockEnqueueSnackbar = jest.fn();
const mockDispatch = jest.fn();
const mockExecuteEventHandler = jest.fn();

const mockAction = {
  name: 'action1',
  eventHandlers: [
    {
      event: ActionEvent.Success,
    },
    {
      event: ActionEvent.Error,
    },
  ],
} as Action;

const mockErrorResult: ActionResult = {
  data: undefined,
  error: 'Error',
};
const mockSuccessResult: ActionResult = {
  data: 1,
};

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('../useEventHandlerExecute', () => ({
  useEventHandlerExecute: jest.fn(() => mockExecuteEventHandler),
}));

describe('useActionHandleResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches action to set the action result', () => {
    const { result } = renderHook(() => useActionHandleResult());

    result.current(mockAction, mockSuccessResult);
    expect(mockDispatch).toHaveBeenCalledWith(
      setActionResult({ name: mockAction.name, result: mockSuccessResult })
    );
  });

  describe('success', () => {
    it('enqueues success snackbar on success', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockSuccessResult);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(`${mockAction.name} executed`, {
        variant: 'success',
      });
    });

    describe('smart contract write', () => {
      it('does not enqueue snackbar if data is undefined', async () => {
        const { result } = renderHook(() => useActionHandleResult());
        result.current({ ...mockAction, type: ActionType.SmartContractWrite }, { data: undefined });
        expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
      });

      it('enqueues persisted snackbar with single url', async () => {
        const { result } = renderHook(() => useActionHandleResult());

        result.current(
          { ...mockAction, type: ActionType.SmartContractWrite },
          { data: { blockExplorerUrl: 'https://google.com' } }
        );
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          `${mockAction.name} executed`,
          expect.objectContaining({
            variant: 'success',
            persist: true,
          })
        );

        render(mockEnqueueSnackbar.mock.calls[0][1].action);
        await userEvent.click(screen.getByText('View transaction'));
        expect(window.open).toHaveBeenCalledWith('https://google.com');
      });

      it('enqueues persisted snackbar with multiple urls', async () => {
        const { result } = renderHook(() => useActionHandleResult());

        result.current(
          { ...mockAction, type: ActionType.SmartContractWrite },
          {
            data: [
              { element: 1, data: { blockExplorerUrl: 'https://google.com' } },
              { element: 2, data: { blockExplorerUrl: 'https://yahoo.com' } },
            ],
          }
        );
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          `${mockAction.name} executed`,
          expect.objectContaining({
            variant: 'success',
            persist: true,
          })
        );

        render(mockEnqueueSnackbar.mock.calls[0][1].action);
        await userEvent.click(screen.getByText('View transactions'));
        expect(screen.getByTestId('view-transactions-menu-option-0')).toHaveProperty(
          'href',
          'https://google.com/'
        );
        expect(screen.getByTestId('view-transactions-menu-option-1')).toHaveProperty(
          'href',
          'https://yahoo.com/'
        );
      });
    });

    it('executes success event handlers', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockSuccessResult);
      expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockAction.eventHandlers[0]);
      expect(mockExecuteEventHandler).not.toHaveBeenCalledWith(mockAction.eventHandlers[1]);
    });
  });

  describe('error', () => {
    it('enqueues error snackbar on error', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockErrorResult);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(`${mockAction.name} failed`, {
        variant: 'error',
      });
    });

    it('executes error event handlers', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockErrorResult);
      expect(mockExecuteEventHandler).not.toHaveBeenCalledWith(mockAction.eventHandlers[0]);
      expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockAction.eventHandlers[1]);
    });
  });
});
