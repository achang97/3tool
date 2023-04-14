import { FieldType } from '@app/types';
import { useCallback } from 'react';
import { evalDynamicExpression } from '../utils/eval';
import { useEvalArgs } from './useEvalArgs';

export const useEvalDynamicValue = () => {
  const { dynamicEvalArgs } = useEvalArgs();

  const evalValue = useCallback(
    <T = unknown>(value: string, fieldType: FieldType, args?: Record<string, unknown>) => {
      const combinedArgs = { ...dynamicEvalArgs, ...args };
      return evalDynamicExpression(value, fieldType, combinedArgs)?.value as T;
    },
    [dynamicEvalArgs]
  );

  return evalValue;
};
