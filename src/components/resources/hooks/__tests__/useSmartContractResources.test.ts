import { useGetResourcesQuery } from '@app/redux/services/resources';
import { renderHook } from '@testing-library/react';
import { ResourceType } from '@app/types';
import { useSmartContractResources } from '../useSmartContractResources';

jest.mock('@app/redux/services/resources', () => ({
  useGetResourcesQuery: jest.fn(),
}));

describe('useSmartContractResources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({}));
  });

  it('returns empty array if query returns undefined', () => {
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
    }));
    const { result } = renderHook(() => useSmartContractResources());
    expect(result.current).toEqual([]);
  });

  it('returns filtered array of smart contracts', () => {
    const mockResources = [
      { type: ResourceType.SmartContract, name: 'Smart Contract' },
      { type: ResourceType.Abi, name: 'ABI' },
    ];
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({
      data: mockResources,
    }));
    const { result } = renderHook(() => useSmartContractResources());
    expect(result.current).toEqual([mockResources[0]]);
  });
});
