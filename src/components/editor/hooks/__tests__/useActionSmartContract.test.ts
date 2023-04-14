import { ResourceType, SmartContractBaseData } from '@app/types';
import { mainnet } from 'wagmi';
import { renderHook } from '@tests/utils/renderWithContext';
import { useActionSmartContract } from '../useActionSmartContract';

jest.mock('@app/components/resources/hooks/useSmartContractResources', () => ({
  useSmartContractResources: jest.fn(() => [
    {
      _id: '1',
      type: ResourceType.SmartContract,
      data: {
        smartContract: {
          address: '0x123',
          chainId: mainnet.id,
          abiId: '2',
        },
      },
    },
  ]),
}));

jest.mock('@app/components/resources/hooks/useAbiResources', () => ({
  useAbiResources: jest.fn(() => [
    {
      _id: '2',
      type: ResourceType.Abi,
      data: {
        abi: {
          abi: '[{ "name": "function1" }]',
        },
      },
    },
  ]),
}));

describe('useActionSmartContract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('smart contract resource', () => {
    it('returns address and chainId from smart contract resource', () => {
      const { result } = renderHook(() => useActionSmartContract());
      const smartContract = result.current({
        freeform: false,
        smartContractId: '1',
      } as SmartContractBaseData);
      expect(smartContract).toMatchObject({
        address: '0x123',
        chainId: mainnet.id,
      });
    });

    it('returns abi from smart contract resource abi id', () => {
      const { result } = renderHook(() => useActionSmartContract());
      const smartContract = result.current({
        freeform: false,
        smartContractId: '1',
      } as SmartContractBaseData);
      expect(smartContract.abi).toEqual([{ name: 'function1' }]);
    });
  });

  describe('freeform', () => {
    it('returns evaluated address', () => {
      const { result } = renderHook(() => useActionSmartContract());
      const smartContract = result.current(
        {
          freeform: true,
          freeformAddress: '{{ element }}',
        } as SmartContractBaseData,
        { element: '0x123' }
      );
      expect(smartContract.address).toEqual('0x123');
    });

    it('returns evaluated chainId', () => {
      const { result } = renderHook(() => useActionSmartContract());
      const smartContract = result.current(
        {
          freeform: true,
          freeformChainId: '{{ element }}',
        } as SmartContractBaseData,
        { element: '5' }
      );
      expect(smartContract.chainId).toEqual(5);
    });

    it('returns abi from freeform abi id', () => {
      const { result } = renderHook(() => useActionSmartContract());
      const smartContract = result.current({
        freeform: true,
        freeformAbiId: '2',
      } as SmartContractBaseData);
      expect(smartContract.abi).toEqual([{ name: 'function1' }]);
    });
  });
});
