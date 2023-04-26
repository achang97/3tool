import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { LoopableData } from '@app/types';
import { useCallback } from 'react';
import { Alert, Typography, styled } from '@mui/material';
import { LightbulbCircle } from '@mui/icons-material';
import { useLocalEvalArgs } from '@app/components/editor/hooks/useLocalEvalArgs';
import { EditorSection } from '../../common/EditorSection';

type LoopSectionProps = {
  data?: LoopableData;
  onDataChange: (update: RecursivePartial<LoopableData>) => void;
};

const StyledAlert = styled(Alert)();
StyledAlert.defaultProps = {
  sx: { paddingY: 0 },
};

export const LoopSection = ({ data, onDataChange }: LoopSectionProps) => {
  // NOTE: The LoopSection component must be used within a LoopEvalArgsProvider
  const { error } = useLocalEvalArgs();

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
        testId="loop-section-code"
        hasError={!!error}
      />
      {error && <StyledAlert severity="error">{error}</StyledAlert>}
      <StyledAlert severity="info" icon={<LightbulbCircle />}>
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
      </StyledAlert>
    </EditorSection>
  );
};
