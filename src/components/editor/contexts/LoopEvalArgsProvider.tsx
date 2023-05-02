import { LoopableData } from '@app/types';
import _ from 'lodash';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useActionJavascriptExecute } from '../hooks/useActionJavascriptExecute';
import { LocalEvalArgsProvider } from './LocalEvalArgsContext';

type LoopEvalArgsProviderProps = {
  data?: LoopableData;
  children: ReactNode;
};

export const DEBOUNCE_TIME_MS = 1000;

export const LoopEvalArgsProvider = ({ data, children }: LoopEvalArgsProviderProps) => {
  const executeJavascript = useActionJavascriptExecute();
  const [args, setArgs] = useState({});
  const [error, setError] = useState('');

  const evalLoopCode = useCallback(
    async (loopElements: string) => {
      const evalLoopElements = await executeJavascript(loopElements);
      if (!Array.isArray(evalLoopElements)) {
        throw new Error(
          `Expected value of type array, received value of type '${typeof evalLoopElements}'`
        );
      }
      return evalLoopElements;
    },
    [executeJavascript]
  );

  const loadElement = useCallback(
    async (loopableData: LoopableData | undefined) => {
      if (!loopableData?.loopEnabled) {
        setArgs({});
        setError('');
        return;
      }

      try {
        const loopElements = await evalLoopCode(loopableData.loopElements);
        setArgs({ element: loopElements[0] });
        setError('');
      } catch (e) {
        setArgs({});
        setError((e as Error).message);
      }
    },
    [evalLoopCode]
  );

  const debouncedLoadElement = useMemo(() => {
    return _.debounce(loadElement, DEBOUNCE_TIME_MS);
  }, [loadElement]);

  useEffect(() => {
    debouncedLoadElement(data);
  }, [debouncedLoadElement, data]);

  return (
    <LocalEvalArgsProvider args={args} error={error}>
      {children}
    </LocalEvalArgsProvider>
  );
};
