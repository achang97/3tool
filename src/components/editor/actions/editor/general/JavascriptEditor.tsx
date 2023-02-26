import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { BaseActionEditorProps } from '@app/types';
import { Box } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { Transformer } from './Transformer';

export const JavascriptEditor = ({
  data,
  onUpdateData,
}: BaseActionEditorProps) => {
  const javascriptData = useMemo(() => {
    return data.javascript;
  }, [data.javascript]);

  const handleCodeChange = useCallback(
    (code: string) => {
      onUpdateData({ code });
    },
    [onUpdateData]
  );

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      data-testid="javascript-editor"
    >
      <CodeMirror
        label="JS Code (JavaScript)"
        value={javascriptData?.code}
        onChange={handleCodeChange}
        language="javascript"
        showLineNumbers
      />
      <Transformer
        value={javascriptData?.transformer}
        onUpdateData={onUpdateData}
      />
    </Box>
  );
};
