import BaseCodeMirror from '@uiw/react-codemirror';
import { ViewUpdate } from '@codemirror/view';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { useIsFocused } from '@app/hooks/useIsFocused';
import { FieldType } from '@app/types';
import { CodeMirrorPreview } from './CodeMirrorPreview';
import { useCodeMirrorPreview } from '../hooks/useCodeMirrorPreview';
import { useCodeMirrorProps } from '../hooks/useCodeMirrorProps';

export type CodeMirrorProps = {
  label?: ReactNode;
  value?: string;
  placeholder?: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  type?: FieldType;
  language: 'text' | 'javascript' | 'sql';
  isAutosaved?: boolean;
  showLineNumbers?: boolean;
  hasError?: boolean;
  testId?: string;
};

export const CodeMirror = ({
  label,
  value,
  placeholder,
  onChange,
  type = 'string',
  language,
  isAutosaved,
  showLineNumbers = false,
  testId,
  hasError,
}: CodeMirrorProps) => {
  const [localValue, setLocalValue] = useState(value);
  const { isFocused, onFocus, onBlur } = useIsFocused();

  const isDynamic = useMemo(() => {
    return language !== 'javascript';
  }, [language]);

  const isPreviewShown = useMemo(() => {
    return isDynamic && isFocused;
  }, [isDynamic, isFocused]);

  const preview = useCodeMirrorPreview({ type, isDynamic, expression: value });
  const { basicSetup, extensions, className } = useCodeMirrorProps({
    isFocused,
    isDynamic,
    hasError: hasError || preview?.alertType === 'error',
    showLineNumbers,
    language,
  });

  const handleChange = useCallback(
    (newValue: string, viewUpdate: ViewUpdate) => {
      setLocalValue(newValue);
      onChange(newValue, viewUpdate);
    },
    [onChange]
  );

  return (
    <Box sx={{ position: 'relative' }} data-testid={testId ?? `code-mirror-${label}`}>
      {label && <FormFieldLabel label={label} />}
      <BaseCodeMirror
        basicSetup={basicSetup}
        extensions={extensions}
        value={isAutosaved ? localValue : value}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        className={className}
      />
      {isPreviewShown && preview && (
        <CodeMirrorPreview
          alertType={preview.alertType}
          type={preview.type}
          message={preview.message}
        />
      )}
    </Box>
  );
};
