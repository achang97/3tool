import { InspectorTextField } from '@app/components/editor/common/InspectorTextField';
import { SmartContractBaseDataFunction } from '@app/types';
import { SmartContractAbiFunction, getAbiFieldType } from '@app/utils/abi';
import { Box } from '@mui/material';
import { AbiType } from 'abitype';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';

type SmartContractFunctionInputsProps = {
  abiFunctions: SmartContractAbiFunction[];
  activeFunction: SmartContractBaseDataFunction;
  onActiveFunctionChange: (update: RecursivePartial<SmartContractBaseDataFunction>) => void;
};

export const SmartContractFunctionInputs = ({
  abiFunctions,
  activeFunction,
  onActiveFunctionChange,
}: SmartContractFunctionInputsProps) => {
  const functionAbi = useMemo(() => {
    return abiFunctions.find((func) => func.name === activeFunction.name);
  }, [abiFunctions, activeFunction.name]);

  const handleInputChange = useCallback(
    (newInput: string, index: number) => {
      const newArgs = _.cloneDeep(activeFunction.args);
      newArgs[index] = newInput;
      onActiveFunctionChange({ args: newArgs });
    },
    [activeFunction.args, onActiveFunctionChange]
  );

  const handlePayableAmountChange = useCallback(
    (payableAmount: string) => {
      onActiveFunctionChange({ payableAmount });
    },
    [onActiveFunctionChange]
  );

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      data-testid="smart-contract-function-inputs"
    >
      {functionAbi?.inputs?.map((input, i) => (
        <InspectorTextField
          key={input.name}
          label={`${input.name || 'N/A'} (${input.type})`}
          type={getAbiFieldType(input.type as AbiType)}
          value={activeFunction?.args[i]}
          onChange={(newInput) => handleInputChange(newInput, i)}
        />
      ))}
      {functionAbi?.stateMutability === 'payable' && (
        <InspectorTextField
          label="payableAmount (ETH)"
          type="number"
          value={activeFunction?.payableAmount}
          onChange={handlePayableAmountChange}
        />
      )}
    </Box>
  );
};
