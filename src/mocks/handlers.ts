// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';
import { Tool } from '@app/types';

export const handlers = [
  rest.get('*/api/tools/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<Tool>({
        id: '1',
        name: 'Staking Pool',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  }),
  rest.get('*/api/tools', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<Tool[]>([
        {
          id: '1',
          name: 'Staking Pool',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Script Dashboard',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          name: 'Topping Up Nodes',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
    );
  }),
];
