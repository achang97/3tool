import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { ComponentType, Resource, ResourceType, Tool } from '@app/types';

export const mockValidAddresses = [
  '0xf33Cb58287017175CADf990c9e4733823704aA86',
  '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
];
export const mockValidAddress = mockValidAddresses[0];

export const mockSmartContractResource: Resource = {
  id: '1',
  type: ResourceType.SmartContract,
  name: 'Staking Pool Contract',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  numLinkedQueries: 3,
  data: {
    smartContract: {
      chainId: 5,
      address: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
      abi: '[{"inputs":[{"internalType":"address","name":"contractLogic","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"}]',
      isProxy: false,
    },
  },
};

export const mockProxySmartContractResource: Resource = {
  type: ResourceType.SmartContract,
  name: 'Name',
  id: '2',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  numLinkedQueries: 0,
  data: {
    smartContract: {
      chainId: 5,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
      abi: '[{ stateMutability: "payable", type: "fallback" }]',
      isProxy: true,
      logicAddress: '0x73F165E0013a1BfA645f7d867E9cA87d03cDb598',
      logicAbi:
        '[{ stateMutability: "payable", inputs: [], type: "function" }]',
    },
  },
};

export const mockDuneResource: Resource = {
  id: '3',
  type: ResourceType.Dune,
  name: 'Dune API',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  numLinkedQueries: 4,
  data: {},
};

export const mockTool: Tool = {
  id: 'test',
  name: 'Tool',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creatorUser: {
    name: 'Andrew',
  },
  components: [
    {
      name: 'button1',
      type: ComponentType.Button,
      layout: {
        w: 1,
        h: 2,
        x: 3,
        y: 4,
      },
      data: {
        button: COMPONENT_DATA_TEMPLATES.button,
      },
      eventHandlers: [],
    },
  ],
  actions: [],
};

export const mockComponentLayout = {
  x: 1,
  y: 2,
  h: 3,
  w: 4,
};
