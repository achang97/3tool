import storage from 'redux-persist/lib/storage';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query';
import { logout, setTokens } from '@app/redux/actions/auth';
import { waitFor } from '@testing-library/dom';
import {
  baseQuery,
  baseQueryWithReauth,
  getTokensFromStorage,
  mutex,
} from '../baseQuery';

jest.mock('redux-persist/lib/storage');

const mockResponse = new Response('response');
const mockDispatch = jest.fn();

const mockAccessToken = 'accessToken';
const mockRefreshToken = 'refreshToken';

describe('baseQuery', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);

    (storage.getItem as jest.Mock).mockImplementation(() =>
      JSON.stringify({
        accessToken: JSON.stringify(mockAccessToken),
        refreshToken: JSON.stringify(mockRefreshToken),
      })
    );
  });

  describe('getTokensFromStorage', () => {
    it('returns empty object if storage does not contain auth data', async () => {
      (storage.getItem as jest.Mock).mockImplementation(() => undefined);
      const result = await getTokensFromStorage();
      expect(result).toEqual({});
    });

    it('returns empty object if storage contains invalid auth data', async () => {
      (storage.getItem as jest.Mock).mockImplementation(() => 'asdf');
      const result = await getTokensFromStorage();
      expect(result).toEqual({});
    });

    it('returns parsed access and refresh token', async () => {
      const result = await getTokensFromStorage();
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  describe('baseQuery', () => {
    it('adds authorization header if not set', async () => {
      await baseQuery('/test', {} as BaseQueryApi, {});
      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: new Headers({
            authorization: `Bearer ${mockAccessToken}`,
          }),
        })
      );
    });

    it('does not override authorization header if already set', async () => {
      const mockCustomAccessToken = 'customAccessToken';
      await baseQuery(
        {
          url: '/test',
          headers: new Headers({
            authorization: `Bearer ${mockCustomAccessToken}`,
          }),
        },
        {} as BaseQueryApi,
        {}
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: new Headers({
            authorization: `Bearer ${mockCustomAccessToken}`,
          }),
        })
      );
    });
  });

  describe('baseQueryWithReauth', () => {
    it('issues call to original endpoint', async () => {
      await baseQueryWithReauth('/test', {} as BaseQueryApi, {});
      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/test' })
      );
    });

    it('does not refresh token if call does not return 401', async () => {
      await baseQueryWithReauth('/test', {} as BaseQueryApi, {});
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).not.toHaveBeenCalledWith(
        expect.objectContaining({ url: '/auth/refreshToken' })
      );
    });

    describe('refresh with mutex unlocked', () => {
      const mockNewAccessToken = 'newAccessToken';
      const mockNewRefreshToken = 'newRefreshToken';

      beforeEach(() => {
        (fetch as jest.Mock).mockImplementationOnce(
          () =>
            new Response(JSON.stringify({ isTokenExpired: true }), {
              status: 401,
            })
        );
      });

      it('refreshes token if first call returns 401', async () => {
        await baseQueryWithReauth(
          '/test',
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/auth/refreshToken',
            _bodyInit: JSON.stringify({ refreshToken: mockRefreshToken }),
          })
        );
      });

      it('dispatches call to set tokens if refresh succeeds', async () => {
        (fetch as jest.Mock).mockImplementationOnce(
          () =>
            new Response(
              JSON.stringify({
                accessToken: mockNewAccessToken,
                refreshToken: mockNewRefreshToken,
              })
            )
        );
        await baseQueryWithReauth(
          '/test',
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          setTokens({
            accessToken: mockNewAccessToken,
            refreshToken: mockNewRefreshToken,
          })
        );
      });

      it('dispatches call to logout if refresh fails', async () => {
        (fetch as jest.Mock).mockImplementationOnce(
          () => new Response(null, { status: 400 })
        );
        await baseQueryWithReauth(
          '/test',
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );
        expect(mockDispatch).toHaveBeenCalledWith(logout());
      });

      it('adds explicit access token header to re-attempted call with string as args', async () => {
        (fetch as jest.Mock).mockImplementationOnce(
          () =>
            new Response(
              JSON.stringify({
                accessToken: mockNewAccessToken,
                refreshToken: mockNewRefreshToken,
              })
            )
        );
        await baseQueryWithReauth(
          '/test',
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );
        await waitFor(() => {
          expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
              url: '/test',
              headers: new Headers({
                authorization: `Bearer ${mockNewAccessToken}`,
              }),
            })
          );
        });
      });

      it('adds explicit access token header to re-attempted call with object as args', async () => {
        (fetch as jest.Mock).mockImplementationOnce(
          () =>
            new Response(
              JSON.stringify({
                accessToken: mockNewAccessToken,
                refreshToken: mockNewRefreshToken,
              })
            )
        );
        await baseQueryWithReauth(
          { url: '/test', method: 'POST' },
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );
        await waitFor(() => {
          expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
              url: '/test',
              method: 'POST',
              headers: new Headers({
                authorization: `Bearer ${mockNewAccessToken}`,
              }),
            })
          );
        });
      });

      it('releases mutex after completion', async () => {
        await baseQueryWithReauth(
          '/test',
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );
        expect(mutex.isLocked()).toEqual(false);
      });
    });

    describe('refresh with mutex locked', () => {
      beforeEach(() => {
        (fetch as jest.Mock).mockImplementationOnce(() => {
          return new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(
                  new Response(JSON.stringify({ isTokenExpired: true }), {
                    status: 401,
                  })
                ),
              5000
            );
          });
        });
      });

      it('waits for unlock and then calls original endpoint again', async () => {
        const mutexWaitSpy = jest.spyOn(mutex, 'waitForUnlock');

        baseQueryWithReauth(
          '/test',
          { dispatch: mockDispatch } as unknown as BaseQueryApi,
          {}
        );

        const release = await mutex.acquire();
        await waitFor(() => {
          expect(fetch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ url: '/test' })
          );
        });

        jest.advanceTimersByTime(5000);
        await waitFor(() => {
          expect(mutexWaitSpy).toHaveBeenCalledTimes(2);
        });

        release();
        await waitFor(() => {
          expect(fetch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ url: '/test' })
          );
        });
      });
    });
  });
});
