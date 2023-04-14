import { TransformableData } from '@app/types';
import { useCallback } from 'react';
import { useActionJavascriptExecute } from './useActionJavascriptExecute';

export const useActionTransformer = () => {
  const executeJavascript = useActionJavascriptExecute();

  const transformData = useCallback(
    async (transformableData: TransformableData, inputData: unknown) => {
      const { transformer, transformerEnabled } = transformableData;
      if (!transformerEnabled) {
        return inputData;
      }

      return executeJavascript(transformer, { data: inputData });
    },
    [executeJavascript]
  );

  return transformData;
};
