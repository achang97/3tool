import { createSlice } from '@reduxjs/toolkit';
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
    builder.addCase(logout, (state) => {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.user = undefined;
    });
    builder.addCase(setTokens, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });

    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    });
    builder.addMatcher(usersApi.endpoints.getMyUser.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default authSlice.reducer;
