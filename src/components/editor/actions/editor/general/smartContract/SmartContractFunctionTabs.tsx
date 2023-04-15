import { SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE } from '@app/constants';
import { SmartContractBaseData, SmartContractBaseDataFunction } from '@app/types';
import { Add, Close } from '@mui/icons-material';
import { Button, IconButton, Stack, Tab, Tabs } from '@mui/material';
import _ from 'lodash';
import { SyntheticEvent, useCallback } from 'react';

type SmartContractFunctionTabsProps = {
  functions?: SmartContractBaseDataFunction[];
  activeFunctionIndex: number;
  onActiveFunctionIndexChange: (newIndex: number) => void;
  onDataChange: (update: RecursivePartial<SmartContractBaseData>) => void;
};

export const SmartContractFunctionTabs = ({
  functions = [],
  activeFunctionIndex,
  onActiveFunctionIndexChange,
  onDataChange,
}: SmartContractFunctionTabsProps) => {
  const handleFunctionTabChange = useCallback(
    (_e: SyntheticEvent, index: number) => {
      onActiveFunctionIndexChange(index);
    },
    [onActiveFunctionIndexChange]
  );

  const handleFunctionAdd = useCallback(() => {
    const newFunctions = [...functions, _.cloneDeep(SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE)];
    onDataChange({ functions: newFunctions });
    onActiveFunctionIndexChange(newFunctions.length - 1);
  }, [functions, onActiveFunctionIndexChange, onDataChange]);

  const handleFunctionDelete = useCallback(
    (removeIndex: number) => {
      const newFunctions = [...functions];
      newFunctions.splice(removeIndex, 1);
      onDataChange({ functions: newFunctions });

      if (removeIndex === activeFunctionIndex) {
        onActiveFunctionIndexChange(0);
      } else if (removeIndex < activeFunctionIndex) {
        onActiveFunctionIndexChange(activeFunctionIndex - 1);
      }
    },
    [functions, activeFunctionIndex, onDataChange, onActiveFunctionIndexChange]
  );

  const renderFunctionTab = useCallback(
    (func: SmartContractBaseDataFunction, index: number) => {
      const label = func.name || `function${index + 1}`;
      return (
        <Tab
          key={`${label}-${index}`}
          label={label}
          value={index}
          sx={{ minHeight: 0, paddingTop: 0, paddingBottom: 1, paddingRight: 0 }}
          icon={
            <IconButton
              size="small"
              sx={{ fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleFunctionDelete(index);
              }}
            >
              <Close fontSize="inherit" data-testid="smart-contract-function-tabs-delete" />
            </IconButton>
          }
          iconPosition="end"
        />
      );
    },
    [handleFunctionDelete]
  );

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: 'flex-end', alignItems: 'center', marginBottom: 0.25, minWidth: 0 }}
      data-testid="smart-contract-function-tabs"
    >
      {functions.length > 1 && (
        <Tabs
          value={activeFunctionIndex}
          onChange={handleFunctionTabChange}
          variant="scrollable"
          sx={{ minHeight: 0, flex: 1 }}
        >
          {functions.map(renderFunctionTab)}
        </Tabs>
      )}
      <Button size="small" variant="text" startIcon={<Add />} onClick={handleFunctionAdd}>
        Add function
      </Button>
    </Stack>
  );
};
