import { rest } from 'msw';
import { User } from '@app/types';
import { mockUser } from '@tests/constants/data';

// Map of emails to passwords
const validUsers: Record<string, string> = {
  'andrew@tryelixir.io': 'password',
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
      ctx.json<{ user: User; accessToken: string; refreshToken: string }>({
        user: mockUser,
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
