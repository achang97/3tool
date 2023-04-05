import { validateVariableName } from '../namespace';

describe('namespace', () => {
  describe('validateVariableName', () => {
    it('returns error if new name contains invalid characters', async () => {
      const result = validateVariableName('new-name!');
      expect(result).toEqual('Name can only contain letters, numbers, _, or $');
    });

    it('returns error if new name does not starts with letter or _', async () => {
      const result = validateVariableName('123');
      expect(result).toEqual('Name must start with a letter or "_"');
    });

    it('returns undefined if name is valid', () => {
      const result = validateVariableName('variableName');
      expect(result).toBeUndefined();
    });
  });
});
