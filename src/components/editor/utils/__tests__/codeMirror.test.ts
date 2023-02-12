import { createCompletionContext } from '@tests/utils/codeMirror';
import {
  generateSnippets,
  getSnippetTemplate,
  getTokenFromContext,
  parseDynamicTerms,
  readAsModule,
} from '../codeMirror';

describe('codeMirror', () => {
  describe('parseDynamicTerms', () => {
    it('parses single term', () => {
      const result = parseDynamicTerms('{{ button1.text }}');
      expect(result).toEqual([
        {
          group: '{{ button1.text }}',
          expression: 'button1.text',
          start: 0,
        },
      ]);
    });

    it('parses multiple terms', () => {
      const result = parseDynamicTerms(
        '{{ button1.text }} {{   textInput1.value   }}'
      );
      expect(result).toEqual([
        {
          group: '{{ button1.text }}',
          expression: 'button1.text',
          start: 0,
        },
        {
          group: '{{   textInput1.value   }}',
          expression: 'textInput1.value',
          start: 19,
        },
      ]);
    });

    it('parses complex expression terms', () => {
      const result = parseDynamicTerms(
        '  {{ button1.text + 1 / 5 + textInput.value }}  '
      );
      expect(result).toEqual([
        {
          group: '{{ button1.text + 1 / 5 + textInput.value }}',
          expression: 'button1.text + 1 / 5 + textInput.value',
          start: 2,
        },
      ]);
    });

    it('returns empty array if no terms are found', () => {
      const result = parseDynamicTerms('There are no dynamic terms');
      expect(result).toEqual([]);
    });
  });

  describe('getSnippetTemplate', () => {
    it('appends "#{1}" suffix to given string', () => {
      const result = getSnippetTemplate('test');
      expect(result).toEqual('test#{1}');
    });
  });

  describe('generateSnippets', () => {
    it('recurses through data object and creates autocomplete snippets', () => {
      const result = generateSnippets({
        object1: {
          field1: [1, 2, 3],
          object2: {
            field2: 4,
          },
        },
        field3: undefined,
        field4: null,
        field5: 'string',
      });
      expect(result).toEqual([
        {
          label: '.object1',
          detail: 'object',
          apply: expect.any(Function),
        },
        {
          label: '.object1.field1',
          detail: 'array',
          apply: expect.any(Function),
        },
        {
          label: '.object1.object2',
          detail: 'object',
          apply: expect.any(Function),
        },
        {
          label: '.object1.object2.field2',
          detail: 'number',
          apply: expect.any(Function),
        },
        {
          label: '.field3',
          detail: 'undefined',
          apply: expect.any(Function),
        },
        {
          label: '.field4',
          detail: 'null',
          apply: expect.any(Function),
        },
        {
          label: '.field5',
          detail: 'string',
          apply: expect.any(Function),
        },
      ]);
    });
  });

  describe('getTokenFromContext', () => {
    describe('dynamic', () => {
      it('returns null if cursor is after invalid floating period', () => {
        const completionContext = createCompletionContext('{{ a . }}', 6);
        const result = getTokenFromContext(completionContext);
        expect(result).toBeNull();
      });

      it('returns null if cursor follows completed expression', () => {
        const completionContext = createCompletionContext(
          '{{ table1.data[0]b }}',
          18
        );
        const result = getTokenFromContext(completionContext);
        expect(result).toBeNull();
      });

      it('returns null if cursor follows invalid JavaScript', () => {
        const completionContext = createCompletionContext(
          '{{ table1.data[]b }}',
          17
        );
        const result = getTokenFromContext(completionContext);
        expect(result).toBeNull();
      });

      it('returns root token if expression is empty', () => {
        const completionContext = createCompletionContext('{{}}', 2);
        const result = getTokenFromContext(completionContext);
        expect(result).toEqual({
          token: '',
          from: 2,
          isRoot: true,
        });
      });

      it('returns root token if beginning new expression', () => {
        const completionContext = createCompletionContext(
          '{{ button1|| }}',
          12
        );
        const result = getTokenFromContext(completionContext);
        expect(result).toEqual({
          token: '',
          from: 12,
          isRoot: true,
        });
      });

      it('returns root token if there are no periods in discovered token', () => {
        const completionContext = createCompletionContext('{{ button1 }}', 10);
        const result = getTokenFromContext(completionContext);
        expect(result).toEqual({
          token: 'button1',
          from: 3,
          isRoot: true,
        });
      });

      it('returns non-root substring of token up until last period', () => {
        const completionContext = createCompletionContext(
          '{{ table1.data[0].em }}',
          20
        );
        const result = getTokenFromContext(completionContext);
        expect(result).toEqual({
          token: 'table1.data[0]',
          from: 17,
          isRoot: false,
        });
      });
    });

    describe('javascript', () => {
      it('returns root token if expression is empty', () => {
        const completionContext = createCompletionContext('', 0, false);
        const result = getTokenFromContext(completionContext);
        expect(result).toEqual({
          token: '',
          from: 0,
          isRoot: true,
        });
      });

      it('returns root token from 0-index', () => {
        const completionContext = createCompletionContext('button1', 7, false);
        const result = getTokenFromContext(completionContext);
        expect(result).toEqual({
          token: 'button1',
          from: 0,
          isRoot: true,
        });
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
