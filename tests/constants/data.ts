import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import {
  ActionType,
  ComponentType,
  InviteStatus,
  Resource,
  ResourceType,
  Tool,
  User,
  UserInvite,
} from '@app/types';

export const mockValidAddresses = [
  '0xf33Cb58287017175CADf990c9e4733823704aA86',
  '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
];
export const mockValidAddress = mockValidAddresses[0];

export const mockUser: User = {
  _id: '1',
  email: 'andrew@tryelixir.io',
  firstName: 'Andrew',
  lastName: 'Chang',
  companyId: '123',
  state: {
    isPasswordSet: true,
  },
  roles: {
    isAdmin: true,
    isEditor: true,
    isViewer: true,
  },
};

export const mockEditorRoleUser: User = {
  _id: 'user_2',
  email: 'akshay@tryelixir.io',
  firstName: 'Akshay',
  lastName: 'Ramaswamy',
  companyId: '123',
  state: {
    isPasswordSet: true,
  },
  roles: {
    isAdmin: false,
    isEditor: true,
    isViewer: false,
  },
};

export const mockPendingUserInvite: UserInvite = {
  _id: 'invite_1',
  email: 'chetan@tryelixir.io',
  companyId: 'company_1',
  status: InviteStatus.Pending,
  roles: {
    isAdmin: false,
    isEditor: true,
    isViewer: true,
  },
  inviterUserId: 'user_1',
};

export const mockSmartContractResource: Resource = {
  _id: '1',
  type: ResourceType.SmartContract,
  name: 'Staking Pool Contract',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    smartContract: {
      chainId: 5,
      address: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
      abiId: '1',
    },
  },
};

export const mockProxySmartContractResource: Resource = {
  type: ResourceType.SmartContract,
  name: 'Name',
  _id: '2',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    smartContract: {
      chainId: 5,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
      abiId: '1',
    },
  },
};

export const mockTool: Tool = {
  _id: 'test',
  name: 'Tool',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creatorUser: mockUser,
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
  actions: [
    {
      name: 'action1',
      type: ActionType.Javascript,
      data: {
        javascript: {
          transformerEnabled: true,
          code: 'return 1',
          transformer: '',
        },
      },
      eventHandlers: [],
    },
  ],
};

export const mockComponentLayout = {
  x: 1,
  y: 2,
  h: 3,
  w: 4,
};
