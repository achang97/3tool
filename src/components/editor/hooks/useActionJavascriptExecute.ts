import { useCallback } from 'react';
import { asyncEvalWithArgs } from '../utils/eval';
import { useEvalArgs } from './useEvalArgs';

export const useActionJavascriptExecute = () => {
  const { staticEvalArgs } = useEvalArgs();

  const executeJavascript = useCallback(
    async (code: string, args?: Record<string, unknown>) => {
      return asyncEvalWithArgs(code, { ...staticEvalArgs, ...args }, true);
    },
    [staticEvalArgs]
  );

  return executeJavascript;
};
