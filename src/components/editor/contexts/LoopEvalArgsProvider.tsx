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

  const loadElement = useCallback(
    async (loopableData?: LoopableData) => {
      if (!loopableData?.loopEnabled) {
        setArgs({});
        return;
      }

      let evalLoopElements: unknown;
      try {
        evalLoopElements = await executeJavascript(loopableData.loopElements);
      } catch {
        evalLoopElements = {};
      }

      if (!Array.isArray(evalLoopElements)) {
        setArgs({});
        return;
      }
      setArgs({ element: evalLoopElements[0] });
    },
    [executeJavascript]
  );

  const debouncedLoadElement = useMemo(() => {
    return _.debounce(loadElement, DEBOUNCE_TIME_MS);
  }, [loadElement]);

  useEffect(() => {
    debouncedLoadElement(data);
  }, [debouncedLoadElement, data]);

  return <LocalEvalArgsProvider args={args}>{children}</LocalEvalArgsProvider>;
};
