import { Mutex } from 'async-mutex';
import { API_BASE_URL } from '@app/constants';
import { ApiError } from '@app/types';
import { BaseQueryFn, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { logout, setTokens } from '@app/redux/actions/auth';
// import type { RootState } from '@app/redux/store';

type CustomBaseQueryFn = BaseQueryFn<string | FetchArgs, unknown, ApiError, {}>;

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  // prepareHeaders: async (headers, { getState }) => {
  //   const state = getState() as RootState;

  //   // Prevent overrides if the authorization header has been explicitly set
  //   if (!headers.get('authorization')) {
  //     headers.set('authorization', `Bearer ${state.auth.accessToken}`);
  //   }
  // },
}) as CustomBaseQueryFn;

// Code source: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
export const mutex = new Mutex();

export const baseQueryWithReauth: CustomBaseQueryFn = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  const result = await baseQuery(args, api, extraOptions);
  return result;

  // if (
  //   result.error &&
  //   result.error.status === 401 &&
  //   // @ts-ignore isTokenExpired is a custom field defined on this error
  //   result.error.data?.isTokenExpired
  // ) {
  //   // Check whether the mutex is locked
  //   if (!mutex.isLocked()) {
  //     const release = await mutex.acquire();
  //     try {
  //       const state = api.getState() as RootState;
  //       const refreshResult = await baseQuery(
  //         {
  //           url: '/auth/refreshToken',
  //           method: 'POST',
  //           body: { refreshToken: state.auth.refreshToken },
  //         },
  //         api,
  //         extraOptions
  //       );

  //       if (refreshResult.data) {
  //         const newTokens = refreshResult.data as {
  //           accessToken: string;
  //           refreshToken: string;
  //         };

  //         api.dispatch(setTokens(newTokens));

  //         // Retry the initial query
  //         const baseArgs: FetchArgs = typeof args === 'string' ? { url: args } : args;
  //         result = await baseQuery(
  //           {
  //             ...baseArgs,
  //             headers: new Headers({
  //               authorization: `Bearer ${newTokens.accessToken}`,
  //             }),
  //           },
  //           api,
  //           extraOptions
  //         );
  //       } else {
  //         api.dispatch(logout());
  //       }
  //     } finally {
  //       // Release must be called once the mutex should be released again.
  //       release();
  //     }
  //   } else {
  //     // Wait until the mutex is available without locking it
  //     await mutex.waitForUnlock();
  //     result = await baseQuery(args, api, extraOptions);
  //   }
  // }

  // return result;
};
