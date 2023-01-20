import { User } from '@auth0/auth0-react';
import { SerializedError } from '@reduxjs/toolkit';

export type ApiError = {
  status: number;
  data: {
    message: string;
  } | null;
};

export type ApiResponse<T> =
  | {
      data: T;
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
  metadata: {
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
  Select = 'select',
  Container = 'container',
  Table = 'table',
  Text = 'text',
}

export type Component = {
  name: string;
  type: ComponentType;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  metadata: {
    // container?: {
    //   layout: {
    //     showHeader: boolean;
    //     showFooter: boolean;
    //     height: 'auto' | 'fixed';
    //   };
    //   components: Component[];
    // };
    // table?: {
    //   data: {
    //     data: string;
    //   };
    //   columns: {
    //     title: string;
    //     hidden: string;
    //     editable: boolean;
    //   }[];
    //   rowSelection: {
    //     multiselect: string;
    //   };
    //   layout: {
    //     maxPageSize: string;
    //   };
    // };
    // textInput?: {
    //   basic: {
    //     defaultValue: string;
    //     placeholder: string;
    //   };
    //   label: {
    //     label: string;
    //   };
    //   interaction: {
    //     disabled: string;
    //   };
    //   validation: {
    //     required: string;
    //     minLength: string;
    //     maxLength: string;
    //     pattern: 'email' | 'regex' | 'url';
    //     regex: string;
    //   };
    // };
    // numberInput?: {
    //   basic: {
    //     defaultValue: string;
    //     placeholder: string;
    //     format: 'standard' | 'currency' | 'percentage';
    //     currencyCode: string;
    //     minimum: string;
    //     maximum: string;
    //   };
    //   label: {
    //     label: string;
    //   };
    //   interaction: {
    //     disabled: string;
    //   };
    //   validation: {
    //     required: string;
    //   };
    // };
    // select?: {
    //   options: {
    //     data: {
    //       manual: {
    //         label: string;
    //         value: string;
    //         disabled: string;
    //         hidden: string;
    //       }[];
    //       mapped: {
    //         dataSource: string;
    //         label: string;
    //         value: string;
    //         disabled: string;
    //         hidden: string;
    //       };
    //     };
    //     label: {
    //       label: string;
    //     };
    //     interaction: {
    //       disabled: string;
    //     };
    //     validation: {
    //       required: string;
    //     };
    //   };
    // };
    // text?: {
    //   basic: {
    //     value: string;
    //   };
    //   layout: {
    //     alignmentHorizontal: 'start' | 'center' | 'end';
    //     alignmentVertical: 'start' | 'center' | 'end';
    //     height: 'auto' | 'fixed';
    //     overflow: 'scroll' | 'hidden';
    //   };
    // };
    button?: {
      basic: {
        text: string;
      };
      interaction: {
        disabled?: string;
        loading?: string;
      };
    };
  };
};
