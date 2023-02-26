import { Action, ActionType, TransformableData } from '@app/types';

type ActionDataTemplates = {
  [KeyType in ActionType]: NonNullable<Action['data'][KeyType]>;
};

const TRANSFORMABLE_DATA_TEMPLATE: TransformableData = {
  transformer: `
// type your code here
// example: return formatDataAsArray(data).filter(row => row.quantity > 20)
return data
`.trim(),
};

export const ACTION_DATA_TEMPLATES: ActionDataTemplates = {
  [ActionType.Javascript]: {
    ...TRANSFORMABLE_DATA_TEMPLATE,
    code: '',
  },
  [ActionType.SmartContractRead]: {
    ...TRANSFORMABLE_DATA_TEMPLATE,
    resourceId: '',
  },
  [ActionType.SmartContractWrite]: {
    ...TRANSFORMABLE_DATA_TEMPLATE,
    resourceId: '',
  },
};
