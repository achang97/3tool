import { EventHandler } from './eventHandlers';

export enum ActionType {
  Javascript = 'javascript',
  SmartContractRead = 'smartContractRead',
  SmartContractWrite = 'smartContractWrite',
}

export enum ActionEvent {
  Success = 'success',
  Error = 'error',
}

type JavascriptData = {
  code: string;
};

type SmartContractBaseData = {
  resourceId: string;
};

export type SmartContractReadData = SmartContractBaseData;
export type SmartContractWriteData = SmartContractBaseData;

export type Action = {
  name: string;
  type: ActionType;
  eventHandlers: EventHandler<ActionEvent>[];
  data: {
    [ActionType.Javascript]?: JavascriptData;
    [ActionType.SmartContractRead]?: SmartContractReadData;
    [ActionType.SmartContractWrite]?: SmartContractWriteData;
  };
};
