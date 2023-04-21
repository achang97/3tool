import { rest } from 'msw';
import { User, UserInvite } from '@app/types';
import { mockUser, mockUser2 } from '@mocks/data/users';
import { mockFulfilledUserInvite, mockPendingUserInvite } from '@mocks/data/invites';

const mockUsers = [mockUser, mockUser2];
const mockPendingUserInvites = [mockPendingUserInvite];

export const companiesHandlers = [
  rest.get('*/companies/my/users', async (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json<User[]>(mockUsers));
  }),

  rest.put('*/companies/my/users/:id', async (req, res, ctx) => {
    const body = await req.json<User>();
    const userIndex = mockUsers.findIndex((user) => user._id === req.params.id);
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json<User>({ ...body, _id: req.params.id as string })
    );
  }),

  rest.post('*/companies/my/invite', async (req, res, ctx) => {
    const body = await req.json<UserInvite>();
    mockPendingUserInvites.push({ ...body, _id: `invite_msw_${mockPendingUserInvites.length}` });
    return res(ctx.delay(1000), ctx.status(200));
  }),

  rest.get('*/companies/my/invites', async (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const userInvites = status === 'pending' ? mockPendingUserInvites : [mockFulfilledUserInvite];
    return res(ctx.delay(1000), ctx.status(200), ctx.json<UserInvite[]>(userInvites));
  }),
];
