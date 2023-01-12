import { ComponentType } from '@app/types';
import { getNewComponentId } from '../editor';

describe('editor', () => {
  describe('getNewComponentId', () => {
    it('returns id with suffix of 1 if there are no ids with the same component type', () => {
      const result = getNewComponentId(ComponentType.Button, [
        `${ComponentType.Text}1`,
        `${ComponentType.Text}2`,
        `${ComponentType.TextInput}2`,
        `${ComponentType.Button}`,
      ]);
      expect(result).toEqual(`${ComponentType.Button}1`);
    });

    it('returns id with suffix of max number of the ids with the same component type + 1', () => {
      const result = getNewComponentId(ComponentType.Button, [
        `${ComponentType.Text}1`,
        `${ComponentType.Text}2`,
        `${ComponentType.Button}2`,
        `${ComponentType.Button}3`,
      ]);
      expect(result).toEqual(`${ComponentType.Button}4`);
    });
  });
});
