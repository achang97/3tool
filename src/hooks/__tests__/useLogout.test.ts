import { renderHook } from '@testing-library/react';
import { logout } from '@app/redux/actions/auth';
import { useLogout } from '../useLogout';

const mockDispatch = jest.fn();
const mockApiLogout = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/redux/services/auth', () => ({
  useLogoutMutation: jest.fn(() => [mockApiLogout]),
}));

describe('useLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls api to logout', () => {
    const { result } = renderHook(() => useLogout());
    result.current();
    expect(mockApiLogout).toHaveBeenCalled();
  });

  it('dispatches action to logout', () => {
    const { result } = renderHook(() => useLogout());
    result.current();
    expect(mockDispatch).toHaveBeenCalledWith(logout());
  });
});
