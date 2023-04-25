import { logout } from '@app/redux/actions/auth';
import { MiddlewareAPI } from '@reduxjs/toolkit';
import { analytics } from '@app/analytics';
import { usersApi } from '@app/redux/services/users';
import { mockUser } from '@tests/constants/data';
import { authApi } from '@app/redux/services/auth';
import { identifyMiddleware } from '../identifyMiddleware';

const mockApi = {
  getState: () => ({}),
} as MiddlewareAPI;
const mockNext = jest.fn();

jest.mock('@app/analytics');

describe('identifyMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it.each`
      actionType    | endpointName
      ${'authApi'}  | ${authApi.endpoints.login.name}
      ${'authApi'}  | ${authApi.endpoints.applyForgotPassword.name}
      ${'usersApi'} | ${usersApi.endpoints.acceptInvite.name}
    `(
      'identifies user on $endpointName endpoint fulfillment',
      ({ actionType, endpointName }: { actionType: string; endpointName: string }) => {
        identifyMiddleware(mockApi)(mockNext)({
          type: `${actionType}/executeMutation/fulfilled`,
          payload: { user: mockUser },
          meta: {
            arg: {
              endpointName,
            },
          },
        });
        expect(analytics.identify).toHaveBeenCalledWith(mockUser._id, {
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          company: {
            id: mockUser.companyId,
          },
          companyId: mockUser.companyId,
        });
      }
    );
  });

  describe('user refresh', () => {
    it('identifies user on getMyUser endpoint fulfillment', () => {
      identifyMiddleware(mockApi)(mockNext)({
        type: 'usersApi/executeQuery/fulfilled',
        payload: mockUser,
        meta: {
          arg: {
            endpointName: usersApi.endpoints.getMyUser.name,
          },
        },
      });
      expect(analytics.identify).toHaveBeenCalledWith(mockUser._id, {
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        company: {
          id: mockUser.companyId,
        },
        companyId: mockUser.companyId,
      });
    });
  });

  describe('logout', () => {
    it('resets analytics on logout', () => {
      identifyMiddleware(mockApi)(mockNext)(logout);
      expect(analytics.reset).toHaveBeenCalled();
    });
  });
});
