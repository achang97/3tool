import { Mutex } from 'async-mutex';
import { API_BASE_URL } from '@app/constants';
import { ApiError } from '@app/types';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { logout, setTokens } from '@app/redux/actions/auth';

export const getTokensFromStorage = async (): Promise<{
  accessToken?: string;
  refreshToken?: string;
}> => {
  const authData = await storage.getItem('persist:auth');
  if (!authData) {
    return {};
  }

  try {
    const parsedAuthData = JSON.parse(authData);
    return {
      accessToken: JSON.parse(parsedAuthData.accessToken),
      refreshToken: JSON.parse(parsedAuthData.refreshToken),
    };
  } catch {
    return {};
  }
};

type CustomBaseQueryFn = BaseQueryFn<string | FetchArgs, unknown, ApiError, {}>;

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const tokens = await getTokensFromStorage();
    headers.set('authorization', `Bearer ${tokens.accessToken}`);
  },
}) as CustomBaseQueryFn;

// Code source: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
export const mutex = new Mutex();

export const baseQueryWithReauth: CustomBaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const tokens = await getTokensFromStorage();
        const refreshResult = await baseQuery(
          {
            url: '/auth/refreshToken',
            method: 'POST',
            body: { refreshToken: tokens.refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch(
            setTokens(
              refreshResult.data as {
                accessToken: string;
                refreshToken: string;
              }
            )
          );
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        // Release must be called once the mutex should be released again.
        release();
      }
    } else {
      // Wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
