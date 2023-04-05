import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { TransformableData } from '@app/types';
import { useCallback } from 'react';

type TransformerProps = {
  value?: string;
  onDataChange: (update: RecursivePartial<TransformableData>) => void;
};

export const Transformer = ({ value, onDataChange }: TransformerProps) => {
  const handleTransformerChange = useCallback(
    (transformer: string) => {
      onDataChange({ transformer });
    },
    [onDataChange]
  );

  return (
    <CodeMirror
      label="Transformer (JavaScript)"
      value={value}
      placeholder="return formatDataAsArray(data).filter(row => row.quantity > 20)"
      onChange={handleTransformerChange}
      language="javascript"
      showLineNumbers
    />
  );
};
