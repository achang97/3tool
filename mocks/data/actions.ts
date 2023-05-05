import { Action, ActionType } from '@app/types';

export const mockJavascriptAction: Action = {
  type: ActionType.Javascript,
  name: 'action1',
  data: {
    javascript: {
      transformerEnabled: true,
      transformer: 'return data',
      code: "alert('hello');",
    },
  },
  eventHandlers: [],
};

export const mockSmartContractReadAction1: Action = {
  type: ActionType.SmartContractRead,
  name: 'action2',
  data: {
    smartContractRead: {
      transformer:
        '// insert your code here\n// example: return formatDataAsArray(data).filter(row => row.quantity > 20)\nreturn data',
      transformerEnabled: false,
      loopElements: '// insert your code here\nreturn [];',
      loopEnabled: false,
      smartContractId: '2',
      freeform: false,
      freeformAddress: '',
      freeformAbiId: '',
      freeformChainId: '',
      functions: [
        {
          name: 'owner',
          args: [],
          payableAmount: '',
        },
      ],
    },
    smartContractWrite: {
      transformer:
        '// insert your code here\n// example: return formatDataAsArray(data).filter(row => row.quantity > 20)\nreturn data',
      transformerEnabled: false,
      loopElements: '// insert your code here\nreturn [];',
      loopEnabled: false,
      smartContractId: '2',
      freeform: false,
      freeformAddress: '',
      freeformAbiId: '',
      freeformChainId: '',
      functions: [
        {
          name: '',
          args: [],
          payableAmount: '',
        },
      ],
    },
  },
  eventHandlers: [],
};

export const mockSmartContractReadAction2: Action = {
  type: ActionType.SmartContractRead,
  name: 'action3',
  data: {
    smartContractRead: {
      transformer:
        '// insert your code here\n// example: return formatDataAsArray(data).filter(row => row.quantity > 20)\nreturn data',
      transformerEnabled: false,
      loopElements: '// insert your code here\nreturn [];',
      loopEnabled: false,
      smartContractId: '',
      freeform: false,
      freeformAddress: '',
      freeformAbiId: '',
      freeformChainId: '',
      functions: [
        {
          name: '',
          args: [],
          payableAmount: '',
        },
      ],
    },
    smartContractWrite: {
      transformer:
        '// insert your code here\n// example: return formatDataAsArray(data).filter(row => row.quantity > 20)\nreturn data',
      transformerEnabled: false,
      loopElements: '// insert your code here\nreturn [];',
      loopEnabled: false,
      smartContractId: '',
      freeform: false,
      freeformAddress: '',
      freeformAbiId: '',
      freeformChainId: '',
      functions: [
        {
          name: '',
          args: [],
          payableAmount: '',
        },
      ],
    },
  },
  eventHandlers: [],
};
