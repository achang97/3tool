import {
  ActionMethod,
  ComponentEvent,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import { renderHook } from '@testing-library/react';
import { utils } from '../../utils/public';
import { useActionMethods } from '../useActionMethods';
import { useEvalArgs } from '../useEvalArgs';
import { useEventHandlerExecute } from '../useEventHandlerExecute';

jest.mock('../useActionMethods');
jest.mock('../useEvalArgs');
jest.mock('../../utils/public', () => ({
  utils: {
    openUrl: jest.fn(),
  },
}));

describe('useEventHandlerExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActionMethods as jest.Mock).mockImplementation(() => ({}));
    (useEvalArgs as jest.Mock).mockImplementation(() => ({}));
  });

  describe('action', () => {
    it('executes action event handler', () => {
      const mockActionMethods = {
        action1: {
          [ActionMethod.Trigger]: jest.fn(),
        },
      };
      (useActionMethods as jest.Mock).mockImplementation(
        () => mockActionMethods
      );

      const mockEventHandler: EventHandler = {
        event: ComponentEvent.Click,
        type: EventHandlerType.Action,
        data: {
          action: {
            actionName: 'action1',
            method: ActionMethod.Trigger,
          },
        },
      };
      const { result } = renderHook(() => useEventHandlerExecute());
      result.current(mockEventHandler);
      expect(
        mockActionMethods.action1[ActionMethod.Trigger]
      ).toHaveBeenCalled();
    });

    it('does not throw error if action is not defined in map', () => {
      (useActionMethods as jest.Mock).mockImplementation(() => ({}));

      const mockEventHandler: EventHandler = {
        event: ComponentEvent.Click,
        type: EventHandlerType.Action,
        data: {
          action: {
            actionName: 'action1',
            method: ActionMethod.Trigger,
          },
        },
      };
      const { result } = renderHook(() => useEventHandlerExecute());
      expect(() => result.current(mockEventHandler)).not.toThrowError();
    });
  });

  describe('url', () => {
    it('executes url event handler', () => {
      (useEvalArgs as jest.Mock).mockImplementation(() => ({
        dynamicEvalArgs: {
          button1: {
            text: 'text',
          },
        },
      }));
      const mockEventHandler: EventHandler = {
        event: ComponentEvent.Click,
        type: EventHandlerType.Url,
        data: {
          url: {
            url: 'https://google.com?query={{ button1.text }}',
            newTab: true,
          },
        },
      };
      const { result } = renderHook(() => useEventHandlerExecute());
      result.current(mockEventHandler);
      expect(utils.openUrl).toHaveBeenCalledWith(
        'https://google.com?query=text',
        { newTab: true }
      );
    });

    it('calls openUrl util function with empty string if there is an error', () => {
      const mockEventHandler: EventHandler = {
        event: ComponentEvent.Click,
        type: EventHandlerType.Url,
        data: {
          url: {
            url: 'https://google.com?query={{ a }}',
            newTab: true,
          },
        },
      };
      const { result } = renderHook(() => useEventHandlerExecute());
      result.current(mockEventHandler);
      expect(utils.openUrl).toHaveBeenCalledWith('', { newTab: true });
    });

    it('does not call openUrl util function if data is not defined', () => {
      const mockEventHandler: EventHandler = {
        event: ComponentEvent.Click,
        type: EventHandlerType.Url,
        data: {},
      };
      const { result } = renderHook(() => useEventHandlerExecute());
      result.current(mockEventHandler);
      expect(utils.openUrl).not.toHaveBeenCalled();
    });
  });
});
