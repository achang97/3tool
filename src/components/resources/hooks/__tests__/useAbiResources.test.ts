import { useGetResourcesQuery } from '@app/redux/services/resources';
import { renderHook } from '@testing-library/react';
import { ResourceType } from '@app/types';
import { useAbiResources } from '../useAbiResources';

jest.mock('@app/redux/services/resources', () => ({
  useGetResourcesQuery: jest.fn(),
}));

describe('useAbiResources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({}));
  });

  it('returns empty array if query returns undefined', () => {
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
    }));
    const { result } = renderHook(() => useAbiResources());
    expect(result.current).toEqual([]);
  });

  it('returns filtered array of ABIs', () => {
    const mockResources = [
      { type: ResourceType.SmartContract, name: 'Smart Contract' },
      { type: ResourceType.Abi, name: 'ABI' },
    ];
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({
      data: mockResources,
    }));
    const { result } = renderHook(() => useAbiResources());
    expect(result.current).toEqual([mockResources[1]]);
  });
});
