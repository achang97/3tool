import { useCallback } from 'react';
import { InspectorSelect } from '@app/components/editor/common/InspectorSelect';
import { useSmartContractResources } from '@app/components/resources/hooks/useSmartContractResources';
import { ToggleableInspectorField } from '@app/components/editor/common/ToggleableInspectorField';
import { InspectorTextField } from '@app/components/editor/common/InspectorTextField';
import { useAbiResources } from '@app/components/resources/hooks/useAbiResources';
import { SmartContractBaseData } from '@app/types';
import { ACTION_DATA_TYPES } from '@app/constants';
import { Box } from '@mui/material';

type SmartContractResourceEditorProps = {
  data: SmartContractBaseData | undefined;
  onDataChange: (update: RecursivePartial<SmartContractBaseData>) => void;
};

export const SmartContractResourceEditor = ({
  data,
  onDataChange,
}: SmartContractResourceEditorProps) => {
  const smartContractResources = useSmartContractResources();
  const abiResources = useAbiResources();

  const handleSmartContractChange = useCallback(
    (smartContract: string) => {
      const update: Partial<SmartContractBaseData> = data?.freeform
        ? { freeformAddress: smartContract }
        : {
            smartContractId: smartContract,
          };
      onDataChange(update);
    },
    [data?.freeform, onDataChange]
  );

  const handleFreeformChange = useCallback(
    (freeform: boolean) => {
      onDataChange({ freeform });
    },
    [onDataChange]
  );

  const handleFreeformChainIdChange = useCallback(
    (freeformChainId: string) => {
      onDataChange({ freeformChainId });
    },
    [onDataChange]
  );

  const handleFreeformAbiIdChange = useCallback(
    (freeformAbiId: string) => {
      onDataChange({ freeformAbiId });
    },
    [onDataChange]
  );

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      data-testid="smart-contract-resource-editor"
    >
      <ToggleableInspectorField
        dynamicType={ACTION_DATA_TYPES.smartContractRead.freeformAddress}
        isDynamic={data?.freeform}
        onIsDynamicToggle={handleFreeformChange}
        label="Smart contract"
        value={data?.freeform ? data?.freeformAddress : data?.smartContractId}
        onChange={handleSmartContractChange}
        testId="smart-contract-resource-editor-contract-select"
      >
        {(props) => (
          <InspectorSelect
            {...props}
            placeholder="Select smart contract"
            options={smartContractResources.map((smartContract) => ({
              label: `${smartContract.name} (${smartContract.data.smartContract?.address})`,
              value: smartContract._id,
            }))}
          />
        )}
      </ToggleableInspectorField>
      {data?.freeform && (
        <>
          <InspectorTextField
            label="Network"
            value={data?.freeformChainId}
            onChange={handleFreeformChainIdChange}
            type={ACTION_DATA_TYPES.smartContractRead.freeformChainId}
            placeholder="{{ chains.mainnet }}"
          />
          <InspectorSelect
            label="ABI"
            value={data?.freeformAbiId}
            onChange={handleFreeformAbiIdChange}
            placeholder="Select ABI"
            options={abiResources.map((abi) => ({
              label: abi.name,
              value: abi._id,
            }))}
          />
        </>
      )}
    </Box>
  );
};
