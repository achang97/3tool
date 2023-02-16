import { Action, ActionType, Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import { useElementReferenceUpdate } from '../useElementReferenceUpdate';

const mockPrevName = 'button1';
const mockNewName = 'button2';

const mockComponents = [
  {
    type: ComponentType.Button,
    name: 'button1',
    data: {
      button: {
        text: '{{ button1.disabled }}',
      },
    },
  },
] as unknown as Component[];

const mockActions = [
  {
    type: ActionType.Javascript,
    name: 'action1',
    data: {},
  },
] as Action[];

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
      actions: mockActions,
    },
  })),
}));

describe('useElementReferenceUpdate', () => {
  describe('components', () => {
    it('updates references of current component in dynamic fields', async () => {
      const { result } = renderHook(() =>
        useElementReferenceUpdate(mockPrevName)
      );
      const update = result.current(mockNewName);
      expect(update.components).toEqual([
        _.merge({}, mockComponents[0], {
          data: {
            button: {
              text: `{{ ${mockNewName}.disabled }}`,
            },
          },
        }),
      ]);
    });
  });

  describe('actions', () => {
    it('returns unchanged actions', () => {
      const { result } = renderHook(() =>
        useElementReferenceUpdate(mockPrevName)
      );
      const update = result.current(mockNewName);
      expect(update.actions).toEqual(mockActions);
    });
  });
});
