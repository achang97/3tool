import { InspectorEnumField } from '@app/components/editor/common/InspectorEnumField';
import { InspectorSelect } from '@app/components/editor/common/InspectorSelect';
import { updateFocusedAction } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { ActionType, SmartContractBaseDataFunction } from '@app/types';
import { SmartContractAbiFunction } from '@app/utils/abi';
import { Box } from '@mui/material';
import { useCallback } from 'react';

type SmartContractFunctionSelectProps = {
  type: ActionType;
  abiFunctions: SmartContractAbiFunction[];
  activeFunction: SmartContractBaseDataFunction;
  onActiveFunctionChange: (update: RecursivePartial<SmartContractBaseDataFunction>) => void;
  onActiveFunctionIndexChange: (index: number) => void;
};

export const SmartContractFunctionSelect = ({
  type,
  abiFunctions,
  activeFunction,
  onActiveFunctionChange,
  onActiveFunctionIndexChange,
}: SmartContractFunctionSelectProps) => {
  const dispatch = useAppDispatch();

  const handleUpdateType = useCallback(
    (newType: ActionType) => {
      dispatch(updateFocusedAction({ type: newType }));
      onActiveFunctionIndexChange(0);
    },
    [dispatch, onActiveFunctionIndexChange]
  );

  const handleSmartContractFunctionChange = useCallback(
    (functionName: string) => {
      const newFunction = abiFunctions.find((func) => func.name === functionName);
      const numArgs = newFunction?.inputs?.length ?? 0;

      onActiveFunctionChange({
        name: functionName,
        args: new Array(numArgs).fill(''),
        payableAmount: '',
      });
    },
    [onActiveFunctionChange, abiFunctions]
  );

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      data-testid="smart-contract-function-select"
    >
      <InspectorEnumField
        value={type}
        options={[
          { label: 'Read', value: ActionType.SmartContractRead },
          { label: 'Write', value: ActionType.SmartContractWrite },
        ]}
        onChange={handleUpdateType}
      />
      <InspectorSelect
        placeholder="Select function"
        disabled={abiFunctions.length === 0}
        onChange={handleSmartContractFunctionChange}
        value={activeFunction?.name}
        options={abiFunctions.map((func) => ({
          label: func.name,
          value: func.name,
        }))}
        inputProps={{
          'data-testid': 'smart-contract-function-select-function-select',
        }}
      />
    </Box>
  );
};
