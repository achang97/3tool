import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { ActionType, BaseActionEditorProps } from '@app/types';
import { Box } from '@mui/material';
import { useCallback } from 'react';
import { EditorSection } from '../common/EditorSection';
import { TransformerSection } from './sections/TransformerSection';

export const JavascriptEditor = ({
  data,
  onDataChange,
}: BaseActionEditorProps<ActionType.Javascript>) => {
  const handleCodeChange = useCallback(
    (code: string) => {
      onDataChange({ code });
    },
    [onDataChange]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} data-testid="javascript-editor">
      <EditorSection title="JS Code">
        <CodeMirror
          value={data?.code}
          onChange={handleCodeChange}
          language="javascript"
          testId="javascript-editor-js-code"
          showLineNumbers
        />
      </EditorSection>
      <TransformerSection data={data} onDataChange={onDataChange} />
    </Box>
  );
};
