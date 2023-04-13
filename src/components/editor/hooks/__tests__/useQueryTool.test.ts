import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useGetToolByIdQuery } from '@app/redux/services/tools';
import { mockTool } from '@tests/constants/data';
import { useQueryTool } from '../useQueryTool';

const mockPush = jest.fn();

jest.mock('@app/redux/services/tools');

describe('useQueryTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({ query: {} }));
    (useGetToolByIdQuery as jest.Mock).mockImplementation(() => ({}));
  });

  it('skips query if tool id is undefined', () => {
    (useRouter as jest.Mock).mockImplementation(() => ({ query: {} }));
    renderHook(() => useQueryTool());
    expect(useGetToolByIdQuery).toHaveBeenCalledWith('', {
      skip: true,
      refetchOnMountOrArgChange: true,
    });
  });

  it('fires query if tool id is defined', () => {
    const mockToolId = 'toolId';
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: mockToolId },
    }));
    renderHook(() => useQueryTool());
    expect(useGetToolByIdQuery).toHaveBeenCalledWith(mockToolId, {
      skip: false,
      refetchOnMountOrArgChange: true,
    });
  });

  it('pushes to /404 route if there is an error', () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {},
      push: mockPush,
    }));
    (useGetToolByIdQuery as jest.Mock).mockImplementation(() => ({
      error: new Error(),
    }));
    renderHook(() => useQueryTool());
    expect(mockPush).toHaveBeenCalledWith('/404');
  });

  it('returns queried tool', () => {
    (useGetToolByIdQuery as jest.Mock).mockImplementation(() => ({
      data: mockTool,
    }));
    const { result } = renderHook(() => useQueryTool());
    expect(result.current).toEqual(mockTool);
  });
});
