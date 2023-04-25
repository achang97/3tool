import { useAppSelector } from '@app/redux/hooks';
import { Action, ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import { useActionFocusedState } from '../useActionFocusedState';

const mockAction = {
  name: 'action1',
  type: ActionType.Javascript,
  data: {
    javascript: {
      code: 'code',
    },
  },
  eventHandlers: [],
} as unknown as Action;

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      actions: [mockAction],
    },
  })),
}));

jest.mock('@app/redux/hooks');

describe('useActionFocusedState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  describe('isEditing', () => {
    it('returns true if there are changes', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: _.merge({}, mockAction, {
          data: { javascript: { code: 'new code' } },
        }),
        actionResults: {},
      }));
      const { result } = renderHook(() => useActionFocusedState());
      expect(result.current.isEditing).toEqual(true);
    });

    it('returns false if there is no focused action', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: undefined,
        actionResults: {},
      }));
      const { result } = renderHook(() => useActionFocusedState());
      expect(result.current.isEditing).toEqual(false);
    });

    it('returns false if there are no changes to type, data, or event handlers', () => {
      const mockedActionCopy = _.cloneDeep(mockAction);
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: {
          ...mockedActionCopy,
          id: 'id',
          _id: 'id',
          eventHandlers: mockedActionCopy.eventHandlers.map((eventHandler, i) => ({
            ...eventHandler,
            id: i,
            _id: i,
          })),
        },
        actionResults: {},
      }));
      const { result } = renderHook(() => useActionFocusedState());
      expect(result.current.isEditing).toEqual(false);
    });
  });

  describe('isLoading', () => {
    it('returns false if there is no focused action', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: undefined,
        actionResults: {},
      }));
      const { result } = renderHook(() => useActionFocusedState());
      expect(result.current.isLoading).toEqual(false);
    });

    it('returns false if there is no corresponding action state', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: {
          name: 'action1',
          eventHandlers: [],
        },
        actionResults: {},
      }));
      const { result } = renderHook(() => useActionFocusedState());
      expect(result.current.isLoading).toEqual(false);
    });

    it('returns true if focused action is loading', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: {
          name: 'action1',
          eventHandlers: [],
        },
        actionResults: {
          action1: { isLoading: true },
        },
      }));
      const { result } = renderHook(() => useActionFocusedState());
      expect(result.current.isLoading).toEqual(true);
    });
  });
});
