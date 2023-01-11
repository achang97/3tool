import { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {
  javascript,
  javascriptLanguage,
  scopeCompletionSource,
} from '@codemirror/lang-javascript';
import { Box } from '@mui/material';

type CodeEditorProps = {
  height?: string;
};

export const CodeEditor = ({ height = '200px' }: CodeEditorProps) => {
  const [value, setValue] = useState("console.log('hello world!');");

  const handleCodeChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return (
    <Box>
      <CodeMirror
        height={height}
        value={value}
        onChange={handleCodeChange}
        extensions={[
          javascript({ jsx: false }),
          javascriptLanguage.data.of({
            autocomplete: scopeCompletionSource(globalThis),
          }),
        ]}
      />
    </Box>
  );
};
