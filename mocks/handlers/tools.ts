import { rest } from 'msw';
import { Tool } from '@app/types';
import { generateRandomDate } from '../utils';

const TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Staking Pool - DO NOT EDIT [MULTISIG ADMINS ONLY]',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creator: {
      name: 'Andrew Chang',
    },
    components: [],
  },
  {
    id: '2',
    name: 'Script Dashboard',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creator: {
      name: 'Akshay Ramaswamy',
    },
    components: [],
  },
  {
    id: '3',
    name: 'Topping Up Nodes',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    creator: {
      name: 'Chetan Rane',
    },
    components: [],
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
    const body = await req.json();

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
      creator: { name: 'Andrew Chang' },
      components: [],
    };
    TOOLS.push(newTool);

    return res(ctx.status(201), ctx.json<Tool>(newTool));
  }),
  rest.put('*/api/tools/:id', async (req, res, ctx) => {
    const body = await req.json();

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
    tool.updatedAt = new Date().toISOString();

    return res(ctx.status(200), ctx.json<Tool>(tool));
  }),
];
