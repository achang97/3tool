import { Identifier, VariableDeclarator, MemberExpression } from '@babel/types';
import { Node } from 'acorn';
import MagicString from 'magic-string';

const acorn = require('acorn');
const walk = require('acorn-walk');

export const acornParse = (expression: string): Node => {
  return acorn.parse(expression, { ecmaVersion: 'latest' });
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
  rootFieldName?: string;
  fieldName?: string;
} => {
  const firstPeriodIndex = field.indexOf('.');
  if (firstPeriodIndex === -1) {
    return { objectName: field };
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
    const tree = acornParse(expression);

    walk.recursive(tree, null, {
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

export const replaceVariableName = (
  expression: string,
  prevVariableName: string,
  newVariableName: string
) => {
  const newExpression = new MagicString(expression);
  let hasRedeclared = false;

  try {
    const tree = acornParse(expression);

    walk.recursive(tree, null, {
      VariableDeclarator: (node: VariableDeclarator) => {
        if ('name' in node.id && node.id.name === prevVariableName) {
          hasRedeclared = true;
        }
      },
      Identifier: (identifier: Identifier) => {
        const { name, start } = identifier;
        if (name === prevVariableName && typeof start === 'number') {
          newExpression.update(
            start,
            start + prevVariableName.length,
            newVariableName
          );
        }
      },
    });
  } catch {
    // Do nothing
  }

  if (hasRedeclared) {
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
      dynamicTerm.group.length,
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
  { prefix, onlyLeaves = true }: { prefix?: string; onlyLeaves?: boolean } = {}
): FlatField[] => {
  const getComponentDataFieldsHelper = (
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
        getComponentDataFieldsHelper(`${name}[${i}]`, name, fieldElem, fields);
      });
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([fieldKey, fieldVal]) => {
        getComponentDataFieldsHelper(
          name ? `${name}.${fieldKey}` : fieldKey,
          name,
          fieldVal,
          fields
        );
      });
    }
  };

  const fields: FlatField[] = [];
  getComponentDataFieldsHelper(prefix, undefined, object, fields);
  return fields;
};
