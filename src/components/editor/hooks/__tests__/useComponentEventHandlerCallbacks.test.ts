import { ComponentEvent, EventHandler, EventHandlerType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useComponentEventHandlerCallbacks } from '../useComponentEventHandlerCallbacks';

const mockExecuteEventHandler = jest.fn();

jest.mock('../useEventHandlerExecute', () => ({
  useEventHandlerExecute: jest.fn(() => mockExecuteEventHandler),
}));

describe('useComponentEventHandlerCallbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('aggregates multiple handlers of different types', () => {
    const mockEventHandlers = [
      {
        event: ComponentEvent.Click,
        type: EventHandlerType.Url,
      },
      {
        event: ComponentEvent.Click,
        type: EventHandlerType.Action,
      },
      {
        event: ComponentEvent.Submit,
        type: EventHandlerType.Action,
      },
    ] as EventHandler<ComponentEvent>[];

    const { result } = renderHook(() => useComponentEventHandlerCallbacks(mockEventHandlers));

    result.current.onClick(new Event(''));
    expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockEventHandlers[0]);
    expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockEventHandlers[1]);

    result.current.onKeyDown(new KeyboardEvent('', { key: 'Enter' }));
    expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockEventHandlers[2]);
  });

  describe('onClick', () => {
    it('returns onClick method for click event type', () => {
      const mockEventHandlers = [
        {
          event: ComponentEvent.Click,
          type: EventHandlerType.Url,
        },
      ] as EventHandler<ComponentEvent>[];

      const { result } = renderHook(() => useComponentEventHandlerCallbacks(mockEventHandlers));
      result.current.onClick(new Event(''));
      expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockEventHandlers[0]);
    });
  });

  describe('onSubmit', () => {
    it('returns onKeyDown method for submit event type', () => {
      const mockEventHandlers = [
        {
          event: ComponentEvent.Submit,
          type: EventHandlerType.Url,
        },
      ] as EventHandler<ComponentEvent>[];

      const { result } = renderHook(() => useComponentEventHandlerCallbacks(mockEventHandlers));
      result.current.onKeyDown(new KeyboardEvent('', { key: 'Enter' }));
      expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockEventHandlers[0]);
    });

    it('does not execute event handlers if key is not Enter', () => {
      const mockEventHandlers = [
        {
          event: ComponentEvent.Submit,
          type: EventHandlerType.Url,
        },
      ] as EventHandler<ComponentEvent>[];

      const { result } = renderHook(() => useComponentEventHandlerCallbacks(mockEventHandlers));
      result.current.onKeyDown(new KeyboardEvent('', { key: 'Space' }));
      expect(mockExecuteEventHandler).not.toHaveBeenCalled();
    });
  });
});
