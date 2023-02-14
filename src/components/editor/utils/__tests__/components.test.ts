import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { Component, ComponentType } from '@app/types';
import { Layout } from 'react-grid-layout';
import {
  createNewComponent,
  flattenComponentDataFields,
  getComponentData,
  getComponentTokens,
  getNewComponentName,
  parseComponentFieldName,
  updateDynamicTermComponents,
} from '../components';

describe('editor', () => {
  const createMockComponentList = (names: string[]): Component[] => {
    return names.map((name) => ({ name } as Component));
  };

  describe('getNewComponentName', () => {
    it('returns id with suffix of 1 if there are no ids with the same component type', () => {
      const result = getNewComponentName(
        ComponentType.Button,
        createMockComponentList([
          `${ComponentType.Text}1`,
          `${ComponentType.Text}2`,
          `${ComponentType.TextInput}2`,
          `${ComponentType.Button}`,
        ])
      );
      expect(result).toEqual(`${ComponentType.Button}1`);
    });

    it('returns id with suffix of the max id with the same component type + 1', () => {
      const result = getNewComponentName(
        ComponentType.Button,
        createMockComponentList([
          `${ComponentType.Text}1`,
          `${ComponentType.Text}2`,
          `${ComponentType.Button}2`,
          `${ComponentType.Button}3`,
        ])
      );
      expect(result).toEqual(`${ComponentType.Button}4`);
    });
  });

  describe('createNewComponent', () => {
    const mockName = 'Component Name';
    const mockLayout: Layout = {
      w: 1,
      h: 2,
      x: 3,
      y: 4,
      i: '1',
      isDraggable: false,
      isResizable: true,
    };

    it('creates component with parsed layout and template data', () => {
      const mockType = ComponentType.Button;

      const result = createNewComponent(mockType, mockName, mockLayout);
      expect(result).toEqual({
        type: mockType,
        name: mockName,
        layout: {
          w: mockLayout.w,
          h: mockLayout.h,
          x: mockLayout.x,
          y: mockLayout.y,
        },
        data: {
          [mockType]: COMPONENT_DATA_TEMPLATES[mockType],
        },
        eventHandlers: [],
      });
    });
  });

  describe('parseComponentFieldName', () => {
    it('returns object with only component name if string does not contain period', () => {
      const result = parseComponentFieldName('button1');
      expect(result).toEqual({
        componentName: 'button1',
      });
    });

    it('returns object with same root and field names if string contains single period', () => {
      const result = parseComponentFieldName('table1.data');
      expect(result).toEqual({
        componentName: 'table1',
        rootFieldName: 'data',
        fieldName: 'data',
      });
    });

    it('returns object with different root and field names if expression contains array access', () => {
      const result = parseComponentFieldName('table1.data[0].test');
      expect(result).toEqual({
        componentName: 'table1',
        rootFieldName: 'data',
        fieldName: 'data[0].test',
      });
    });

    it('returns object with parsed component and field name if string contains multiple periods', () => {
      const result = parseComponentFieldName('table1.data.test');
      expect(result).toEqual({
        componentName: 'table1',
        rootFieldName: 'data',
        fieldName: 'data.test',
      });
    });
  });

  describe('getComponentData', () => {
    it('returns type-specific data field', () => {
      const result = getComponentData({
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
      const result = getComponentData({
        type: ComponentType.Button,
        data: {},
      } as Component);
      expect(result).toEqual({});
    });
  });

  describe('flattenComponentDataFields', () => {
    it('returns array of flattened keys and values of component data map', () => {
      const result = flattenComponentDataFields({
        name: 'table1',
        type: ComponentType.Table,
        data: {
          [ComponentType.Table]: {
            data: '[]',
            emptyMessage: 'No rows',
            nestedField: {
              nestedArray: [1, { test: 1 }],
            },
            nullField: null,
            undefinedField: undefined,
          },
        },
      } as unknown as Component);
      expect(result).toEqual([
        {
          name: 'table1',
          value: '[object Object]',
          parent: undefined,
          isLeaf: false,
        },
        {
          name: 'table1.data',
          value: '[]',
          parent: 'table1',
          isLeaf: true,
        },
        {
          name: 'table1.emptyMessage',
          value: 'No rows',
          parent: 'table1',
          isLeaf: true,
        },
        {
          name: 'table1.nestedField',
          value: '[object Object]',
          parent: 'table1',
          isLeaf: false,
        },
        {
          name: 'table1.nestedField.nestedArray',
          value: '1,[object Object]',
          parent: 'table1.nestedField',
          isLeaf: false,
        },
        {
          name: 'table1.nestedField.nestedArray[0]',
          value: '1',
          parent: 'table1.nestedField.nestedArray',
          isLeaf: true,
        },
        {
          name: 'table1.nestedField.nestedArray[1]',
          value: '[object Object]',
          parent: 'table1.nestedField.nestedArray',
          isLeaf: false,
        },
        {
          name: 'table1.nestedField.nestedArray[1].test',
          value: '1',
          parent: 'table1.nestedField.nestedArray[1]',
          isLeaf: true,
        },
      ]);
    });
  });

  describe('getComponentTokens', () => {
    it('returns parsed MemberExpression nodes from expression', () => {
      const result = getComponentTokens('button1.test + button2.test.nested', [
        { name: 'button1' },
        { name: 'button2' },
      ] as Component[]);
      expect(result).toEqual([
        { name: 'button1.test', start: 0 },
        { name: 'button2.test.nested', start: 15 },
      ]);
    });

    it('returns substring of array reference up until index', () => {
      const result = getComponentTokens('table1.data[0].email', [
        { name: 'table1' },
      ] as Component[]);
      expect(result).toEqual([{ name: 'table1.data', start: 0 }]);
    });

    it('excludes parsed MemberExpression nodes from expression if not in components', () => {
      const result = getComponentTokens('button1.test + button2.test', [
        { name: 'button1' },
      ] as Component[]);
      expect(result).toEqual([{ name: 'button1.test', start: 0 }]);
    });

    it('returns parsed Identifier nodes from expression', () => {
      const result = getComponentTokens('button1 + button2', [
        { name: 'button1' },
        { name: 'button2' },
      ] as Component[]);
      expect(result).toEqual([
        { name: 'button1', start: 0 },
        { name: 'button2', start: 10 },
      ]);
    });

    it('excludes parsed Identifier nodes from expression if not in components', () => {
      const result = getComponentTokens('button1 + button2', [
        { name: 'button1' },
      ] as Component[]);
      expect(result).toEqual([{ name: 'button1', start: 0 }]);
    });

    it('returns empty array if given invalid JavaScript', () => {
      const result = getComponentTokens('invalid javascript', []);
      expect(result).toEqual([]);
    });
  });

  describe('updateDynamicTermComponents', () => {
    it('replaces original component name with new component name in dynamic terms', () => {
      const result = updateDynamicTermComponents(
        '{{ button1 + button1.text }} + button1.test.data[0].email * textInput1.value',
        'button1',
        'newButton',
        [{ name: 'button1' }, { name: 'textInput1 ' }] as Component[]
      );
      expect(result).toEqual(
        '{{ newButton + newButton.text }} + button1.test.data[0].email * textInput1.value'
      );
    });

    it('does not replace strings within dynamic terms', () => {
      const result = updateDynamicTermComponents(
        '{{ button1 + "button1.text" }}',
        'button1',
        'newButton',
        [{ name: 'button1' }] as Component[]
      );
      expect(result).toEqual('{{ newButton + "button1.text" }}');
    });
  });
});
