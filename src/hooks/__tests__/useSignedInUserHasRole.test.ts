import { Role, User } from '@app/types';
import { mockEditorRoleUser, mockUser } from '@tests/constants/data';
import { renderHook } from '@tests/utils/renderWithContext';
import { useSignedInUserHasRole } from '../useSignedInUserHasRole';
import { useSignedInUser } from '../useSignedInUser';

jest.mock('@app/hooks/useSignedInUser');

const mockAdminRoleUser: User = { ...mockUser, roles: { ...mockUser.roles, isAdmin: true } };

describe('useSignedInUserHasRole', () => {
  it('returns true if signed in user has role', () => {
    jest.mocked(useSignedInUser).mockImplementation(() => mockAdminRoleUser);
    const { result } = renderHook(() => useSignedInUserHasRole(Role.Admin));

    expect(result.current).toEqual(true);
  });

  it('returns false if signed in user does not have role', () => {
    jest.mocked(useSignedInUser).mockImplementation(() => mockEditorRoleUser);
    const { result } = renderHook(() => useSignedInUserHasRole(Role.Admin));

    expect(result.current).toEqual(false);
  });

  it('returns false if signed in user is not present', () => {
    jest.mocked(useSignedInUser).mockImplementation(() => undefined);
    const { result } = renderHook(() => useSignedInUserHasRole(Role.Admin));

    expect(result.current).toEqual(false);
  });
});
