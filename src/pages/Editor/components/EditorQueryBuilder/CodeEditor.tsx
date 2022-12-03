import React, { memo, useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Box, Button } from '@mui/material';

type CodeEditorProps = {
  height?: string;
};

export const CodeEditor = memo(({ height = '200px' }: CodeEditorProps) => {
  const [value, setValue] = useState("console.log('hello world!');");

  const handleCodeChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const handleExecuteClick = useCallback(() => {
    // eslint-disable-next-line no-eval
    eval(value);
  }, [value]);

  return (
    <Box>
      <CodeMirror
        value={value}
        height={height}
        extensions={[javascript({ jsx: false })]}
        onChange={handleCodeChange}
      />
      <Button onClick={handleExecuteClick}>Execute</Button>
    </Box>
  );
});
