import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { User } from '@app/types';
import { analytics } from '@app/analytics';
import { authApi } from '../services/auth';
import { usersApi } from '../services/users';
import { logout } from '../actions/auth';

const identifyListenerMiddleware = createListenerMiddleware();

const identify = (user: User) => {
  analytics.identify(user._id, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    company: {
      id: user.companyId,
    },
    companyId: user.companyId,
  });
  analytics.track('Sign In');
};

identifyListenerMiddleware.startListening({
  predicate: isAnyOf(
    authApi.endpoints.login.matchFulfilled,
    authApi.endpoints.applyForgotPassword.matchFulfilled,
    usersApi.endpoints.acceptInvite.matchFulfilled
  ),
  effect: (action) => {
    const user = action.payload.user as User;
    identify(user);
  },
});

identifyListenerMiddleware.startListening({
  predicate: usersApi.endpoints.getMyUser.matchFulfilled,
  effect: (action) => {
    const user = action.payload as User;
    identify(user);
  },
});

identifyListenerMiddleware.startListening({
  actionCreator: logout,
  effect: () => {
    analytics.reset();
  },
});

export const identifyMiddleware = identifyListenerMiddleware.middleware;
