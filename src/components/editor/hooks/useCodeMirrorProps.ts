import { Extension } from '@codemirror/state';
import { BasicSetupOptions } from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { javascript, javascriptLanguage, esLint } from '@codemirror/lang-javascript';
import { dynamicTextLanguage } from '@app/codemirror/dynamicTextLanguage';
import { dynamicSqlLanguage, sqlLanguage } from '@app/codemirror/dynamicSqlLanguage';
import { EditorView } from '@codemirror/view';
import { linter } from '@codemirror/lint';
// @ts-ignore No types for this package
import { Linter } from 'eslint-linter-browserify';
import { useCodeMirrorJavascriptAutocomplete } from './useCodeMirrorJavascriptAutocomplete';
import { useCodeMirrorEslintConfig } from './useCodeMirrorEslintConfig';

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
};

export const useCodeMirrorProps = ({
  language,
  isFocused,
  isDynamic,
  hasError,
  showLineNumbers,
}: HookArgs): HookReturnType => {
  const javascriptAutocomplete = useCodeMirrorJavascriptAutocomplete(isDynamic);
  const eslintConfig = useCodeMirrorEslintConfig();

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
        return [
          ...baseExtensions,
          javascriptLanguage,
          linter((view) => {
            const results = esLint(new Linter(), eslintConfig)(view);
            // We explicitly exclude this error message because `sourceType: module` and
            // `globalReturn: true` are incompatible in the eslint config.
            return results.filter(
              (result) => result.message !== "Parsing error: 'return' outside of function"
            );
          }),
        ];
      case 'sql':
        return [...baseExtensions, sqlLanguage.support, dynamicSqlLanguage];
      default:
        return baseExtensions;
    }
  }, [javascriptAutocomplete, language, eslintConfig]);

  const className = useMemo(() => {
    const classes = [];
    if (isDynamic && isFocused) {
      classes.push('cm-editor-dynamic-focused');
    }
    if (hasError) {
      classes.push('cm-editor-error');
    }
    return classes.join(' ');
  }, [hasError, isDynamic, isFocused]);

  return {
    basicSetup,
    extensions,
    className,
  };
};
