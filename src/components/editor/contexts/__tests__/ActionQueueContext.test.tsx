import { Action, ActionType } from '@app/types';
import { act, screen, render, renderHook } from '@testing-library/react';
import { ReactElement, useContext } from 'react';
import { ActionQueueContext, ActionQueueElement, ActionQueueProvider } from '../ActionQueueContext';

describe('ActionQueueContext', () => {
  it('renders children', () => {
    const mockChildren = 'children';
    render(<ActionQueueProvider>{mockChildren}</ActionQueueProvider>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('returns default state', () => {
    const { result } = renderHook(() => useContext(ActionQueueContext));
    expect(result.current).toEqual({
      actionQueue: [],
      enqueueAction: expect.any(Function),
      dequeueAction: expect.any(Function),
    });
  });

  it('enqueues action', async () => {
    const { result } = renderHook(() => useContext(ActionQueueContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActionQueueProvider>{children}</ActionQueueProvider>
      ),
    });
    expect(result.current.actionQueue).toEqual([]);

    const mockAction = {
      type: ActionType.Javascript,
      name: 'action1',
    } as Action;
    const mockHandleExecute = jest.fn();

    expect(result.current.actionQueue).toEqual([]);
    await act(() => {
      result.current.enqueueAction(mockAction, mockHandleExecute);
    });
    expect(result.current.actionQueue).toEqual([
      { action: mockAction, onExecute: mockHandleExecute },
    ]);
  });

  it('dequeues action', async () => {
    const { result } = renderHook(() => useContext(ActionQueueContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActionQueueProvider>{children}</ActionQueueProvider>
      ),
    });
    expect(result.current.actionQueue).toEqual([]);

    const mockAction = {
      type: ActionType.Javascript,
      name: 'action1',
    } as Action;
    const mockHandleExecute = jest.fn();

    await act(() => {
      result.current.enqueueAction(mockAction, mockHandleExecute);
    });
    expect(result.current.actionQueue).toEqual([
      { action: mockAction, onExecute: mockHandleExecute },
    ]);

    let actionElement: Promise<ActionQueueElement | undefined>;
    await act(() => {
      actionElement = result.current.dequeueAction();
    });
    // @ts-ignore actionElement is assigned
    expect(await actionElement).toEqual({
      action: mockAction,
      onExecute: mockHandleExecute,
    });
    expect(result.current.actionQueue).toEqual([]);
  });

  it('dequeues action from empty queue as undefined', async () => {
    const { result } = renderHook(() => useContext(ActionQueueContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActionQueueProvider>{children}</ActionQueueProvider>
      ),
    });

    expect(result.current.actionQueue).toEqual([]);

    let actionElement: Promise<ActionQueueElement | undefined>;
    await act(() => {
      actionElement = result.current.dequeueAction();
    });
    // @ts-ignore actionElement is assigned
    expect(await actionElement).toBeUndefined();
    expect(result.current.actionQueue).toEqual([]);
  });
});
