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

export type TransformableData<T = {}> = {
  transformer: string;
} & T;

type JavascriptData = TransformableData<{
  code: string;
}>;

type SmartContractBaseData = TransformableData<{
  smartContractId: string;
}>;

type SmartContractReadData = SmartContractBaseData;
type SmartContractWriteData = SmartContractBaseData;

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
