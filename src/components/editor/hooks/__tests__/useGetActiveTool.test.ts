import { useGetToolByIdQuery } from '@app/redux/services/tools';
import { renderHook } from '@testing-library/react';
import { useGetActiveTool } from '../useGetActiveTool';

const mockId = 'test';
const mockData = 'test';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { id: mockId },
  })),
}));

jest.mock('@app/redux/services/tools', () => ({
  useGetToolByIdQuery: jest.fn(() => ({
    data: mockData,
  })),
}));

describe('useGetActiveTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls useGetToolByIdQuery with pathname query id', () => {
    renderHook(useGetActiveTool);
    expect(useGetToolByIdQuery).toHaveBeenCalledWith(mockId);
  });

  it('returns data field from useGetToolByIdQuery', () => {
    const { result } = renderHook(useGetActiveTool);
    expect(result.current).toEqual(mockData);
  });
});
