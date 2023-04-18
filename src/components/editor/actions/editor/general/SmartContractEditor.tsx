import { ActionType, BaseActionEditorProps, SmartContractBaseData } from '@app/types';
import { Stack } from '@mui/material';
import { LoopEvalArgsProvider } from '@app/components/editor/contexts/LoopEvalArgsProvider';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { updateFocusedAction, updateFocusedActionState } from '@app/redux/features/editorSlice';
import { useActionSmartContractUpdate } from '@app/components/editor/hooks/useActionSmartContractUpdate';
import { EditorSection } from '../common/EditorSection';
import { SmartContractResourceEditor } from './smartContract/SmartContractResourceEditor';
import { SmartContractFunctionEditor } from './smartContract/SmartContractFunctionEditor';
import { TransformerSection } from './sections/TransformerSection';
import { LoopSection } from './sections/LoopSection';

type SmartContractEditorProps =
  | BaseActionEditorProps<ActionType.SmartContractRead>
  | BaseActionEditorProps<ActionType.SmartContractWrite>;

export const SmartContractEditor = ({ type, data, onDataChange }: SmartContractEditorProps) => {
  const { focusedActionState } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const extendSmartContractUpdate = useActionSmartContractUpdate({ data });

  const handleActiveFunctionIndexChange = useCallback(
    (index: number) => {
      dispatch(updateFocusedActionState({ smartContractFunctionIndex: index }));
    },
    [dispatch]
  );

  const handleBaseSmartContractUpdate = useCallback(
    (update: RecursivePartial<SmartContractBaseData>) => {
      const { update: extendedUpdate, hasResetFunctions } = extendSmartContractUpdate(update);
      if (!extendedUpdate) {
        return;
      }
      if (hasResetFunctions) {
        handleActiveFunctionIndexChange(0);
      }
      dispatch(
        updateFocusedAction({
          data: {
            smartContractRead: extendedUpdate,
            smartContractWrite: extendedUpdate,
          },
        })
      );
    },
    [dispatch, extendSmartContractUpdate, handleActiveFunctionIndexChange]
  );

  return (
    <Stack spacing={1} data-testid="smart-contract-editor">
      <LoopSection data={data} onDataChange={handleBaseSmartContractUpdate} />
      <LoopEvalArgsProvider data={data}>
        <EditorSection title="Resource">
          <SmartContractResourceEditor data={data} onDataChange={handleBaseSmartContractUpdate} />
        </EditorSection>
        <EditorSection title="Function">
          <SmartContractFunctionEditor
            type={type}
            data={data}
            onDataChange={onDataChange}
            activeFunctionIndex={focusedActionState.smartContractFunctionIndex}
            onActiveFunctionIndexChange={handleActiveFunctionIndexChange}
          />
        </EditorSection>
      </LoopEvalArgsProvider>
      <TransformerSection data={data} onDataChange={handleBaseSmartContractUpdate} />
    </Stack>
  );
};
