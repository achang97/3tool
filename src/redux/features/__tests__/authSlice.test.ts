import { mockUser } from '@tests/constants/data';
import { authApi } from '@app/redux/services/auth';
import { logout, setTokens } from '@app/redux/actions/auth';
import { usersApi } from '@app/redux/services/users';
import authReducer from '../authSlice';

describe('authSlice', () => {
  it('setTokens: sets access and refresh tokens', () => {
    const mockTokens = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const initialState = {};
    const state = authReducer(initialState, setTokens(mockTokens));
    expect(state.accessToken).toEqual(mockTokens.accessToken);
    expect(state.refreshToken).toEqual(mockTokens.refreshToken);
  });

  it('logout: clears state', () => {
    const initialState = {
      user: mockUser,
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const state = authReducer(initialState, logout());
    expect(state).toEqual({});
  });

  describe('login', () => {
    it.each`
      actionType    | endpointName
      ${'authApi'}  | ${authApi.endpoints.login.name}
      ${'authApi'}  | ${authApi.endpoints.applyForgotPassword.name}
      ${'usersApi'} | ${usersApi.endpoints.acceptInvite.name}
    `(
      '$endpointName fulfilled: sets tokens and user',
      async ({ actionType, endpointName }: { actionType: string; endpointName: string }) => {
        const action = {
          type: `${actionType}/executeMutation/fulfilled`,
          payload: {
            user: mockUser,
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
          meta: {
            arg: {
              endpointName,
            },
          },
        };
        const initialState = {};
        const state = authReducer(initialState, action);
        expect(state.accessToken).toEqual(action.payload.accessToken);
        expect(state.refreshToken).toEqual(action.payload.refreshToken);
        expect(state.user).toEqual(action.payload.user);
      }
    );
  });

  it('/auth/forgotPassword/apply fulfilled: sets tokens and user', async () => {
    const getMyUserAction = {
      type: 'usersApi/executeQuery/fulfilled',
      payload: mockUser,
      meta: {
        arg: {
          endpointName: usersApi.endpoints.getMyUser.name,
        },
      },
    };
    const initialState = {};
    const state = authReducer(initialState, getMyUserAction);
    expect(state.user).toEqual(getMyUserAction.payload);
  });
});
