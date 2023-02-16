import { createNameWithPrefix } from '../names';

describe('names', () => {
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
