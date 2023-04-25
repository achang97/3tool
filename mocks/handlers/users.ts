import { rest } from 'msw';
import { User } from '@app/types';
import { mockUser } from '@mocks/data/users';

export const usersHandlers = [
  rest.get('*/users/me', async (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json<User>(mockUser));
  }),

  rest.put('*/users/me', async (req, res, ctx) => {
    const body = await req.json<
      Partial<Pick<User, 'firstName' | 'lastName'> & { password: string }>
    >();
    const { password, ...updatedUserBody } = body;
    Object.assign(mockUser, updatedUserBody);

    return res(ctx.delay(1000), ctx.status(200), ctx.json<User>(mockUser));
  }),
];
