import {
  Action,
  ActionType,
  LoopableData,
  SmartContractBaseData,
  TransformableData,
} from '@app/types';

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
  transformerEnabled: false,
};

const LOOPABLE_DATA_JAVASCRIPT_FLAGS: {
  [KeyType in keyof LoopableData]: boolean;
} = {
  loopElements: true,
  loopEnabled: false,
};

const SMART_CONTRACT_BASE_DATA_JAVASCRIPT_FLAGS: {
  [KeyType in keyof SmartContractBaseData]: boolean;
} = {
  ...TRANSFORMER_DATA_JAVASCRIPT_FLAGS,
  ...LOOPABLE_DATA_JAVASCRIPT_FLAGS,
  smartContractId: false,
  freeform: false,
  freeformAddress: false,
  freeformAbiId: false,
  freeformChainId: false,
  functions: false,
};

const JAVASCRIPT_DATA_JAVASCRIPT_FLAGS: ActionDataJavascriptFlags<ActionType.Javascript> = {
  ...TRANSFORMER_DATA_JAVASCRIPT_FLAGS,
  code: true,
};

const SMART_CONTRACT_READ_DATA_JAVASCRIPT_FLAGS: ActionDataJavascriptFlags<ActionType.SmartContractRead> =
  {
    ...SMART_CONTRACT_BASE_DATA_JAVASCRIPT_FLAGS,
  };

const SMART_CONTRACT_WRITE_DATA_JAVASCRIPT_FLAGS: ActionDataJavascriptFlags<ActionType.SmartContractWrite> =
  {
    ...SMART_CONTRACT_BASE_DATA_JAVASCRIPT_FLAGS,
  };

export const ACTION_DATA_JAVASCRIPT_FLAGS: ActionDataJavascriptFlagsMap = {
  [ActionType.Javascript]: JAVASCRIPT_DATA_JAVASCRIPT_FLAGS,
  [ActionType.SmartContractRead]: SMART_CONTRACT_READ_DATA_JAVASCRIPT_FLAGS,
  [ActionType.SmartContractWrite]: SMART_CONTRACT_WRITE_DATA_JAVASCRIPT_FLAGS,
};
