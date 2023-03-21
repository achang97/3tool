import {
  Identifier,
  VariableDeclarator,
  MemberExpression,
  FunctionDeclaration,
  CallExpression,
} from '@babel/types';
import { Node } from 'acorn';
import _ from 'lodash';
import MagicString from 'magic-string';

const acorn = require('acorn');
const walk = require('acorn-walk');

const FUNCTION_TOKENS = ['() => {', '}'];

export const acornParse = (expression: string): Node => {
  return acorn.parse(expression, { ecmaVersion: 'latest' });
};

const withFunction = (expression: string): string => {
  return `${FUNCTION_TOKENS[0]}${expression}${FUNCTION_TOKENS[1]}`;
};

export const parseDynamicTerms = (
  expression: string
): {
  group: string;
  expression: string;
  start: number;
}[] => {
  const dynamicJavascriptRegex = /{{(?<={{)(.*?)(?=}})}}/g;
  return [...expression.matchAll(dynamicJavascriptRegex)].map((group) => {
    const start = group.index ?? 0;

    return {
      group: group[0],
      expression: group[1],
      start,
    };
  });
};

export const parseObjectVariable = (
  field: string
): {
  objectName: string;
  rootFieldName: string;
  fieldName: string;
} => {
  const firstPeriodIndex = field.indexOf('.');
  if (firstPeriodIndex === -1) {
    return { objectName: field, rootFieldName: '', fieldName: '' };
  }

  const objectName = field.substring(0, firstPeriodIndex);
  const fieldName = field.substring(firstPeriodIndex + 1);
  let rootFieldName = fieldName;

  walk.simple(acornParse(fieldName), {
    Identifier: (identifier: Identifier) => {
      rootFieldName = identifier.name;
    },
  });

  return {
    objectName,
    rootFieldName,
    fieldName,
  };
};

const parseMemberExpressionName = (
  memberExpression: MemberExpression
): string => {
  const parseMemberExpressionNameHelper = (
    node: MemberExpression
  ): [string, boolean] => {
    if ('name' in node) {
      return [node.name as string, false];
    }

    const [fullName, isEnd] = parseMemberExpressionNameHelper(
      node.object as MemberExpression
    );

    if (isEnd) {
      return [fullName, isEnd];
    }

    if ('name' in node.property) {
      return [`${fullName}.${node.property.name}`, false];
    }

    // Don't descend any further after reaching array indexing
    if ('raw' in node.property) {
      return [fullName, true];
    }

    return [fullName, false];
  };

  return parseMemberExpressionNameHelper(memberExpression)[0];
};

export const parseVariables = (
  expression: string,
  includedVariableNames: string[]
): string[] => {
  const variables = new Set<string>();

  try {
    const tree = acornParse(withFunction(expression));

    walk.recursive(tree, null, {
      CallExpression: (callExpression: CallExpression) => {
        let node: unknown = callExpression;
        while (_.get(node, 'callee.object')) {
          node = _.get(node, 'callee.object');
        }
        const fieldName = parseMemberExpressionName(node as MemberExpression);
        const { objectName } = parseObjectVariable(fieldName);

        if (includedVariableNames.includes(objectName)) {
          variables.add(fieldName);
        }
      },
      MemberExpression: (memberExpression: MemberExpression) => {
        const fieldName = parseMemberExpressionName(memberExpression);
        const { objectName } = parseObjectVariable(fieldName);

        if (includedVariableNames.includes(objectName)) {
          variables.add(fieldName);
        }
      },
      Identifier: (identifier: Identifier) => {
        const { name } = identifier;
        if (includedVariableNames.includes(name)) {
          variables.add(name);
        }
      },
    });
  } catch {
    // Do nothing
  }

  return [...variables];
};

export const parseDynamicTermVariables = (
  expression: string,
  includedVariableNames: string[]
): string[] => {
  const variables = new Set<string>();

  const dynamicTerms = parseDynamicTerms(expression);
  dynamicTerms.forEach((dynamicTerm) => {
    const termVariables = parseVariables(
      dynamicTerm.expression,
      includedVariableNames
    );
    termVariables.forEach((termVariable) => variables.add(termVariable));
  });

  return [...variables];
};

export const parseDeclaredVariables = (expression: string): string[] => {
  const variables = new Set<string>();

  try {
    const tree = acornParse(withFunction(expression));
    walk.recursive(tree, null, {
      FunctionDeclaration: (functionDeclaration: FunctionDeclaration) => {
        const name = functionDeclaration.id?.name;
        if (name) {
          variables.add(name);
        }
      },
      VariableDeclarator: (variableDeclarator: VariableDeclarator) => {
        const name =
          'name' in variableDeclarator.id ? variableDeclarator.id.name : '';
        if (name) {
          variables.add(name);
        }
      },
    });
  } catch {
    // Do nothing
  }

  return [...variables];
};

export const replaceVariableName = (
  expression: string,
  prevVariableName: string,
  newVariableName: string
) => {
  const newExpression = new MagicString(expression);
  const redeclaredVariables = parseDeclaredVariables(expression);

  try {
    const tree = acornParse(withFunction(expression));

    walk.recursive(tree, null, {
      Identifier: (identifier: Identifier) => {
        const { name, start } = identifier;
        if (name === prevVariableName && typeof start === 'number') {
          newExpression.update(
            start - FUNCTION_TOKENS[0].length,
            start - FUNCTION_TOKENS[0].length + prevVariableName.length,
            newVariableName
          );
        }
      },
    });
  } catch {
    // Do nothing
  }

  if (redeclaredVariables.includes(prevVariableName)) {
    return expression;
  }
  return newExpression.toString();
};

export const replaceDynamicTermVariableName = (
  expression: string,
  prevVariableName: string,
  newVariableName: string
): string => {
  const dynamicTerms = parseDynamicTerms(expression);
  const newExpression = new MagicString(expression);

  dynamicTerms.forEach((dynamicTerm) => {
    const newDynamicTerm = replaceVariableName(
      dynamicTerm.expression,
      prevVariableName,
      newVariableName
    );
    newExpression.update(
      dynamicTerm.start,
      dynamicTerm.start + dynamicTerm.group.length,
      `{{${newDynamicTerm}}}`
    );
  });

  return newExpression.toString();
};

export type FlatField = {
  name: string;
  value: string;
  parent?: string;
  isLeaf: boolean;
};

export const flattenObjectFields = (
  object: Object | undefined,
  { prefix, onlyLeaves }: { prefix?: string; onlyLeaves?: boolean } = {}
): FlatField[] => {
  const flattenObjectFieldsHelper = (
    name: string | undefined,
    parent: string | undefined,
    value: unknown,
    fields: FlatField[]
  ) => {
    if (value === null || value === undefined) {
      return;
    }

    // Skip the root-level object
    const isRoot = name === undefined || name === prefix;
    const isLeaf = typeof value !== 'object';

    if (!isRoot && (isLeaf || !onlyLeaves)) {
      fields.push({
        name,
        // For now, we don't care about values that aren't strings, so we just stringify everything.
        value: value.toString(),
        parent,
        isLeaf,
      });
    }

    if (Array.isArray(value)) {
      value.forEach((fieldElem, i) => {
        flattenObjectFieldsHelper(`${name}[${i}]`, name, fieldElem, fields);
      });
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([fieldKey, fieldVal]) => {
        flattenObjectFieldsHelper(
          name ? `${name}.${fieldKey}` : fieldKey,
          name,
          fieldVal,
          fields
        );
      });
    }
  };

  const fields: FlatField[] = [];
  flattenObjectFieldsHelper(prefix, undefined, object, fields);
  return fields;
};

export const getPrototypeFunctions = (value: unknown): Function[] => {
  if (!value) {
    return [];
  }

  const prototype = Object.getPrototypeOf(value);
  const functionNames = Object.getOwnPropertyNames(prototype);

  return _.chain(functionNames)
    .filter((name) => name !== 'constructor' && !name.startsWith('__'))
    .map((name) => _.get(prototype, name))
    .value();
};

export const overwriteArrayMergeCustomizer = (
  _src: unknown,
  update: unknown
) => {
  if (Array.isArray(update)) {
    return update;
  }
  return undefined;
};
