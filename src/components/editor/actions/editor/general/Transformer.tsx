import { CodeMirror } from '@app/components/editor/common/CodeMirror';
import { TransformableData } from '@app/types';
import { useCallback } from 'react';

type TransformerProps = {
  value?: string;
  onChangeData: (update: RecursivePartial<TransformableData>) => void;
};

export const Transformer = ({ value, onChangeData }: TransformerProps) => {
  const handleTransformerChange = useCallback(
    (transformer: string) => {
      onChangeData({ transformer });
    },
    [onChangeData]
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
