import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { Component, ComponentType } from '@app/types';
import { Layout } from 'react-grid-layout';
import { Identifier, MemberExpression } from '@babel/types';
import _ from 'lodash';
import { replaceTokensAtIndices } from '@app/utils/string';
import { parseDynamicTerms } from './codeMirror';

const acorn = require('acorn');
const walk = require('acorn-walk');

export const getNewComponentName = (
  type: ComponentType,
  components: Component[] = []
): string => {
  const componentRegex = new RegExp(`${type}(\\d+)`);

  let numSuffix = 1;
  components.forEach((component) => {
    const match = component.name.match(componentRegex);
    const componentNum = match && parseInt(match[1], 10);

    if (componentNum && componentNum >= numSuffix) {
      numSuffix = componentNum + 1;
    }
  });

  return `${type}${numSuffix}`;
};

export const createNewComponent = (
  type: ComponentType,
  name: string,
  { w, h, x, y }: Layout
): Component => {
  const baseComponent: Component = {
    type,
    name,
    layout: { w, h, x, y },
    data: {
      [type]: COMPONENT_DATA_TEMPLATES[type],
    },
  };

  return baseComponent;
};

export const parseComponentFieldName = (
  field: string
): {
  componentName: string;
  rootFieldName?: string;
  fieldName?: string;
} => {
  const firstPeriodIndex = field.indexOf('.');
  if (firstPeriodIndex === -1) {
    return { componentName: field };
  }

  const componentName = field.substring(0, firstPeriodIndex);
  const fieldName = field.substring(firstPeriodIndex + 1);
  let rootFieldName = fieldName;

  walk.simple(acorn.parse(fieldName), {
    Identifier: (identifier: Identifier) => {
      rootFieldName = identifier.name;
    },
  });

  return {
    componentName,
    rootFieldName,
    fieldName,
  };
};

export const getComponentData = (component: Component) => {
  return component.data[component.type] ?? {};
};

type ComponentDataField = {
  name: string;
  value: string;
  parent?: string;
  isLeaf: boolean;
};

export const flattenComponentDataFields = (
  component: Component
): ComponentDataField[] => {
  const getComponentDataFieldsHelper = (
    name: string,
    parent: string | undefined,
    value: unknown,
    fields: ComponentDataField[]
  ) => {
    if (value === null || value === undefined) {
      return;
    }

    fields.push({
      name,
      value: value.toString(),
      parent,
      isLeaf: typeof value !== 'object',
    });

    if (Array.isArray(value)) {
      value.forEach((fieldElem, i) => {
        getComponentDataFieldsHelper(`${name}[${i}]`, name, fieldElem, fields);
      });
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([fieldKey, fieldVal]) => {
        getComponentDataFieldsHelper(
          `${name}.${fieldKey}`,
          name,
          fieldVal,
          fields
        );
      });
    }
  };

  const fields: ComponentDataField[] = [];
  getComponentDataFieldsHelper(
    component.name,
    undefined,
    getComponentData(component),
    fields
  );
  return fields;
};

const getMemberExpressionName = (
  memberExpression: MemberExpression
): string => {
  const getMemberExpressionNameHelper = (
    node: MemberExpression
  ): [string, boolean] => {
    if ('name' in node) {
      return [node.name as string, false];
    }

    const [fullName, isEnd] = getMemberExpressionNameHelper(
      node.object as MemberExpression
    );

    if (isEnd) {
      return [fullName, isEnd];
    }

    if ('name' in node.property) {
      return [`${fullName}.${node.property.name}`, false];
    }

    if ('raw' in node.property) {
      return [fullName, true];
    }

    return [fullName, false];
  };

  return getMemberExpressionNameHelper(memberExpression)[0];
};

type ComponentToken = {
  name: string;
  start: number;
};

export const getComponentTokens = (
  expression: string,
  components: Component[]
): ComponentToken[] => {
  const tokens: ComponentToken[] = [];
  const componentNames = _.map(components, 'name');

  try {
    const tree = acorn.parse(expression);

    walk.recursive(tree, null, {
      MemberExpression: (memberExpression: MemberExpression) => {
        const fieldName = getMemberExpressionName(memberExpression);
        const { componentName } = parseComponentFieldName(fieldName);

        if (componentNames.includes(componentName)) {
          tokens.push({
            name: fieldName,
            start: memberExpression.start as number,
          });
        }
      },
      Identifier: (identifier: Identifier) => {
        const { name, start } = identifier;
        if (componentNames.includes(name)) {
          tokens.push({
            name,
            start: start ?? 0,
          });
        }
      },
    });
  } catch {
    // Do nothing
  }

  return tokens;
};

export const updateDynamicTermComponents = (
  expression: string,
  originalComponentName: string,
  newComponentName: string,
  components: Component[]
): string => {
  const dynamicTerms = parseDynamicTerms(expression);

  const newDynamicTerms = dynamicTerms.map((dynamicTerm) => {
    const componentTokens = getComponentTokens(
      dynamicTerm.expression,
      components
    );

    const newComponentNames = componentTokens.map((componentToken) => {
      const { componentName, fieldName } = parseComponentFieldName(
        componentToken.name
      );
      if (componentName !== originalComponentName) {
        return componentToken.name;
      }
      return fieldName ? `${newComponentName}.${fieldName}` : newComponentName;
    });

    const newDynamicExpression = replaceTokensAtIndices(
      dynamicTerm.expression,
      _.map(componentTokens, 'name'),
      newComponentNames,
      _.map(componentTokens, 'start')
    );

    return `{{ ${newDynamicExpression} }}`;
  });

  const newExpression = replaceTokensAtIndices(
    expression,
    _.map(dynamicTerms, 'group'),
    newDynamicTerms,
    _.map(dynamicTerms, 'start')
  );

  return newExpression;
};
