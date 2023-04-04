import _ from 'lodash';
import { mockUser } from '@tests/constants/data';
import { authApi } from '@app/redux/services/auth';
import { logout, setTokens } from '@app/redux/actions/auth';
import authReducer, { setUser } from '../authSlice';

describe('authSlice', () => {
  describe('actions', () => {
    it('setUser: sets the user', () => {
      const initialState = {};
      const state = authReducer(initialState, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
    });

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
      expect(state).toEqual({
        user: undefined,
        accessToken: undefined,
        refreshToken: undefined,
      });
    });

    it('login fulfilled: sets tokens and user', async () => {
      const loginAction = {
        type: 'authApi/executeMutation/fulfilled',
        payload: {
          ...mockUser,
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
        meta: {
          arg: {
            endpointName: authApi.endpoints.login.name,
          },
        },
      };
      const initialState = {};
      const state = authReducer(initialState, loginAction);
      expect(state.accessToken).toEqual(loginAction.payload.accessToken);
      expect(state.refreshToken).toEqual(loginAction.payload.refreshToken);
      expect(state.user).toEqual(
        _.omit(loginAction.payload, ['accessToken', 'refreshToken'])
      );
    });
  });
});
