import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@app/types';
import { authApi } from '../services/auth';
import { logout, setTokens } from '../actions/auth';

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
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

    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { accessToken, refreshToken, ...user } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
      }
    );
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
