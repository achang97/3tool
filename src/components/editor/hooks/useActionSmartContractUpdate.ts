import { SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE } from '@app/constants';
import { SmartContractBaseData } from '@app/types';
import _ from 'lodash';
import { useCallback } from 'react';

type HookArgs = {
  data: SmartContractBaseData | undefined;
};

export const useActionSmartContractUpdate = ({ data }: HookArgs) => {
  const extendUpdate = useCallback(
    (
      update: RecursivePartial<SmartContractBaseData>
    ): {
      update?: RecursivePartial<SmartContractBaseData>;
      hasResetFunctions: boolean;
    } => {
      const isAbiChange = update.freeform || update.freeformAbiId || update.smartContractId;
      const hasFunctionData = !_.isEqual(data?.functions, [
        SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE,
      ]);

      if (!isAbiChange || !hasFunctionData) {
        return { update, hasResetFunctions: false };
      }

      // eslint-disable-next-line no-alert
      const hasConfirmed = window.confirm(
        'This will update the ABI and reset all functions. Are you sure you want to make this change?'
      );
      if (!hasConfirmed) {
        return { update: undefined, hasResetFunctions: false };
      }

      update.functions = [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE];
      return { update, hasResetFunctions: true };
    },
    [data?.functions]
  );

  return extendUpdate;
};
