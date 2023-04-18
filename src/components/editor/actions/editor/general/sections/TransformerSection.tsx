import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { TransformableData } from '@app/types';
import { useCallback } from 'react';
import { EditorSection } from '../../common/EditorSection';

type TransformerSectionProps = {
  data?: TransformableData;
  onDataChange: (update: RecursivePartial<TransformableData>) => void;
};

export const TransformerSection = ({ data, onDataChange }: TransformerSectionProps) => {
  const handleTransformerChange = useCallback(
    (transformer: string) => {
      onDataChange({ transformer });
    },
    [onDataChange]
  );

  const handleTransformerEnabledChange = useCallback(
    (transformerEnabled: boolean) => {
      onDataChange({ transformerEnabled });
    },
    [onDataChange]
  );

  return (
    <EditorSection
      title="Transformer"
      isEnabledToggleable
      isEnabled={data?.transformerEnabled}
      onToggleEnabled={handleTransformerEnabledChange}
      testId="transformer-section"
    >
      <CodeMirror
        value={data?.transformer}
        placeholder="return formatDataAsArray(data).filter(row => row.quantity > 20)"
        onChange={handleTransformerChange}
        language="javascript"
        showLineNumbers
        testId="transformer-section-code"
      />
    </EditorSection>
  );
};
