import {
  Action,
  ActionType,
  FieldType,
  LoopableData,
  SmartContractBaseData,
  TransformableData,
} from '@app/types';

type ActionDataType<T extends ActionType> = {
  [KeyType in keyof NonNullable<Action['data'][T]>]: FieldType;
};
type ActionDataTypes = {
  [KeyType in ActionType]: ActionDataType<KeyType>;
};

const TRANSFORMABLE_DATA_TYPES: {
  [KeyType in keyof TransformableData]: FieldType;
} = {
  transformer: 'string',
  transformerEnabled: 'boolean',
};

const LOOPABLE_DATA_TYPES: {
  [KeyType in keyof LoopableData]: FieldType;
} = {
  loopElements: 'string',
  loopEnabled: 'boolean',
};

const SMART_CONTRACT_BASE_DATA_TYPES: {
  [KeyType in keyof SmartContractBaseData]: FieldType;
} = {
  ...TRANSFORMABLE_DATA_TYPES,
  ...LOOPABLE_DATA_TYPES,
  smartContractId: 'string',
  freeform: 'boolean',
  freeformAddress: 'string',
  freeformAbiId: 'string',
  freeformChainId: 'number',
  functions: 'nested',
};

const JAVASCRIPT_DATA_TYPES: ActionDataType<ActionType.Javascript> = {
  ...TRANSFORMABLE_DATA_TYPES,
  code: 'string',
};

const SMART_CONTRACT_READ_DATA_TYPES: ActionDataType<ActionType.SmartContractRead> = {
  ...SMART_CONTRACT_BASE_DATA_TYPES,
};

const SMART_CONTRACT_WRITE_DATA_TYPES: ActionDataType<ActionType.SmartContractWrite> = {
  ...SMART_CONTRACT_BASE_DATA_TYPES,
};

export const ACTION_DATA_TYPES: ActionDataTypes = {
  [ActionType.Javascript]: JAVASCRIPT_DATA_TYPES,
  [ActionType.SmartContractRead]: SMART_CONTRACT_READ_DATA_TYPES,
  [ActionType.SmartContractWrite]: SMART_CONTRACT_WRITE_DATA_TYPES,
};
