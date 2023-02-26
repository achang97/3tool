import { Action, ActionType, Component, ComponentType } from '@app/types';
import {
  createNameWithPrefix,
  getElementData,
  isAction,
  isComponent,
  parseDepCycle,
} from '../elements';

describe('elements', () => {
  describe('getElementData', () => {
    it('returns type-specific data field', () => {
      const result = getElementData({
        type: ComponentType.Button,
        data: {
          [ComponentType.Button]: {
            text: 'hello',
          },
        },
      } as Component);
      expect(result).toEqual({
        text: 'hello',
      });
    });

    it('returns empty object as default', () => {
      const result = getElementData({
        type: ComponentType.Button,
        data: {},
      } as Component);
      expect(result).toEqual({});
    });
  });

  describe('isAction', () => {
    it('returns true if type is ActionType', () => {
      const result = isAction({ type: ActionType.Javascript } as Action);
      expect(result).toEqual(true);
    });

    it('returns false if type is not ActionType', () => {
      const result = isAction({ type: ComponentType.Button } as Component);
      expect(result).toEqual(false);
    });
  });

  describe('isComponent', () => {
    it('returns true if type is ComponentType', () => {
      const result = isComponent({ type: ComponentType.Button } as Component);
      expect(result).toEqual(true);
    });

    it('returns false if type is not ComponentType', () => {
      const result = isComponent({ type: ActionType.Javascript } as Action);
      expect(result).toEqual(false);
    });
  });

  describe('parseDepCycle', () => {
    it('returns cycle with the same first and last element', () => {
      const result = parseDepCycle([
        'button1',
        'button1.text',
        'button1.disabled',
        'button1.text',
      ]);
      expect(result).toEqual([
        'button1.text',
        'button1.disabled',
        'button1.text',
      ]);
    });
  });

  describe('createNameWithPrefix', () => {
    it('returns id with suffix of 1 if there are no ids with the same component type', () => {
      const result = createNameWithPrefix('button', [
        'text1',
        'text2',
        'textInput2',
        'button',
      ]);
      expect(result).toEqual('button1');
    });

    it('returns id with suffix of the max id with the same component type + 1', () => {
      const result = createNameWithPrefix('button', [
        'text1',
        'text2',
        'button2',
        'button3',
      ]);
      expect(result).toEqual('button4');
    });
  });
});
