import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { LoopableData } from '@app/types';
import { useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import { LightbulbCircle } from '@mui/icons-material';
import { EditorSection } from '../../common/EditorSection';

type LoopSectionProps = {
  data?: LoopableData;
  onDataChange: (update: RecursivePartial<LoopableData>) => void;
};

export const LoopSection = ({ data, onDataChange }: LoopSectionProps) => {
  const handleLoopElementsChange = useCallback(
    (loopElements: string) => {
      onDataChange({ loopElements });
    },
    [onDataChange]
  );

  const handleLoopEnabledChange = useCallback(
    (loopEnabled: boolean) => {
      onDataChange({ loopEnabled });
    },
    [onDataChange]
  );

  return (
    <EditorSection
      isEnabledToggleable
      isEnabled={data?.loopEnabled}
      onToggleEnabled={handleLoopEnabledChange}
      title="Loop"
      tooltip="Use {{ element }} anywhere in this action to reference the current value that is being looped over."
      testId="loop-section"
    >
      <CodeMirror
        value={data?.loopElements}
        placeholder="return []"
        onChange={handleLoopElementsChange}
        language="javascript"
        showLineNumbers
        testId="loop-code"
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ backgroundColor: 'primary.light', borderRadius: 1, padding: 1, alignItems: 'center' }}
      >
        <LightbulbCircle color="primary" />
        <Typography
          variant="body2"
          sx={{ color: 'primary.main' }}
          data-testid="loop-section-helper-text"
        >
          Use the code block above to return an array of data objects. Then, use
          <Typography component="span" variant="body2" sx={{ color: 'primary.dark' }}>
            {' {{ element }} '}
          </Typography>
          anywhere in this action to reference the current value that is being looped over.
        </Typography>
      </Stack>
    </EditorSection>
  );
};
