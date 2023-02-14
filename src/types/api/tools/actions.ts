import { EventHandler } from './eventHandlers';

export enum ActionType {
  JavaScript = 'javaScript',
  SmartContractRead = 'smartContractRead',
  SmartContractWrite = 'smartContractWrite',
}

export enum ActionEvent {
  Success = 'success',
  Error = 'error',
}

type JavaScriptData = {
  code: string;
};

type SmartContractBaseData = {
  resourceId: string;
};

export type SmartContractReadData = SmartContractBaseData;
export type SmartContractWriteData = SmartContractBaseData;

export type Action = {
  type: ActionType;
  eventHandlers: EventHandler<ActionEvent>[];
  data: {
    [ActionType.JavaScript]?: JavaScriptData;
    [ActionType.SmartContractRead]?: SmartContractReadData;
    [ActionType.SmartContractWrite]?: SmartContractWriteData;
  };
};
