import { rest } from 'msw';
import { User } from '@app/types';

// Map of emails to passwords
export const validUsers: Record<string, string> = {
  'andrew@tryelixir.io': 'password',
};

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
const mockAccessToken = 'accessToken';
const mockRefreshToken = 'refreshToken';

export const authHandlers = [
  rest.post('*/api/auth/login', async (req, res, ctx) => {
    const body = await req.json<{ email: string; password: string }>();

    if (validUsers[body.email] !== body.password) {
      return res(ctx.status(400), ctx.json({ message: 'Invalid credentials' }));
    }

    return res(
      ctx.status(200),
      ctx.json<User & { accessToken: string; refreshToken: string }>({
        ...mockUser,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      })
    );
  }),
  rest.post('*/api/auth/logout', async (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.post('*/api/auth/refreshToken', async (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      })
    );
  }),
];
