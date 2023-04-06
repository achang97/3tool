import { rest } from 'msw';
import { User } from '@app/types';
import { mockUser } from '@mocks/data/users';

export const usersHandlers = [
  rest.get('*/users/me', async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<User>(mockUser));
  }),
];
