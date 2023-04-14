import { CodeMirror, CodeMirrorProps } from '@app/components/editor/common/CodeMirror';
import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { useEnqueueSnackbar } from '@app/components/editor/hooks/useEnqueueSnackbar';
import { usePrevious } from '@app/hooks/usePrevious';
import { FieldType } from '@app/types';
import { useEffect, useMemo } from 'react';

type InspectorTextFieldProps = {
  name?: string;
  type: FieldType;
} & Omit<CodeMirrorProps, 'language' | 'type'>;

export const InspectorTextField = ({
  name,
  value = '',
  isAutosaved,
  label,
  testId,
  ...rest
}: InspectorTextFieldProps) => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const { dataDepCycles } = useActiveTool();

  const cyclePath = useMemo(() => {
    if (!name) {
      return undefined;
    }
    return dataDepCycles[name];
  }, [dataDepCycles, name]);
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
      testId={testId ?? `inspector-text-${label}`}
    />
  );
};
