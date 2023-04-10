import { createAction } from '@reduxjs/toolkit';

// NOTE: These actions have to be extracted to prevent a dependency cycle between the authSlice
// and authApi files.
const LOGOUT = 'auth/logout';
const SET_TOKENS = 'auth/setTokens';

const setTokens = createAction<{ accessToken: string; refreshToken: string }>(SET_TOKENS);
const logout = createAction<void>(LOGOUT);

export { setTokens, logout };
