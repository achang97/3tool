import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import { analytics } from '@app/analytics';
import { useRouteChangeListener } from '../useRouteChangeListener';

jest.mock('next/router');
jest.mock('@app/analytics');

describe('useRouteChangeListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    pathname                 | query                             | name                  | properties
    ${'/login'}              | ${undefined}                      | ${'Login'}            | ${undefined}
    ${'/forgotPassword'}     | ${undefined}                      | ${'Forgot Password'}  | ${undefined}
    ${'/resetPassword'}      | ${undefined}                      | ${'Reset Password'}   | ${undefined}
    ${'/acceptInvite'}       | ${undefined}                      | ${'Accept Invite'}    | ${undefined}
    ${'/'}                   | ${undefined}                      | ${'Dashboard'}        | ${undefined}
    ${'/404'}                | ${undefined}                      | ${'404'}              | ${undefined}
    ${'/resources'}          | ${undefined}                      | ${'Resources'}        | ${undefined}
    ${'/settings/team'}      | ${undefined}                      | ${'Team Settings'}    | ${undefined}
    ${'/settings/account'}   | ${undefined}                      | ${'Account Settings'} | ${undefined}
    ${'/tools/[id]/[name]'}  | ${{ id: 'toolId', name: 'Tool' }} | ${'App View'}         | ${{ toolId: 'toolId', toolName: 'Tool' }}
    ${'/editor/[id]/[name]'} | ${{ id: 'toolId', name: 'Tool' }} | ${'App Editor'}       | ${{ toolId: 'toolId', toolName: 'Tool' }}
  `(
    'calls analytics.page with $name name',
    ({
      pathname,
      query,
      name,
      properties,
    }: {
      pathname: string;
      query: Record<string, unknown>;
      name: string;
      properties: Record<string, unknown>;
    }) => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname,
        query,
      }));
      renderHook(() => useRouteChangeListener());
      expect(analytics.page).toHaveBeenCalledWith(undefined, name, properties);
    }
  );

  it('does not call analytics.page if route is invalid', () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/invalid',
    }));
    renderHook(() => useRouteChangeListener());
    expect(analytics.page).not.toHaveBeenCalled();
  });
});
