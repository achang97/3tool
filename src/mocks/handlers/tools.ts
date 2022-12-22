// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';
import { Tool } from '@app/types';
import { generateRandomDate } from '../utils';

const TOOLS: Tool[] = [
  {
    id: '1',
    name: 'Staking Pool - DO NOT EDIT [MULTISIG ADMINS ONLY]',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
  },
  {
    id: '2',
    name: 'Script Dashboard',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
  },
  {
    id: '3',
    name: 'Topping Up Nodes',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
  },
];

export const toolHandlers = [
  rest.get('*/api/tools/:id', (req, res, ctx) => {
    const tool = TOOLS.find((currTool) => currTool.id === req.id);

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

    const newTool: Tool = {
      id: crypto.randomUUID(),
      name: body.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    TOOLS.push(newTool);

    return res(ctx.status(201), ctx.json<Tool>(newTool));
  }),
];
