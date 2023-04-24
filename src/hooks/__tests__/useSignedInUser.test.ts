import { useAppSelector } from '@app/redux/hooks';
import { renderHook } from '@testing-library/react';
import { mockUser } from '@tests/constants/data';
import { useSignedInUser } from '../useSignedInUser';

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

describe('useSignedInUser', () => {
  it('returns user from redux state', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      user: mockUser,
    }));
    const { result } = renderHook(() => useSignedInUser());
    expect(result.current).toEqual(mockUser);
  });
});
