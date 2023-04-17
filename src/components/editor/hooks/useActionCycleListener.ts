import { useEffect, useMemo } from 'react';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { useActiveTool } from './useActiveTool';

export const useActionCycleListener = (name: string) => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const { dataDepCycles } = useActiveTool();

  const actionCycles = useMemo(() => {
    return Object.entries(dataDepCycles)
      .filter(([key]) => key.includes(name))
      .map((entry) => entry[1]);
  }, [dataDepCycles, name]);

  useEffect(() => {
    actionCycles.forEach((cyclePath) => {
      enqueueSnackbar(`Dependency Cycle Found: ${cyclePath.join(' → ')}`, {
        variant: 'error',
      });
    });
  }, [actionCycles, enqueueSnackbar]);
};
