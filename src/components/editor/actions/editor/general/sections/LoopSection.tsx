import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { LoopableData } from '@app/types';
import { useCallback } from 'react';
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
    </EditorSection>
  );
};
