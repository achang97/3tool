import { evalExpression, stringifyByType } from '../eval';

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

  describe('evalExpression', () => {
    describe('general', () => {
      it('does not evaluate dynamic terms if no args are given', () => {
        const result = evalExpression('{{ hello }}', 'string');
        expect(result).toEqual({
          parsedExpression: '{{ hello }}',
          value: '{{ hello }}',
        });
      });

      it('evaluates multiple dynamic terms', () => {
        const result = evalExpression(
          '{{ button1.text }} {{ button2.text }}!',
          'string',
          {
            button1: { text: 'hello' },
            button2: { text: 'world' },
          }
        );
        expect(result).toEqual({
          parsedExpression: 'hello world!',
          value: 'hello world!',
        });
      });
    });

    describe('number', () => {
      it('evaluates static input as number', () => {
        const result = evalExpression('2', 'number', {});
        expect(result).toEqual({
          parsedExpression: '2',
          value: 2,
        });
      });

      it('evaluates dynamic input as number', () => {
        const result = evalExpression(
          ' {{ textInput1.minLength }} ',
          'number',
          {
            textInput1: {
              minLength: 4,
            },
          }
        );
        expect(result).toEqual({
          parsedExpression: '4',
          value: 4,
        });
      });

      it('returns null if field is null', () => {
        const result = evalExpression('null', 'number', {});
        expect(result).toEqual({
          parsedExpression: 'null',
          value: null,
        });
      });

      it('returns undefined if field is undefined', () => {
        const result = evalExpression('undefined', 'number', {});
        expect(result).toEqual({
          parsedExpression: 'undefined',
          value: undefined,
        });
      });

      it('returns undefined if field is empty string', () => {
        const result = evalExpression('', 'number', {});
        expect(result).toEqual({
          parsedExpression: '',
          value: undefined,
        });
      });

      it('returns error if field does not evaluate to number', () => {
        const result = evalExpression('asdf', 'number', {});
        expect(result).toEqual({
          error: new Error(
            "Expected value of type 'number', received value of type 'string'"
          ),
        });
      });
    });

    describe('array', () => {
      it('evaluates static input as array', () => {
        const result = evalExpression('[1]', 'array', {});
        expect(result).toEqual({
          parsedExpression: '[1]',
          value: [1],
        });
      });

      it('evaluates dynamic input as array', () => {
        const result = evalExpression(
          ' {{ [{ test: textInput1.minLength }] }} ',
          'array',
          {
            textInput1: {
              minLength: 4,
            },
          }
        );
        expect(result).toEqual({
          parsedExpression: '[{"test":4}]',
          value: [{ test: 4 }],
        });
      });

      it('evaluates null to stringified value', () => {
        const result = evalExpression('[{ test: {{ null }} }]', 'array', {});
        expect(result).toEqual({
          parsedExpression: '[{ test: null }]',
          value: [{ test: null }],
        });
      });

      it('evaluates undefined to stringified value', () => {
        const result = evalExpression(
          '[{ test: {{ undefined }} }]',
          'array',
          {}
        );
        expect(result).toEqual({
          parsedExpression: '[{ test: undefined }]',
          value: [{ test: undefined }],
        });
      });

      it('returns error if field does not evaluate to array', () => {
        const result = evalExpression('asdf', 'array', {});
        expect(result).toEqual({
          error: new Error(
            "Expected value of type 'array', received value of type 'string'"
          ),
        });
      });
    });

    describe('object', () => {
      it('evaluates static input as object', () => {
        const result = evalExpression('{ test: 1 }', 'object', {});
        expect(result).toEqual({
          parsedExpression: '{ test: 1 }',
          value: { test: 1 },
        });
      });

      it('evaluates dynamic input as object', () => {
        const result = evalExpression(
          ' {{ { test: textInput1.minLength } }} ',
          'object',
          {
            textInput1: {
              minLength: 4,
            },
          }
        );
        expect(result).toEqual({
          parsedExpression: '{"test":4}',
          value: { test: 4 },
        });
      });

      it('evaluates null to stringified value', () => {
        const result = evalExpression('{ test: {{ null }} }', 'object', {});
        expect(result).toEqual({
          parsedExpression: '{ test: null }',
          value: { test: null },
        });
      });

      it('evaluates undefined to stringified value', () => {
        const result = evalExpression(
          '{ test: {{ undefined }} }',
          'object',
          {}
        );
        expect(result).toEqual({
          parsedExpression: '{ test: undefined }',
          value: { test: undefined },
        });
      });

      it('returns error if field does not evaluate to object', () => {
        const result = evalExpression('asdf', 'object', {});
        expect(result).toEqual({
          error: new Error(
            "Expected value of type 'object', received value of type 'string'"
          ),
        });
      });

      it('returns error if field evaluates to null', () => {
        const result = evalExpression('null', 'object', {});
        expect(result).toEqual({
          error: new Error(
            "Expected value of type 'object', received value of type 'null'"
          ),
        });
      });
    });

    describe('boolean', () => {
      it('evaluates static input as boolean', () => {
        const result = evalExpression('true', 'boolean', {});
        expect(result).toEqual({
          parsedExpression: 'true',
          value: true,
        });
      });

      it('evaluates dynamic input as boolean', () => {
        const result = evalExpression(
          ' {{ textInput1.minLength !== 4 }} ',
          'boolean',
          {
            textInput1: {
              minLength: 4,
            },
          }
        );
        expect(result).toEqual({
          parsedExpression: 'false',
          value: false,
        });
      });

      it.each(['true', '1', '2'])(
        'evaluates truthy input "%s" as true',
        (input: string) => {
          const result = evalExpression(input, 'boolean', {});
          expect(result).toEqual({
            parsedExpression: input,
            value: true,
          });
        }
      );

      it.each(['false', '0', 'null', 'undefined'])(
        'evaluates falsy input "%s" as false',
        (input: string) => {
          const result = evalExpression(input, 'boolean', {});
          expect(result).toEqual({
            parsedExpression: input,
            value: false,
          });
        }
      );
    });

    describe('string', () => {
      it('evaluates static input as string', () => {
        const result = evalExpression('2', 'string');
        expect(result).toEqual({
          parsedExpression: '2',
          value: '2',
        });
      });

      it('evaluates dynamic input as string', () => {
        const result = evalExpression(
          ' {{ textInput1.minLength }} ',
          'string',
          {
            textInput1: {
              minLength: 4,
            },
          }
        );
        expect(result).toEqual({
          parsedExpression: '4',
          value: '4',
        });
      });

      it('stringifies objects with the toString method', () => {
        const result = evalExpression('{{ { test: 1 } }}', 'string', {});
        expect(result).toEqual({
          parsedExpression: '[object Object]',
          value: '[object Object]',
        });
      });

      it.each(['null', 'undefined'])(
        'evaluates "%s" as literal value',
        (input: string) => {
          const result = evalExpression(input, 'string', {});
          expect(result).toEqual({
            parsedExpression: input,
            value: input,
          });
        }
      );

      it.each(['null', 'undefined'])(
        'evaluates "%s" within dynamic term as empty string',
        (input: string) => {
          const result = evalExpression(`{{ ${input} }}`, 'string', {});
          expect(result).toEqual({
            parsedExpression: '',
            value: '',
          });
        }
      );
    });

    describe('any', () => {
      it('returns evaluated field as number', () => {
        const result = evalExpression('2', 'any');
        expect(result).toEqual({
          parsedExpression: '2',
          value: 2,
        });
      });

      it('returns evaluated field as array', () => {
        const result = evalExpression('[1]', 'any');
        expect(result).toEqual({
          parsedExpression: '[1]',
          value: [1],
        });
      });

      it('returns evaluated field as object', () => {
        const result = evalExpression('{test:1}', 'any');
        expect(result).toEqual({
          parsedExpression: '{test:1}',
          value: { test: 1 },
        });
      });

      it('returns evaluated field as boolean', () => {
        const result = evalExpression('true', 'any');
        expect(result).toEqual({
          parsedExpression: 'true',
          value: true,
        });
      });

      it('returns evaluated field as string', () => {
        const result = evalExpression('hello', 'any');
        expect(result).toEqual({
          parsedExpression: 'hello',
          value: 'hello',
        });
      });
    });

    describe('nested', () => {
      it('throw error', () => {
        const result = evalExpression('', 'nested', {});
        expect(result).toEqual({
          error: new Error('Unable to evaluate nested value'),
        });
      });
    });

    describe('multiple types priority', () => {
      it('evaluates as array over object, boolean, and string', () => {
        const result = evalExpression(
          '[2]',
          ['array', 'object', 'boolean', 'string'],
          {}
        );
        expect(result).toEqual({
          parsedExpression: '[2]',
          value: [2],
        });
      });

      it('evaluates as object over boolean and string', () => {
        const result = evalExpression(
          '{test:2}',
          ['object', 'boolean', 'string'],
          {}
        );
        expect(result).toEqual({
          parsedExpression: '{test:2}',
          value: { test: 2 },
        });
      });

      it('evaluates as number over boolean and string', () => {
        const result = evalExpression('2', ['number', 'boolean', 'string'], {});
        expect(result).toEqual({
          parsedExpression: '2',
          value: 2,
        });
      });

      it('evaluates as boolean over string', () => {
        const result = evalExpression('2', ['boolean', 'string'], {});
        expect(result).toEqual({
          parsedExpression: '2',
          value: true,
        });
      });
    });

    describe('error', () => {
      it('returns "not defined" error if dynamic term contains invalid variable', () => {
        const result = evalExpression('{{ hello }}', 'string', {});
        expect(result).toEqual({
          error: new Error('hello is not defined'),
        });
      });

      it('returns "Invalid JS syntax" error if dynamic term contains invalid JS', () => {
        const result = evalExpression('{{ ++ }}', 'string', {});
        expect(result).toEqual({
          error: new Error("Invalid JS syntax: '++'"),
        });
      });
    });
  });
});
