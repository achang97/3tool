import { Action, ActionType, FieldType, TransformableData } from '@app/types';

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
};

const JAVASCRIPT_DATA_TYPES: ActionDataType<ActionType.Javascript> = {
  ...TRANSFORMABLE_DATA_TYPES,
  code: 'string',
};

const SMART_CONTRACT_READ_DATA_TYPES: ActionDataType<ActionType.SmartContractRead> = {
  ...TRANSFORMABLE_DATA_TYPES,
  smartContractId: 'string',
};

const SMART_CONTRACT_WRITE_DATA_TYPES: ActionDataType<ActionType.SmartContractWrite> = {
  ...TRANSFORMABLE_DATA_TYPES,
  smartContractId: 'string',
};

export const ACTION_DATA_TYPES: ActionDataTypes = {
  [ActionType.Javascript]: JAVASCRIPT_DATA_TYPES,
  [ActionType.SmartContractRead]: SMART_CONTRACT_READ_DATA_TYPES,
  [ActionType.SmartContractWrite]: SMART_CONTRACT_WRITE_DATA_TYPES,
};
