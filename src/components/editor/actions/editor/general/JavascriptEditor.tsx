import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { ActionType, BaseActionEditorProps } from '@app/types';
import { Box } from '@mui/material';
import { useCallback } from 'react';
import { Transformer } from './Transformer';

export const JavascriptEditor = ({
  data,
  onUpdateData,
}: BaseActionEditorProps<ActionType.Javascript>) => {
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
        value={data?.code}
        onChange={handleCodeChange}
        language="javascript"
        showLineNumbers
      />
      <Transformer value={data?.transformer} onUpdateData={onUpdateData} />
    </Box>
  );
};
