import { GLOBAL_LIBRARIES } from '@app/constants';
import { ComponentFieldType } from '@app/types';
import { parseDynamicTerms } from './codeMirror';

const getValidTypes = (
  type: ComponentFieldType | ComponentFieldType[]
): ComponentFieldType[] => {
  return Array.isArray(type) ? type : [type];
};

export const stringifyByType = (
  value: unknown,
  type: ComponentFieldType | ComponentFieldType[]
): string => {
  const isArrayOrObject = getValidTypes(type).find(
    (validType) => validType === 'array' || validType === 'object'
  );

  if (isArrayOrObject) {
    return JSON.stringify(value);
  }

  if (value === null || value === undefined) {
    return '';
  }

  return value.toString();
};

const evalWithArgs = (
  expression: string,
  args: Record<string, unknown>
): unknown => {
  const componentArgNames = Object.keys(args);
  const libraryArgNames = GLOBAL_LIBRARIES.map(({ importName }) => importName);
  const allArgNames = [...componentArgNames, ...libraryArgNames];

  const libraryArgs = GLOBAL_LIBRARIES.reduce(
    (currArgs, { importName, library }) => {
      currArgs[importName] = library;
      return currArgs;
    },
    {} as Record<string, unknown>
  );

  const trimmedExpression = expression.trim();
  if (!trimmedExpression) {
    return undefined;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const evalFn = new Function(
      `{ ${allArgNames.join(', ')} }`,
      `return (${trimmedExpression})`
    );
    return evalFn({ ...libraryArgs, ...args });
  } catch (e) {
    const error = e as Error;
    if (error.message === "Unexpected token ')'") {
      throw new Error(`Invalid JS syntax: '${trimmedExpression}'`);
    }
    throw error;
  }
};

const evalDynamicTerms = (
  expression: string,
  type: ComponentFieldType | ComponentFieldType[],
  dynamicArgs: Record<string, unknown>
): string => {
  const dynamicTerms = parseDynamicTerms(expression);

  // Evaluate as pure JS if the expression is just 1 dynamic group
  const isDynamicExpression =
    dynamicTerms.length === 1 && dynamicTerms[0].group === expression.trim();
  if (isDynamicExpression) {
    const result = evalWithArgs(dynamicTerms[0].expression, dynamicArgs);
    return stringifyByType(result, type);
  }

  let result = expression;

  for (let i = 0; i < dynamicTerms.length; i++) {
    const dynamicTerm = dynamicTerms[i];
    const groupResult = evalWithArgs(dynamicTerm.expression, dynamicArgs);
    const groupResultStr = stringifyByType(groupResult, type);

    result = result.replace(dynamicTerm.group, groupResultStr);
  }

  return result;
};

const getValueType = (value: unknown) => {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
};

const evalAsType = (
  expression: string,
  type: ComponentFieldType | ComponentFieldType[]
): unknown => {
  const validTypes = getValidTypes(type);

  let value: unknown = expression;
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    value = new Function(`return ${value}`)();
  } catch (e) {
    // Do nothing
  }

  const valueType = getValueType(value);

  // Any
  if (validTypes.includes('any')) {
    return value;
  }

  // Number
  if (
    validTypes.includes('number') &&
    ['number', 'null', 'undefined'].includes(valueType)
  ) {
    return value;
  }

  // Array
  if (validTypes.includes('array') && valueType === 'array') {
    return value;
  }

  // Object
  if (validTypes.includes('object') && valueType === 'object') {
    return value;
  }

  // Boolean
  if (validTypes.includes('boolean')) {
    return Boolean(value);
  }

  // String
  if (validTypes.includes('string')) {
    return expression;
  }

  if (validTypes.includes('nested')) {
    throw new Error('Unable to evaluate nested value');
  }

  throw new Error(
    `Expected value of type '${validTypes.join(
      ' | '
    )}', received value of type '${valueType}'`
  );
};

export type EvalResult<ValueType = unknown> = {
  parsedExpression?: string;
  value?: ValueType;
  error?: Error;
};

export const evalExpression = (
  expression: string,
  type: ComponentFieldType | ComponentFieldType[],
  dynamicArgs?: Record<string, unknown>
): EvalResult => {
  try {
    const parsedExpression = dynamicArgs
      ? evalDynamicTerms(expression, type, dynamicArgs)
      : expression;

    return {
      parsedExpression,
      value: evalAsType(parsedExpression, type),
    };
  } catch (e) {
    return {
      error: e as Error,
    };
  }
};
