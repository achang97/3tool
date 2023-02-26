import { createCompletionContext } from '@tests/utils/codemirror';
import {
  createAutocompleteSnippet,
  createAutocompleteSnippets,
  parseTokenFromContext,
  readAsModule,
} from '../codemirror';

describe('codemirror', () => {
  describe('createAutocompleteSnippet', () => {
    it('returns snippet with specified label', () => {
      const result = createAutocompleteSnippet('label', 1);
      expect(result.label).toEqual('label');
    });

    it('returns snippet with specified boost', () => {
      const result = createAutocompleteSnippet('label', 1, { boost: 100 });
      expect(result.boost).toEqual(100);
    });

    describe('detail', () => {
      it('returns snippet with specified detail', () => {
        const result = createAutocompleteSnippet('label', 1, {
          detail: 'test',
        });
        expect(result.detail).toEqual('test');
      });

      it('returns snippet with "array" detail', () => {
        const result = createAutocompleteSnippet('label', [1]);
        expect(result.detail).toEqual('array');
      });

      it('returns snippet with "null" detail', () => {
        const result = createAutocompleteSnippet('label', null);
        expect(result.detail).toEqual('null');
      });

      it('returns snippet with automatically fetched type detail', () => {
        const result = createAutocompleteSnippet('label', 1);
        expect(result.detail).toEqual('number');
      });
    });
  });

  describe('createAutocompleteSnippets', () => {
    it('recurses through objects', () => {
      const result = createAutocompleteSnippets({
        object1: {
          object2: {
            field1: 4,
          },
        },
      });
      expect(result).toMatchObject([
        {
          label: '.object1',
          detail: 'object',
          boost: undefined,
        },
        {
          label: '.object1.object2',
          detail: 'object',
          boost: undefined,
        },
        {
          label: '.object1.object2.field1',
          detail: 'number',
          boost: undefined,
        },
      ]);
    });

    it('does not recurse through array', () => {
      const result = createAutocompleteSnippets({
        field1: [1, 2, 3],
      });
      expect(result).toMatchObject([
        {
          label: '.field1',
          detail: 'array',
        },
      ]);
    });

    it('includes null and undefined fields', () => {
      const result = createAutocompleteSnippets({
        field1: null,
        field2: undefined,
      });
      expect(result).toMatchObject([
        {
          label: '.field1',
          detail: 'null',
        },
        {
          label: '.field2',
          detail: 'undefined',
        },
      ]);
    });

    it('includes root-level fields', () => {
      const result = createAutocompleteSnippets({
        field1: 'hello',
      });
      expect(result).toMatchObject([
        {
          label: '.field1',
          detail: 'string',
        },
      ]);
    });

    it('assigns the given boost value to all snippets', () => {
      const result = createAutocompleteSnippets(
        {
          field1: 'hello',
          field2: 2,
        },
        { boost: 100 }
      );
      expect(result).toMatchObject([
        {
          label: '.field1',
          detail: 'string',
          boost: 100,
        },
        {
          label: '.field2',
          detail: 'number',
          boost: 100,
        },
      ]);
    });
  });

  describe('parseTokenFromContext', () => {
    it('returns null if cursor is after invalid floating period', () => {
      const completionContext = createCompletionContext('a .', 3, false);
      const result = parseTokenFromContext(completionContext);
      expect(result).toBeNull();
    });

    it('returns null if expression is empty', () => {
      const completionContext = createCompletionContext('', 0, false);
      const result = parseTokenFromContext(completionContext);
      expect(result).toBeNull();
    });

    it('returns null if beginning new expression', () => {
      const completionContext = createCompletionContext('button1||', 9, false);
      const result = parseTokenFromContext(completionContext);
      expect(result).toBeNull();
    });

    it('returns root token if cursor follows completed expression', () => {
      const completionContext = createCompletionContext(
        'table1.data[0]b',
        15,
        false
      );
      const result = parseTokenFromContext(completionContext);
      expect(result).toEqual({ from: 14, isRoot: true, token: 'b' });
    });

    it('returns root token if there are no periods in discovered token', () => {
      const completionContext = createCompletionContext('button1', 7, false);
      const result = parseTokenFromContext(completionContext);
      expect(result).toEqual({
        token: 'button1',
        from: 0,
        isRoot: true,
      });
    });

    it('returns non-root substring of token up until last period', () => {
      const completionContext = createCompletionContext(
        'table1.data[0].em',
        17,
        false
      );
      const result = parseTokenFromContext(completionContext);
      expect(result).toEqual({
        token: 'table1.data[0]',
        from: 14,
        isRoot: false,
      });
    });
  });

  describe('readAsModule', () => {
    it('returns empty object is object is undefined', () => {
      const result = readAsModule(undefined);
      expect(result).toEqual({});
    });

    it('reconstructs object with entry keys and values', () => {
      const object = {
        function1: '1',
        function2: '2',
        function3: '3',
      };
      const result = readAsModule(object);
      expect(result).toEqual(object);
    });
  });
});
