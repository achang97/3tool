import { useAppSelector } from '@app/redux/hooks';
import { renderHook } from '@testing-library/react';
import { mockUser } from '@tests/constants/data';
import { useUser } from '../useUser';

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

describe('useUser', () => {
  it('returns user from redux state', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      user: mockUser,
    }));
    const { result } = renderHook(() => useUser());
    expect(result.current).toEqual(mockUser);
  });
});
