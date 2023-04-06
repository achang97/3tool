import { useAppSelector } from '@app/redux/hooks';
import { Action, ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import { useActionIsEditing } from '../useActionIsEditing';

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

describe('useActionIsEditing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('returns true if there are changes', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedAction: _.merge({}, mockAction, {
        data: { javascript: { code: 'new code' } },
      }),
    }));
    const { result } = renderHook(() => useActionIsEditing());
    expect(result.current).toEqual(true);
  });

  it('returns false if there is no focused action', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedAction: undefined,
    }));
    const { result } = renderHook(() => useActionIsEditing());
    expect(result.current).toEqual(false);
  });

  it('returns false if there are no changes to type, data, or event handlers', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedAction: {
        ..._.cloneDeep(mockAction),
        id: 'id',
        _id: 'id',
      },
    }));
    const { result } = renderHook(() => useActionIsEditing());
    expect(result.current).toEqual(false);
  });
});
