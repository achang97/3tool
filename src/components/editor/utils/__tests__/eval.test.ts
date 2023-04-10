import { evalDynamicExpression, asyncEvalWithArgs, stringifyByType } from '../eval';

describe('eval', () => {
  describe('stringifyByType', () => {
    it('returns JSON.stringify-ed string if type is array', () => {
      const result = stringifyByType(null, 'array');
      expect(result).toEqual('null');
    });

    it('returns JSON.stringify-ed string if type is object', () => {
      const result = stringifyByType(null, 'object');
      expect(result).toEqual('null');
    });

    it('returns empty string if value is null and type is not array or object ', () => {
      const result = stringifyByType(null, 'string');
      expect(result).toEqual('');
    });

    it('returns empty string if value is undefined and type is not array or object ', () => {
      const result = stringifyByType(undefined, 'string');
      expect(result).toEqual('');
    });

    it('returns toString-ed string if value is not array or object', () => {
      const result = stringifyByType('hello', 'string');
      expect(result).toEqual('hello');
    });
  });

  describe('asyncEvalWithArgs', () => {
    it('returns undefined if expression if empty', async () => {
      const result = await asyncEvalWithArgs(' ', {}, false);
      expect(result).toBeUndefined();
    });

    it('excludes variable args that have been redeclared', async () => {
      const result = await asyncEvalWithArgs(
        'const button1 = { text: 5 }; return button1.text;',
        { button1: { text: 'hello' } },
        true
      );
      expect(result).toEqual(5);
    });

    it('supports async / await syntax', async () => {
      const result = await asyncEvalWithArgs(
        'await new Promise((res) => setTimeout(res, 500)); return 1;',
        {},
        true
      );
      expect(result).toEqual(1);
    });

    describe('has return value', () => {
      it('evaluates function without added return keyword', async () => {
        const result = await asyncEvalWithArgs('const test = 5; return 5;', {}, true);
        expect(result).toEqual(5);
      });

      it('does not override "Unexpected token" error', async () => {
        expect(async () => asyncEvalWithArgs('++', {}, true)).rejects.toThrowError(
          "Unexpected token '}'"
        );
      });
    });

    describe('no return value', () => {
      it('evaluates function with added return keyword', async () => {
        const result = await asyncEvalWithArgs('5 + 5', {}, false);
        expect(result).toEqual(10);
      });

      it('overrides "Unexpected token" error', async () => {
        expect(async () => asyncEvalWithArgs('++', {}, false)).rejects.toThrowError(
          "Invalid JavaScript syntax: '++'"
        );
      });

      it('does not override error', async () => {
        expect(async () => asyncEvalWithArgs('asdf', {}, false)).rejects.toThrowError(
          'asdf is not defined'
        );
      });
    });
  });

  describe('evalDynamicExpression', () => {
    describe('general', () => {
      it('evaluates multiple dynamic terms', () => {
        const result = evalDynamicExpression('{{ button1.text }} {{ button2.text }}!', 'string', {
          button1: { text: 'hello' },
          button2: { text: 'world' },
        });
        expect(result).toEqual({
          parsedExpression: 'hello world!',
          value: 'hello world!',
        });
      });
    });

    describe('number', () => {
      it('evaluates static input as number', () => {
        const result = evalDynamicExpression('2', 'number', {});
        expect(result).toEqual({
          parsedExpression: '2',
          value: 2,
        });
      });

      it('evaluates dynamic input as number', () => {
        const result = evalDynamicExpression(' {{ textInput1.minLength }} ', 'number', {
          textInput1: {
            minLength: 4,
          },
        });
        expect(result).toEqual({
          parsedExpression: '4',
          value: 4,
        });
      });

      it('returns null if field is null', () => {
        const result = evalDynamicExpression('null', 'number', {});
        expect(result).toEqual({
          parsedExpression: 'null',
          value: null,
        });
      });

      it('returns undefined if field is undefined', () => {
        const result = evalDynamicExpression('undefined', 'number', {});
        expect(result).toEqual({
          parsedExpression: 'undefined',
          value: undefined,
        });
      });

      it('returns undefined if field is empty string', () => {
        const result = evalDynamicExpression('', 'number', {});
        expect(result).toEqual({
          parsedExpression: '',
          value: undefined,
        });
      });

      it('returns error if field does not evaluate to number', () => {
        const result = evalDynamicExpression('asdf', 'number', {});
        expect(result).toEqual({
          error: new Error("Expected value of type 'number', received value of type 'string'"),
        });
      });
    });

    describe('array', () => {
      it('evaluates static input as array', () => {
        const result = evalDynamicExpression('[1]', 'array', {});
        expect(result).toEqual({
          parsedExpression: '[1]',
          value: [1],
        });
      });

      it('evaluates dynamic input as array', () => {
        const result = evalDynamicExpression(' {{ [{ test: textInput1.minLength }] }} ', 'array', {
          textInput1: {
            minLength: 4,
          },
        });
        expect(result).toEqual({
          parsedExpression: '[{"test":4}]',
          value: [{ test: 4 }],
        });
      });

      it('evaluates null to stringified value', () => {
        const result = evalDynamicExpression('[{ test: {{ null }} }]', 'array', {});
        expect(result).toEqual({
          parsedExpression: '[{ test: null }]',
          value: [{ test: null }],
        });
      });

      it('evaluates undefined to stringified value', () => {
        const result = evalDynamicExpression('[{ test: {{ undefined }} }]', 'array', {});
        expect(result).toEqual({
          parsedExpression: '[{ test: undefined }]',
          value: [{ test: undefined }],
        });
      });

      it('returns error if field does not evaluate to array', () => {
        const result = evalDynamicExpression('asdf', 'array', {});
        expect(result).toEqual({
          error: new Error("Expected value of type 'array', received value of type 'string'"),
        });
      });
    });

    describe('object', () => {
      it('evaluates static input as object', () => {
        const result = evalDynamicExpression('{ test: 1 }', 'object', {});
        expect(result).toEqual({
          parsedExpression: '{ test: 1 }',
          value: { test: 1 },
        });
      });

      it('evaluates dynamic input as object', () => {
        const result = evalDynamicExpression(' {{ { test: textInput1.minLength } }} ', 'object', {
          textInput1: {
            minLength: 4,
          },
        });
        expect(result).toEqual({
          parsedExpression: '{"test":4}',
          value: { test: 4 },
        });
      });

      it('evaluates null to stringified value', () => {
        const result = evalDynamicExpression('{ test: {{ null }} }', 'object', {});
        expect(result).toEqual({
          parsedExpression: '{ test: null }',
          value: { test: null },
        });
      });

      it('evaluates undefined to stringified value', () => {
        const result = evalDynamicExpression('{ test: {{ undefined }} }', 'object', {});
        expect(result).toEqual({
          parsedExpression: '{ test: undefined }',
          value: { test: undefined },
        });
      });

      it('returns error if field does not evaluate to object', () => {
        const result = evalDynamicExpression('asdf', 'object', {});
        expect(result).toEqual({
          error: new Error("Expected value of type 'object', received value of type 'string'"),
        });
      });

      it('returns error if field evaluates to null', () => {
        const result = evalDynamicExpression('null', 'object', {});
        expect(result).toEqual({
          error: new Error("Expected value of type 'object', received value of type 'null'"),
        });
      });
    });

    describe('boolean', () => {
      it('evaluates static input as boolean', () => {
        const result = evalDynamicExpression('true', 'boolean', {});
        expect(result).toEqual({
          parsedExpression: 'true',
          value: true,
        });
      });

      it('evaluates dynamic input as boolean', () => {
        const result = evalDynamicExpression(' {{ textInput1.minLength !== 4 }} ', 'boolean', {
          textInput1: {
            minLength: 4,
          },
        });
        expect(result).toEqual({
          parsedExpression: 'false',
          value: false,
        });
      });

      it.each(['true', '1', '2'])('evaluates truthy input "%s" as true', (input: string) => {
        const result = evalDynamicExpression(input, 'boolean', {});
        expect(result).toEqual({
          parsedExpression: input,
          value: true,
        });
      });

      it.each(['false', '0', 'null', 'undefined'])(
        'evaluates falsy input "%s" as false',
        (input: string) => {
          const result = evalDynamicExpression(input, 'boolean', {});
          expect(result).toEqual({
            parsedExpression: input,
            value: false,
          });
        }
      );
    });

    describe('string', () => {
      it('evaluates static input as string', () => {
        const result = evalDynamicExpression('2', 'string', {});
        expect(result).toEqual({
          parsedExpression: '2',
          value: '2',
        });
      });

      it('evaluates dynamic input as string', () => {
        const result = evalDynamicExpression(' {{ textInput1.minLength }} ', 'string', {
          textInput1: {
            minLength: 4,
          },
        });
        expect(result).toEqual({
          parsedExpression: '4',
          value: '4',
        });
      });

      it('stringifies objects with the toString method', () => {
        const result = evalDynamicExpression('{{ { test: 1 } }}', 'string', {});
        expect(result).toEqual({
          parsedExpression: '[object Object]',
          value: '[object Object]',
        });
      });

      it.each(['null', 'undefined'])('evaluates "%s" as literal value', (input: string) => {
        const result = evalDynamicExpression(input, 'string', {});
        expect(result).toEqual({
          parsedExpression: input,
          value: input,
        });
      });

      it.each(['null', 'undefined'])(
        'evaluates "%s" within dynamic term as empty string',
        (input: string) => {
          const result = evalDynamicExpression(`{{ ${input} }}`, 'string', {});
          expect(result).toEqual({
            parsedExpression: '',
            value: '',
          });
        }
      );
    });

    describe('any', () => {
      it('returns evaluated field as number', () => {
        const result = evalDynamicExpression('2', 'any', {});
        expect(result).toEqual({
          parsedExpression: '2',
          value: 2,
        });
      });

      it('returns evaluated field as array', () => {
        const result = evalDynamicExpression('[1]', 'any', {});
        expect(result).toEqual({
          parsedExpression: '[1]',
          value: [1],
        });
      });

      it('returns evaluated field as object', () => {
        const result = evalDynamicExpression('{test:1}', 'any', {});
        expect(result).toEqual({
          parsedExpression: '{test:1}',
          value: { test: 1 },
        });
      });

      it('returns evaluated field as boolean', () => {
        const result = evalDynamicExpression('true', 'any', {});
        expect(result).toEqual({
          parsedExpression: 'true',
          value: true,
        });
      });

      it('returns evaluated field as string', () => {
        const result = evalDynamicExpression('hello', 'any', {});
        expect(result).toEqual({
          parsedExpression: 'hello',
          value: 'hello',
        });
      });
    });

    describe('nested', () => {
      it('throw error', () => {
        const result = evalDynamicExpression('', 'nested', {});
        expect(result).toEqual({
          error: new Error('Unable to evaluate nested value'),
        });
      });
    });

    describe('error', () => {
      it('returns "not defined" error if dynamic term contains invalid variable', () => {
        const result = evalDynamicExpression('{{ hello }}', 'string', {});
        expect(result).toEqual({
          error: new Error('hello is not defined'),
        });
      });

      it('returns "Invalid JS syntax" error if dynamic term contains invalid JS', () => {
        const result = evalDynamicExpression('{{ ++ }}', 'string', {});
        expect(result).toEqual({
          error: new Error("Invalid JavaScript syntax: '++'"),
        });
      });
    });
  });
});
