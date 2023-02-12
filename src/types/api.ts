import { User } from '@auth0/auth0-react';
import { SerializedError } from '@reduxjs/toolkit';

export type ApiError = {
  status: number;
  data: {
    message: string;
  } | null;
};

export type ApiResponse<DataType = {}> =
  | {
      data: DataType;
    }
  | {
      error: ApiError | SerializedError;
    };

export type Tool = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  components: Component[];
};

export type SmartContract = {
  chainId: number;
  address: string;
  abi: string;
  isProxy: boolean;
  logicAddress?: string;
  logicAbi?: string;
};

export enum ResourceType {
  SmartContract = 'smartContract',
  Dune = 'dune',
}

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  createdAt: string;
  updatedAt: string;
  numLinkedQueries: number;
  data: {
    smartContract?: SmartContract;
    dune?: {
      apiKey: string;
    };
  };
};

export enum ComponentType {
  Button = 'button',
  TextInput = 'textInput',
  NumberInput = 'numberInput',
  Table = 'table',
  Text = 'text',
}

export type ComponentData = {
  [ComponentType.Button]?: {
    text: string;
    disabled: string;
    loading: string;
  };
  [ComponentType.TextInput]?: {
    defaultValue: string;
    placeholder: string;
    label: string;
    disabled: string;
    required: string;
    minLength: string;
    maxLength: string;
  };
  [ComponentType.NumberInput]?: {
    defaultValue: string;
    placeholder: string;
    label: string;
    disabled: string;
    required: string;
    minimum: string;
    maximum: string;
  };
  [ComponentType.Text]?: {
    value: string;
    horizontalAlignment: 'left' | 'center' | 'right';
  };
  [ComponentType.Table]?: {
    data: string;
    emptyMessage: string;
    multiselect: string;
    // NOTE: Currently only using this for testing
    columnHeaderNames: Record<string, string>;
    columnHeadersByIndex: string[];
  };
};

export type Component = {
  name: string;
  type: ComponentType;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  data: ComponentData;
};
