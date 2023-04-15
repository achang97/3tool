import { ActionType, BaseActionEditorProps, SmartContractBaseDataFunction } from '@app/types';
import { Box, Stack } from '@mui/material';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { filterAbiFunctions } from '@app/utils/abi';
import { useActionSmartContract } from '@app/components/editor/hooks/useActionSmartContract';
import { SmartContractFunctionInputs } from './SmartContractFunctionInputs';
import { SmartContractFunctionSelect } from './SmartContractFunctionSelect';
import { SmartContractFunctionTabs } from './SmartContractFunctionTabs';

type SmartContractFunctionEditorProps = (
  | BaseActionEditorProps<ActionType.SmartContractRead>
  | BaseActionEditorProps<ActionType.SmartContractWrite>
) & {
  activeFunctionIndex: number;
  onActiveFunctionIndexChange: (newIndex: number) => void;
};

export const SmartContractFunctionEditor = ({
  type,
  data,
  activeFunctionIndex,
  onActiveFunctionIndexChange,
  onDataChange,
}: SmartContractFunctionEditorProps) => {
  const getSmartContractData = useActionSmartContract();

  const abiFunctions = useMemo(() => {
    if (!data) {
      return [];
    }
    // NOTE: Since the ABI is always static, we do not need to provide the local eval args
    // as a second argument (as variables like {{ element }} are unused). This will change
    // if we make ABI a dynamically evaluated field like address and chain id.
    const { abi } = getSmartContractData(data);
    const filterType = type === ActionType.SmartContractRead ? 'read' : 'write';
    return filterAbiFunctions(abi, filterType);
  }, [data, getSmartContractData, type]);

  const activeFunction = useMemo(() => {
    return data?.functions?.[activeFunctionIndex];
  }, [data?.functions, activeFunctionIndex]);

  const handleUpdateActiveFunction = useCallback(
    (update: RecursivePartial<SmartContractBaseDataFunction>) => {
      const updatedFunctions = _.cloneDeep(data?.functions ?? []);
      _.merge(updatedFunctions[activeFunctionIndex], update);
      onDataChange({ functions: updatedFunctions });
    },
    [data?.functions, activeFunctionIndex, onDataChange]
  );

  return (
    <Box data-testid="smart-contract-function-editor">
      {type === ActionType.SmartContractRead && (
        <SmartContractFunctionTabs
          functions={data?.functions}
          activeFunctionIndex={activeFunctionIndex}
          onActiveFunctionIndexChange={onActiveFunctionIndexChange}
          onDataChange={onDataChange}
        />
      )}
      {activeFunction && (
        <Stack spacing={1}>
          <SmartContractFunctionSelect
            type={type}
            abiFunctions={abiFunctions}
            activeFunction={activeFunction}
            onActiveFunctionChange={handleUpdateActiveFunction}
            onActiveFunctionIndexChange={onActiveFunctionIndexChange}
          />
          <SmartContractFunctionInputs
            abiFunctions={abiFunctions}
            activeFunction={activeFunction}
            onActiveFunctionChange={handleUpdateActiveFunction}
          />
        </Stack>
      )}
    </Box>
  );
};
