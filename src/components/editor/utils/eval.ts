import { FieldType } from '@app/types';
import { parseDeclaredVariables, parseDynamicTerms } from './javascript';

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

export const stringifyByType = (value: unknown, type: FieldType): string => {
  if (type === 'array' || type === 'object') {
    return JSON.stringify(value);
  }

  if (value === null || value === undefined) {
    return '';
  }

  return value.toString();
};

const baseEvalWithArgs = (
  expression: string,
  args: Record<string, unknown>,
  hasReturnValue: boolean,
  FunctionConstructor: FunctionConstructor
): unknown => {
  const redeclaredVariables = parseDeclaredVariables(expression);
  const argNames = Object.keys(args).filter((arg) => !redeclaredVariables.includes(arg));

  const trimmedExpression = expression.trim();
  if (!trimmedExpression) {
    return undefined;
  }

  try {
    const evalFn = new FunctionConstructor(
      `{ ${argNames.join(', ')} }`,
      hasReturnValue ? trimmedExpression : `return (${trimmedExpression})`
    );
    return evalFn(args);
  } catch (e) {
    const error = e as Error;
    if (!hasReturnValue && error.message === "Unexpected token ')'") {
      throw new Error(`Invalid JavaScript syntax: '${trimmedExpression}'`);
    }
    throw error;
  }
};

const evalWithArgs = (
  expression: string,
  args: Record<string, unknown>,
  hasReturnValue: boolean
): unknown => {
  return baseEvalWithArgs(expression, args, hasReturnValue, Function);
};

export const asyncEvalWithArgs = async (
  expression: string,
  args: Record<string, unknown>,
  hasReturnValue: boolean
): Promise<unknown> => {
  return baseEvalWithArgs(expression, args, hasReturnValue, AsyncFunction);
};

const evalDynamicTerms = (
  expression: string,
  type: FieldType,
  dynamicArgs: Record<string, unknown>
): string => {
  const dynamicTerms = parseDynamicTerms(expression);

  // Evaluate as pure JS if the expression is just 1 dynamic group
  const isDynamicExpression =
    dynamicTerms.length === 1 && dynamicTerms[0].group === expression.trim();
  if (isDynamicExpression) {
    const result = evalWithArgs(dynamicTerms[0].expression, dynamicArgs, false);
    return stringifyByType(result, type);
  }

  let result = expression;

  for (let i = 0; i < dynamicTerms.length; i++) {
    const dynamicTerm = dynamicTerms[i];
    const groupResult = evalWithArgs(dynamicTerm.expression, dynamicArgs, false);
    const groupResultStr = stringifyByType(groupResult, type);

    result = result.replace(dynamicTerm.group, groupResultStr);
  }

  return result;
};

const getValue = (expression: string): unknown => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return ${expression}`)();
  } catch {
    return expression;
  }
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

// TODO: We should probably avoid evaluating by default, as this results in output
// being logged to the console for expressions like "console.log(1)".
const evalAsType = (expression: string, type: FieldType): unknown => {
  const value = getValue(expression);
  const valueType = getValueType(value);

  // Any
  if (type === 'any') {
    return value;
  }

  // Number
  if (type === 'number' && ['number', 'null', 'undefined'].includes(valueType)) {
    return value;
  }

  // Array
  if (type === 'array' && valueType === 'array') {
    return value;
  }

  // Object
  if (type === 'object' && valueType === 'object') {
    return value;
  }

  // Boolean
  if (type === 'boolean') {
    return Boolean(value);
  }

  // String
  if (type === 'string') {
    return expression;
  }

  if (type === 'nested') {
    throw new Error('Unable to evaluate nested value');
  }

  throw new Error(`Expected value of type '${type}', received value of type '${valueType}'`);
};

export type EvalResult<ValueType = unknown> = {
  parsedExpression?: string;
  value?: ValueType;
  error?: Error;
};

export const evalDynamicExpression = (
  expression: string,
  type: FieldType,
  dynamicArgs: Record<string, unknown>
): EvalResult => {
  try {
    const parsedExpression = evalDynamicTerms(expression, type, dynamicArgs);
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
