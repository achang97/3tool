import { Action, ActionType, TransformableData } from '@app/types';

type ActionDataJavascriptFlags<T extends ActionType> = {
  [KeyType in keyof NonNullable<Action['data'][T]>]: boolean;
};
type ActionDataJavascriptFlagsMap = {
  [KeyType in ActionType]: ActionDataJavascriptFlags<KeyType>;
};

const TRANSFORMER_DATA_JAVASCRIPT_FLAGS: {
  [KeyType in keyof TransformableData]: boolean;
} = {
  transformer: true,
};

const JAVASCRIPT_DATA_JAVASCRIPT_FLAGS: ActionDataJavascriptFlags<ActionType.Javascript> =
  {
    ...TRANSFORMER_DATA_JAVASCRIPT_FLAGS,
    code: true,
  };

const SMART_CONTRACT_READ_DATA_JAVASCRIPT_FLAGS:
  ActionDataJavascriptFlags<ActionType.SmartContractRead> =
  {
    ...TRANSFORMER_DATA_JAVASCRIPT_FLAGS,
    resourceId: false,
  };

const SMART_CONTRACT_WRITE_DATA_JAVASCRIPT_FLAGS:
  ActionDataJavascriptFlags<ActionType.SmartContractWrite> =
  {
    ...TRANSFORMER_DATA_JAVASCRIPT_FLAGS,
    resourceId: false,
  };

export const ACTION_DATA_JAVASCRIPT_FLAGS: ActionDataJavascriptFlagsMap = {
  [ActionType.Javascript]: JAVASCRIPT_DATA_JAVASCRIPT_FLAGS,
  [ActionType.SmartContractRead]: SMART_CONTRACT_READ_DATA_JAVASCRIPT_FLAGS,
  [ActionType.SmartContractWrite]: SMART_CONTRACT_WRITE_DATA_JAVASCRIPT_FLAGS,
};
