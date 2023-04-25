import { renderHook } from '@testing-library/react';
import { useAppSelector } from '@app/redux/hooks';
import { useRouter } from 'next/router';
import { useToolMode } from '../useToolMode';

jest.mock('next/router');
jest.mock('@app/redux/hooks');

describe('useToolMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('returns "view" when on view route', () => {
    (useRouter as jest.Mock).mockImplementation(() => ({ pathname: '/tools/[id]/[name]' }));
    const { result } = renderHook(() => useToolMode());
    expect(result.current).toEqual('view');
  });

  it('returns "preview" when on edit route and previewing', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({ isPreview: true }));
    (useRouter as jest.Mock).mockImplementation(() => ({ pathname: '/editor/[id]/[name]' }));
    const { result } = renderHook(() => useToolMode());
    expect(result.current).toEqual('preview');
  });

  it('returns "edit" when on edit route and editing', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({ isPreview: false }));
    (useRouter as jest.Mock).mockImplementation(() => ({ pathname: '/editor/[id]/[name]' }));
    const { result } = renderHook(() => useToolMode());
    expect(result.current).toEqual('edit');
  });
});
