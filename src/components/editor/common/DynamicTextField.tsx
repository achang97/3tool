import CodeMirror, { BasicSetupOptions } from '@uiw/react-codemirror';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { dynamicJavascriptLanguage } from '@app/codemirror/dynamicJavascript/language';
import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { useDynamicTextFieldAutocomplete } from '../hooks/useDynamicTextFieldAutocomplete';
import { useDynamicTextFieldPreview } from '../hooks/useDynamicTextFieldPreview';
import { DynamicTextFieldPreview } from './DynamicTextFieldPreview';
import { EvalResult } from '../utils/eval';

export type DynamicTextFieldProps = {
  label: string;
  value?: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  evalResult?: EvalResult;
};

const BASIC_SETUP: BasicSetupOptions = {
  lineNumbers: false,
  highlightActiveLineGutter: false,
  highlightActiveLine: false,
  foldGutter: false,
  indentOnInput: false,
};

const BASE_EXTENSIONS = [
  dynamicJavascriptLanguage,
  javascript().support,
  EditorView.lineWrapping,
];

export const DynamicTextField = ({
  label,
  value,
  evalResult,
  onChange,
}: DynamicTextFieldProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const autocomplete = useDynamicTextFieldAutocomplete();
  const preview = useDynamicTextFieldPreview(evalResult);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChange = useCallback(
    (newValue: string, viewUpdate: ViewUpdate) => {
      setLocalValue(newValue);
      onChange?.(newValue, viewUpdate);
    },
    [onChange]
  );

  const extensions = useMemo(() => {
    return [
      ...BASE_EXTENSIONS,
      javascriptLanguage.data.of({
        autocomplete,
      }),
    ];
  }, [autocomplete]);

  const className = useMemo(() => {
    const classes = [];

    if (isFocused) {
      classes.push('dynamic-focused');
    }

    if (evalResult?.error) {
      classes.push('dynamic-error');
    }

    return classes.join(' ');
  }, [evalResult?.error, isFocused]);

  return (
    <Box
      sx={{ position: 'relative' }}
      data-testid={`dynamic-text-field-${label}`}
    >
      <FormFieldLabel label={label} />
      <CodeMirror
        basicSetup={BASIC_SETUP}
        extensions={extensions}
        value={localValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={className}
      />
      {isFocused && (
        <DynamicTextFieldPreview
          alertType={preview.alertType}
          type={preview.type}
          message={preview.message}
        />
      )}
    </Box>
  );
};
