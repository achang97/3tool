import { Extension } from '@codemirror/state';
import { BasicSetupOptions } from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { dynamicTextLanguage } from '@app/codemirror/dynamicTextLanguage';
import { dynamicSqlLanguage, sqlLanguage } from '@app/codemirror/dynamicSqlLanguage';
import { EditorView } from '@codemirror/view';
import { useCodeMirrorJavascriptAutocomplete } from './useCodeMirrorJavascriptAutocomplete';

export const BASE_EXTENSIONS = [javascript().support, EditorView.lineWrapping];
const BASE_SETUP_OPTIONS: BasicSetupOptions = {
  highlightActiveLineGutter: false,
  highlightActiveLine: false,
  tabSize: 4,
};

type HookArgs = {
  language: 'text' | 'javascript' | 'sql';
  isFocused: boolean;
  isDynamic: boolean;
  hasError: boolean;
  showLineNumbers: boolean;
};

type HookReturnType = {
  basicSetup: BasicSetupOptions;
  extensions: Extension[];
  className: string;
  isDynamic: boolean;
};

export const useCodeMirrorProps = ({
  language,
  isFocused,
  isDynamic,
  hasError,
  showLineNumbers,
}: HookArgs): HookReturnType => {
  const javascriptAutocomplete = useCodeMirrorJavascriptAutocomplete(isDynamic);

  const basicSetup: BasicSetupOptions = useMemo(() => {
    if (!showLineNumbers) {
      return {
        ...BASE_SETUP_OPTIONS,
        lineNumbers: false,
        foldGutter: false,
        indentOnInput: false,
      };
    }

    return {
      ...BASE_SETUP_OPTIONS,
      lineNumbers: true,
      foldGutter: true,
      indentOnInput: false,
    };
  }, [showLineNumbers]);

  const extensions: Extension[] = useMemo(() => {
    const baseExtensions = [
      ...BASE_EXTENSIONS,
      javascriptLanguage.data.of({
        autocomplete: javascriptAutocomplete,
      }),
    ];

    switch (language) {
      case 'text':
        return [...baseExtensions, dynamicTextLanguage];
      case 'javascript':
        return [...baseExtensions, javascriptLanguage];
      case 'sql':
        return [...baseExtensions, sqlLanguage.support, dynamicSqlLanguage];
      default:
        return baseExtensions;
    }
  }, [javascriptAutocomplete, language]);

  const className = useMemo(() => {
    if (!isDynamic) {
      return '';
    }

    const classes = [];
    if (isFocused) {
      classes.push('dynamic-focused');
    }
    if (hasError) {
      classes.push('dynamic-error');
    }
    return classes.join(' ');
  }, [hasError, isDynamic, isFocused]);

  return {
    basicSetup,
    extensions,
    className,
    isDynamic,
  };
};
