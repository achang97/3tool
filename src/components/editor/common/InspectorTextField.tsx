import {
  CodeMirror,
  CodeMirrorProps,
} from '@app/components/editor/common/CodeMirror';
import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { useEnqueueSnackbar } from '@app/components/editor/hooks/useEnqueueSnackbar';
import { usePrevious } from '@app/hooks/usePrevious';
import { useEffect, useMemo } from 'react';

type InspectorTextFieldProps = {
  name: string;
} & Omit<CodeMirrorProps, 'language'>;

export const InspectorTextField = ({
  name,
  value = '',
  isAutosaved,
  label,
  ...rest
}: InspectorTextFieldProps) => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const { dataDepCycles } = useActiveTool();

  const cyclePath = useMemo(() => dataDepCycles[name], [dataDepCycles, name]);
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (!isAutosaved || !cyclePath) {
      return;
    }

    if (prevValue === undefined || prevValue === value) {
      return;
    }

    enqueueSnackbar(`Dependency Cycle Found: ${cyclePath.join(' → ')}`, {
      variant: 'error',
    });
  }, [value, prevValue, cyclePath, enqueueSnackbar, isAutosaved]);

  return (
    <CodeMirror
      {...rest}
      label={label}
      value={value}
      language="text"
      isAutosaved={isAutosaved}
      testId={`inspector-text-${label}`}
    />
  );
};
