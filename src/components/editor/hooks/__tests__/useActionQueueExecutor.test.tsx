import { ActionResult } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactElement, useEffect } from 'react';
import { ActionQueueProvider } from '../../contexts/ActionQueueContext';
import { useActionQueue } from '../useActionQueue';
import { useActionQueueExecutor } from '../useActionQueueExecutor';

const mockExecuteAction = jest.fn();

jest.mock('../useActionExecute', () => ({
  useActionExecute: jest.fn(() => mockExecuteAction),
}));

describe('useActionQueueExecutor', () => {
  it('dequeues and executes action from queue', async () => {
    const mockResult: ActionResult = {
      data: 'something',
    };
    mockExecuteAction.mockImplementation(() => mockResult);

    const mockAction = {
      type: ActionType.Javascript,
      name: 'action1',
    } as Action;
    const mockHandleExecute = jest.fn();

    renderHook(
      () => {
        useActionQueueExecutor();
        const { enqueueAction } = useActionQueue();

        useEffect(() => {
          enqueueAction(mockAction, mockHandleExecute);
        }, [enqueueAction]);
      },
      {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActionQueueProvider>{children}</ActionQueueProvider>
        ),
      }
    );

    expect(mockExecuteAction).toHaveBeenCalledWith(mockAction);
    await waitFor(() => {
      expect(mockHandleExecute).toHaveBeenCalledWith(mockResult);
    });
  });
});
