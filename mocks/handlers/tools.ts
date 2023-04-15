import { rest } from 'msw';
import {
  ActionMethod,
  ActionType,
  ComponentEvent,
  ComponentType,
  EventHandlerType,
  Tool,
} from '@app/types';
import { mockUser } from '@mocks/data/users';
import { generateRandomDate } from '../utils';

const mockTools: Tool[] = [
  {
    _id: '1',
    name: 'Staking Pool - DO NOT EDIT [MULTISIG ADMINS ONLY]',
    createdAt: '2023-03-28T22:46:19.997Z',
    updatedAt: '2023-03-28T23:04:55.359Z',
    creatorUser: mockUser,
    components: [
      {
        type: ComponentType.Button,
        name: 'button1',
        layout: {
          w: 8,
          h: 4,
          x: 5,
          y: 5,
        },
        data: {
          button: {
            text: 'Button',
            disabled: '',
            loading: '',
          },
        },
        eventHandlers: [
          {
            type: EventHandlerType.Action,
            event: ComponentEvent.Click,
            data: {
              action: {
                actionName: 'action1',
                method: ActionMethod.Trigger,
              },
            },
          },
        ],
      },
    ],
    actions: [
      {
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
      },
      {
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
      },
      {
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
        },
        eventHandlers: [],
      },
    ],
  },
  {
    _id: '2',
    name: 'Script Dashboard',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creatorUser: mockUser,
    components: [],
    actions: [],
  },
  {
    _id: '3',
    name: 'Topping Up Nodes',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creatorUser: mockUser,
    components: [],
    actions: [],
  },
];

export const toolsHandlers = [
  rest.get('*/api/tools/:id', (req, res, ctx) => {
    const tool = mockTools.find((currTool) => currTool._id === req.params.id);

    if (!tool) {
      return res(ctx.status(400));
    }

    return res(ctx.status(200), ctx.json<Tool>(tool));
  }),
  rest.get('*/api/tools', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<Tool[]>(mockTools));
  }),
  rest.post('*/api/tools', async (req, res, ctx) => {
    const body = await req.json<{ name: string }>();

    if (mockTools.some((tool) => tool.name === body.name)) {
      return res(
        ctx.status(400),
        ctx.json({ message: `Tool with name "${body.name}" already exists.` })
      );
    }

    const newTool: Tool = {
      _id: crypto.randomUUID(),
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorUser: mockUser,
      components: [],
      actions: [],
    };
    mockTools.push(newTool);

    return res(ctx.status(201), ctx.json<Tool>(newTool));
  }),
  rest.put('*/api/tools/:id', async (req, res, ctx) => {
    const body = await req.json<Pick<Tool, 'name' | 'components' | 'actions'>>();

    const tool = mockTools.find((currTool) => currTool._id === req.params.id);

    if (!tool) {
      return res(ctx.status(400));
    }

    if (mockTools.some((currTool) => currTool._id !== tool._id && currTool.name === body.name)) {
      return res(
        ctx.status(400),
        ctx.json({
          message: `Tool with name "${body.name}" already exists.`,
        })
      );
    }

    if (body.name) tool.name = body.name;
    if (body.components) tool.components = body.components;
    if (body.actions) tool.actions = body.actions;
    tool.updatedAt = new Date().toISOString();

    return res(ctx.status(200), ctx.json<Tool>(tool));
  }),
];
