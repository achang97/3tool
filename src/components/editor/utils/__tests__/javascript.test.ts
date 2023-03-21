import {
  acornParse,
  parseDynamicTerms,
  parseObjectVariable,
  replaceDynamicTermVariableName,
  replaceVariableName,
  parseVariables,
  flattenObjectFields,
  parseDynamicTermVariables,
  getPrototypeFunctions,
  parseDeclaredVariables,
  overwriteArrayMergeCustomizer,
} from '../javascript';

const acorn = require('acorn');

describe('javascript', () => {
  describe('acornParse', () => {
    it('returns result of acorn.parse with latest ecma version', () => {
      const result = acornParse('button1');
      expect(result).toEqual(
        acorn.parse('button1', { ecmaVersion: 'latest ' })
      );
    });
  });

  describe('parseDynamicTerms', () => {
    it('parses single term', () => {
      const result = parseDynamicTerms('{{ button1.text }}');
      expect(result).toEqual([
        {
          group: '{{ button1.text }}',
          expression: ' button1.text ',
          start: 0,
        },
      ]);
    });

    it('parses multiple terms', () => {
      const result = parseDynamicTerms(
        '{{ button1.text }} {{textInput1.value}}'
      );
      expect(result).toEqual([
        {
          group: '{{ button1.text }}',
          expression: ' button1.text ',
          start: 0,
        },
        {
          group: '{{textInput1.value}}',
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
          expression: ' button1.text + 1 / 5 + textInput.value ',
          start: 2,
        },
      ]);
    });

    it('returns empty array if no terms are found', () => {
      const result = parseDynamicTerms('There are no dynamic terms');
      expect(result).toEqual([]);
    });
  });

  describe('parseObjectVariable', () => {
    it('returns object with only object name if string does not contain period', () => {
      const result = parseObjectVariable('button1');
      expect(result).toEqual({
        objectName: 'button1',
        rootFieldName: '',
        fieldName: '',
      });
    });

    it('returns object with same root and field names if string contains single period', () => {
      const result = parseObjectVariable('table1.data');
      expect(result).toEqual({
        objectName: 'table1',
        rootFieldName: 'data',
        fieldName: 'data',
      });
    });

    it('returns object with different root and field names if expression contains array access', () => {
      const result = parseObjectVariable('table1.data[0].test');
      expect(result).toEqual({
        objectName: 'table1',
        rootFieldName: 'data',
        fieldName: 'data[0].test',
      });
    });

    it('returns object with parsed object and field name if string contains multiple periods', () => {
      const result = parseObjectVariable('table1.data.test');
      expect(result).toEqual({
        objectName: 'table1',
        rootFieldName: 'data',
        fieldName: 'data.test',
      });
    });
  });

  describe('parseDeclaredVariables', () => {
    it('parses function declarators', () => {
      const result = parseDeclaredVariables('function test() {}');
      expect(result).toEqual(['test']);
    });

    it('parses variable declarators', () => {
      const result = parseDeclaredVariables('const test = 4;');
      expect(result).toEqual(['test']);
    });

    it('parses declarators in expression with return statement', () => {
      const result = parseDeclaredVariables('const test = 4; return test;');
      expect(result).toEqual(['test']);
    });
  });

  describe('replaceVariableName', () => {
    it('replaces all variable references in expression', () => {
      const result = replaceVariableName(
        'button1 + button1.text',
        'button1',
        'newButton'
      );
      expect(result).toEqual('newButton + newButton.text');
    });

    it('replaces terms in expression with return statement', () => {
      const result = replaceVariableName(
        'return button1.text',
        'button1',
        'newButton'
      );
      expect(result).toEqual('return newButton.text');
    });

    it('does not replace variable references if a variable of the same name has been declared', () => {
      const result = replaceVariableName(
        'const button1 = test; console.log(button1.text);',
        'button1',
        'newButton'
      );
      expect(result).toEqual(
        'const button1 = test; console.log(button1.text);'
      );
    });

    it('does not replace variable references if a function of the same name has been declared', () => {
      const result = replaceVariableName(
        'function button1() {}; console.log(button1.text);',
        'button1',
        'newButton'
      );
      expect(result).toEqual(
        'function button1() {}; console.log(button1.text);'
      );
    });
  });

  describe('replaceDynamicTermVariableName', () => {
    it('replaces all variable references within dynamic terms', () => {
      const result = replaceDynamicTermVariableName(
        '{{ button1 + button1.text }}',
        'button1',
        'newButton'
      );
      expect(result).toEqual('{{ newButton + newButton.text }}');
    });

    it('replaces variable references within multiple dynamic terms', () => {
      const result = replaceDynamicTermVariableName(
        '{{ button1.text }} {{ button1.disabled }}',
        'button1',
        'newButton'
      );
      expect(result).toEqual('{{ newButton.text }} {{ newButton.disabled }}');
    });

    it('does not replace variable references outside of dynamic terms', () => {
      const result = replaceDynamicTermVariableName(
        'button1 + button1.text',
        'button1',
        'newButton'
      );
      expect(result).toEqual('button1 + button1.text');
    });
  });

  describe('parseVariables', () => {
    it('replaces parsed nodes from expression with return statement', () => {
      const result = parseVariables('return button1.text', ['button1']);
      expect(result).toEqual(['button1.text']);
    });

    it('returns parsed MemberExpression nodes from expression', () => {
      const result = parseVariables('button1.test + button2.test.nested', [
        'button1',
        'button2',
      ]);
      expect(result).toEqual(['button1.test', 'button2.test.nested']);
    });

    it('returns substring of array reference up until index', () => {
      const result = parseVariables('table1.data[0].email', ['table1']);
      expect(result).toEqual(['table1.data']);
    });

    it('excludes parsed MemberExpression nodes from expression if not in valid variable names', () => {
      const result = parseVariables('button2.test', ['button1']);
      expect(result).toEqual([]);
    });

    it('returns parsed Identifier nodes from expression', () => {
      const result = parseVariables('button1 + button2', [
        'button1',
        'button2',
      ]);
      expect(result).toEqual(['button1', 'button2']);
    });

    it('excludes parsed Identifier nodes from expression if not in valid variable names', () => {
      const result = parseVariables('button2', ['button1']);
      expect(result).toEqual([]);
    });

    it('removes single call expression from the end of a variable', () => {
      const result = parseVariables('button2.text.toString()', ['button2']);
      expect(result).toEqual(['button2.text']);
    });

    it('removes multiple call expressions from the end of a variable', () => {
      const result = parseVariables('button2.text.toString().toString()', [
        'button2',
      ]);
      expect(result).toEqual(['button2.text']);
    });

    it('excludes duplicates', () => {
      const result = parseVariables('button1 + button1', ['button1']);
      expect(result).toEqual(['button1']);
    });

    it('returns empty array if given invalid JavaScript', () => {
      const result = parseVariables('invalid javascript', []);
      expect(result).toEqual([]);
    });
  });

  describe('parseDynamicTermVariables', () => {
    describe('parseVariables', () => {
      it('returns variables within dynamic terms', () => {
        const result = parseDynamicTermVariables(
          '{{ button1.test + button2.test.nested }}',
          ['button1', 'button2']
        );
        expect(result).toEqual(['button1.test', 'button2.test.nested']);
      });

      it('excludes variables from expression if not in valid variable names', () => {
        const result = parseDynamicTermVariables('{{ button2 }}', ['button1']);
        expect(result).toEqual([]);
      });

      it('excludes duplicates across different dynamic terms', () => {
        const result = parseVariables('{{ button1 }} {{ button1 }}', [
          'button1',
        ]);
        expect(result).toEqual(['button1']);
      });
    });
  });

  describe('flattenObjectFields', () => {
    describe('general', () => {
      it('excludes null and undefined fields', () => {
        const result = flattenObjectFields({
          nullField: null,
          undefinedField: undefined,
        });
        expect(result).toEqual([]);
      });
    });

    describe('prefix', () => {
      it('returns fields without prefix', () => {
        const result = flattenObjectFields({
          field: '1',
        });
        expect(result).toEqual([
          {
            name: 'field',
            value: '1',
            parent: undefined,
            isLeaf: true,
          },
        ]);
      });

      it('returns fields with prefix', () => {
        const result = flattenObjectFields(
          {
            field: '1',
          },
          { prefix: 'prefix' }
        );
        expect(result).toEqual([
          {
            name: 'prefix.field',
            value: '1',
            parent: 'prefix',
            isLeaf: true,
          },
        ]);
      });
    });

    describe('onlyLeaves', () => {
      it('includes leaf fields', () => {
        const result = flattenObjectFields({
          field: '1',
        });
        expect(result).toEqual([
          {
            name: 'field',
            value: '1',
            parent: undefined,
            isLeaf: true,
          },
        ]);
      });

      it('includes non-leaf fields from arrays', () => {
        const result = flattenObjectFields(
          {
            array: ['1'],
          },
          { onlyLeaves: false }
        );
        expect(result).toEqual([
          {
            name: 'array',
            value: '1',
            parent: undefined,
            isLeaf: false,
          },
          {
            name: 'array[0]',
            value: '1',
            parent: 'array',
            isLeaf: true,
          },
        ]);
      });

      it('includes non-leaf fields from objects', () => {
        const result = flattenObjectFields(
          {
            array: { field: '1' },
          },
          { onlyLeaves: false }
        );
        expect(result).toEqual([
          {
            name: 'array',
            value: '[object Object]',
            parent: undefined,
            isLeaf: false,
          },
          {
            name: 'array.field',
            value: '1',
            parent: 'array',
            isLeaf: true,
          },
        ]);
      });
    });
  });

  describe('getPrototypeFunctions', () => {
    it('returns empty array if value is undefined', () => {
      const result = getPrototypeFunctions(undefined);
      expect(result).toEqual([]);
    });

    it('excludes constructor from returned prototype functions', () => {
      const result = getPrototypeFunctions(2);
      expect(result).toEqual([
        Number.prototype.toExponential,
        Number.prototype.toFixed,
        Number.prototype.toPrecision,
        Number.prototype.toString,
        Number.prototype.valueOf,
        Number.prototype.toLocaleString,
      ]);
    });

    it('excludes functions with "__" prefix', () => {
      const result = getPrototypeFunctions(2);
      /* eslint-disable no-underscore-dangle, no-restricted-properties */
      // @ts-ignore
      expect(result).not.toContain(Object.prototype.__defineGetter__);
      // @ts-ignore
      expect(result).not.toContain(Object.prototype.__defineSetter__);
      // @ts-ignore
      expect(result).not.toContain(Object.prototype.__lookupGetter__);
      // @ts-ignore
      expect(result).not.toContain(Object.prototype.__lookupSetter__);
      /* eslint-enable no-underscore-dangle, no-restricted-properties */
    });
  });

  describe('overwriteArrayMergeCustomizer', () => {
    it('returns undefined if update is not an array', () => {
      const result = overwriteArrayMergeCustomizer(undefined, {});
      expect(result).toBeUndefined();
    });

    it('returns update object if update is not an array', () => {
      const mockUpdate = [1];
      const result = overwriteArrayMergeCustomizer(undefined, mockUpdate);
      expect(result).toEqual(mockUpdate);
    });
  });
});
