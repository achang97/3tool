import {
  Action,
  ActionType,
  LoopableData,
  SmartContractBaseData,
  SmartContractBaseDataFunction,
  TransformableData,
} from '@app/types';

type ActionDataTemplates = {
  [KeyType in ActionType]: NonNullable<Action['data'][KeyType]>;
};

const TRANSFORMABLE_DATA_TEMPLATE: TransformableData = {
  transformer: `
// insert your code here
// example: return formatDataAsArray(data).filter(row => row.quantity > 20)
return data
`.trim(),
  transformerEnabled: false,
};

const LOOPABLE_DATA_TEMPLATE: LoopableData = {
  loopElements: `
// insert your code here
return [];
  `.trim(),
  loopEnabled: false,
};

export const SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE: SmartContractBaseDataFunction = {
  name: '',
  args: [],
  payableAmount: '',
};

const SMART_CONTRACT_BASE_DATA_TEMPLATE: SmartContractBaseData = {
  ...TRANSFORMABLE_DATA_TEMPLATE,
  ...LOOPABLE_DATA_TEMPLATE,
  smartContractId: '',
  freeform: false,
  freeformAddress: '',
  freeformAbiId: '',
  freeformChainId: '',
  functions: [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE],
};

export const ACTION_DATA_TEMPLATES: ActionDataTemplates = {
  [ActionType.Javascript]: {
    ...TRANSFORMABLE_DATA_TEMPLATE,
    code: '',
  },
  [ActionType.SmartContractRead]: {
    ...SMART_CONTRACT_BASE_DATA_TEMPLATE,
  },
  [ActionType.SmartContractWrite]: {
    ...SMART_CONTRACT_BASE_DATA_TEMPLATE,
  },
};
