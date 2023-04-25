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
  transformerEnabled: boolean;
} & T;

export type LoopableData<T = {}> = {
  loopElements: string;
  loopEnabled: boolean;
} & T;

type JavascriptData = TransformableData<{
  code: string;
}>;

export type SmartContractBaseDataFunction = {
  name: string;
  args: string[];
  payableAmount: string;
};

export type SmartContractBaseData = TransformableData<
  LoopableData<{
    smartContractId: string;
    freeform: boolean;
    freeformAddress: string;
    freeformChainId: string;
    freeformAbiId: string;
    functions: SmartContractBaseDataFunction[];
  }>
>;

type SmartContractReadData = SmartContractBaseData;
type SmartContractWriteData = SmartContractBaseData;

export type Action = {
  _id?: string;
  name: string;
  type: ActionType;
  eventHandlers: EventHandler<ActionEvent>[];
  data: {
    [ActionType.Javascript]?: JavascriptData;
    [ActionType.SmartContractRead]?: SmartContractReadData;
    [ActionType.SmartContractWrite]?: SmartContractWriteData;
  };
};
