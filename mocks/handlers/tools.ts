import { rest } from 'msw';
import {
  ActionMethod,
  ActionType,
  ComponentEvent,
  ComponentType,
  EventHandlerType,
  Tool,
} from '@app/types';
import { generateRandomDate } from '../utils';
import { mockUser } from './auth';

const TOOLS: Tool[] = [
  {
    id: '1',
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
            transformer: 'return data',
            code: "alert('hello');",
          },
        },
        eventHandlers: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Script Dashboard',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creatorUser: mockUser,
    components: [],
    actions: [],
  },
  {
    id: '3',
    name: 'Topping Up Nodes',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creatorUser: mockUser,
    components: [],
    actions: [],
  },
];

export const toolHandlers = [
  rest.get('*/api/tools/:id', (req, res, ctx) => {
    const tool = TOOLS.find((currTool) => currTool.id === req.params.id);

    if (!tool) {
      return res(ctx.status(400));
    }

    return res(ctx.status(200), ctx.json<Tool>(tool));
  }),
  rest.get('*/api/tools', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<Tool[]>(TOOLS));
  }),
  rest.post('*/api/tools', async (req, res, ctx) => {
    const body = await req.json<{ name: string }>();

    if (TOOLS.some((tool) => tool.name === body.name)) {
      return res(
        ctx.status(400),
        ctx.json({ message: `Tool with name "${body.name}" already exists.` })
      );
    }

    const newTool: Tool = {
      id: crypto.randomUUID(),
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorUser: mockUser,
      components: [],
      actions: [],
    };
    TOOLS.push(newTool);

    return res(ctx.status(201), ctx.json<Tool>(newTool));
  }),
  rest.put('*/api/tools/:id', async (req, res, ctx) => {
    const body = await req.json<
      Pick<Tool, 'name' | 'components' | 'actions'>
    >();

    const tool = TOOLS.find((currTool) => currTool.id === req.params.id);

    if (!tool) {
      return res(ctx.status(400));
    }

    if (
      TOOLS.some(
        (currTool) => currTool.id !== tool.id && currTool.name === body.name
      )
    ) {
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
