import { LoopableData } from '@app/types';
import { useCallback } from 'react';
import { useActionJavascriptExecute } from './useActionJavascriptExecute';

export type LoopResult<T> =
  | T
  | {
      element: unknown;
      data: T;
    }[];

export const useActionLoop = () => {
  const executeJavascript = useActionJavascriptExecute();

  const executeLoop = useCallback(
    async <T = unknown>(
      loopableData: LoopableData,
      elementCallback: (element?: unknown) => Promise<T>
    ): Promise<LoopResult<T>> => {
      const { loopElements, loopEnabled } = loopableData;
      if (!loopEnabled) {
        return elementCallback();
      }

      const evalLoopElements = await executeJavascript(loopElements);
      if (!Array.isArray(evalLoopElements)) {
        throw new Error('Loop code did not return a valid array.');
      }

      const results = await Promise.all(
        evalLoopElements.map((element) => elementCallback(element))
      );

      return evalLoopElements.map((element, i) => ({
        element,
        data: results[i],
      }));
    },
    [executeJavascript]
  );

  return executeLoop;
};
