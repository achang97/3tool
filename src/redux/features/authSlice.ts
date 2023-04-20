import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { User } from '@app/types';
import { authApi } from '../services/auth';
import { logout, setTokens } from '../actions/auth';
import { usersApi } from '../services/users';

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logout, () => {
      return initialState;
    });
    builder.addCase(setTokens, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });

    builder.addMatcher(
      isAnyOf(
        authApi.endpoints.login.matchFulfilled,
        authApi.endpoints.applyForgotPassword.matchFulfilled,
        usersApi.endpoints.acceptInvite.matchFulfilled
      ),
      (state, action) => {
        const { accessToken, refreshToken, user } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
      }
    );
    builder.addMatcher(usersApi.endpoints.getMyUser.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default authSlice.reducer;
