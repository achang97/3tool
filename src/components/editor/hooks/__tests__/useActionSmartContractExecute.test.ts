import { ResourceType, SmartContractBaseData } from '@app/types';
import { mainnet } from 'wagmi';
import { prepareWriteContract, readContract, readContracts, writeContract } from '@wagmi/core';
import { ethers } from 'ethers';
import { renderHook } from '@testing-library/react';
import { useActionSmartContractExecute } from '../useActionSmartContractExecute';

const mockSigner = { address: '0xsigner' };
const mockSmartContract = {
  address: '0x123',
  chainId: mainnet.id,
  abiId: '2',
};
const mockAbi = [
  {
    name: 'read',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ type: 'string' }],
  },
  {
    name: 'write',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ type: 'string' }],
  },
];

jest.mock('wagmi', () => ({
  ...jest.requireActual('wagmi'),
  useSigner: jest.fn(() => ({ data: mockSigner })),
}));

jest.mock('@wagmi/core');

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(() => ({})),
  useAppDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('@app/components/resources/hooks/useSmartContractResources', () => ({
  useSmartContractResources: jest.fn(() => [
    {
      _id: '1',
      type: ResourceType.SmartContract,
      data: {
        smartContract: mockSmartContract,
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
          abi: JSON.stringify(mockAbi),
        },
      },
    },
  ]),
}));

describe('useActionSmartContractExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readSmartContract', () => {
    const mockReadResult = 'read result';
    const mockMultiReadResult = 'multiple read result';

    beforeEach(() => {
      (readContract as jest.Mock).mockImplementation(() => mockReadResult);
      (readContracts as jest.Mock).mockImplementation(() => mockMultiReadResult);
    });

    it('returns undefined if data is not defined', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const readResult = await result.current.readSmartContract(undefined);
      expect(readResult).toBeUndefined();
    });

    it('returns result from single function', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const readResult = await result.current.readSmartContract({
        freeform: false,
        smartContractId: '1',
        functions: [
          {
            name: 'read',
            args: ['hello'],
            payableAmount: '',
          },
        ],
      } as SmartContractBaseData);

      expect(readContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'read',
        args: ['hello'],
        signer: mockSigner,
      });
      expect(readResult).toEqual(mockReadResult);
    });

    it('returns multicall result from multiple functions', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const readResult = await result.current.readSmartContract({
        freeform: false,
        smartContractId: '1',
        functions: [
          {
            name: 'read',
            args: ['hello'],
            payableAmount: '',
          },
          {
            name: 'read',
            args: ['world'],
            payableAmount: '',
          },
        ],
      } as SmartContractBaseData);

      expect(readContracts).toHaveBeenCalledWith({
        contracts: [
          {
            abi: mockAbi,
            address: mockSmartContract.address,
            chainId: mockSmartContract.chainId,
            functionName: 'read',
            args: ['hello'],
            signer: mockSigner,
          },
          {
            abi: mockAbi,
            address: mockSmartContract.address,
            chainId: mockSmartContract.chainId,
            functionName: 'read',
            args: ['world'],
            signer: mockSigner,
          },
        ],
      });
      expect(readResult).toEqual(mockMultiReadResult);
    });

    it('returns looped array of results', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const readResult = await result.current.readSmartContract({
        loopEnabled: true,
        loopElements: 'return ["hello", "world"];',
        freeform: false,
        smartContractId: '1',
        functions: [
          {
            name: 'read',
            args: ['{{ element }}'],
            payableAmount: '',
          },
        ],
      } as SmartContractBaseData);

      expect(readContract).toHaveBeenCalledTimes(2);
      expect(readContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'read',
        args: ['hello'],
        signer: mockSigner,
      });
      expect(readContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'read',
        args: ['world'],
        signer: mockSigner,
      });
      expect(readResult).toEqual([
        { element: 'hello', data: mockReadResult },
        { element: 'world', data: mockReadResult },
      ]);
    });
  });

  describe('writeSmartContract', () => {
    const mockWriteResult = { hash: '123', extra: '123' };
    const mockPrepareWriteResult = 'prepare write';

    beforeEach(() => {
      (prepareWriteContract as jest.Mock).mockImplementation(() => mockPrepareWriteResult);
      (writeContract as jest.Mock).mockImplementation(() => mockWriteResult);
    });

    it('returns undefined if data is not defined', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract(undefined);
      expect(writeResult).toBeUndefined();
    });

    it('calls write function without payable amount', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract({
        freeform: false,
        smartContractId: '1',
        functions: [
          {
            name: 'write',
            args: ['hello'],
            payableAmount: '',
          },
        ],
      } as SmartContractBaseData);

      expect(prepareWriteContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'write',
        args: ['hello'],
        signer: mockSigner,
      });
      expect(writeContract).toHaveBeenCalledWith(mockPrepareWriteResult);
      expect(writeResult).toEqual({ hash: mockWriteResult.hash });
    });

    it('calls write function with evaluated payable amount', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract({
        freeform: false,
        smartContractId: '1',
        functions: [
          {
            name: 'write',
            args: ['hello'],
            payableAmount: '{{ 1 + 2 }}',
          },
        ],
      } as SmartContractBaseData);

      expect(prepareWriteContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'write',
        args: ['hello'],
        overrides: {
          value: ethers.utils.parseEther('3'),
        },
        signer: mockSigner,
      });
      expect(writeContract).toHaveBeenCalledWith(mockPrepareWriteResult);
      expect(writeResult).toEqual({ hash: mockWriteResult.hash });
    });

    it('returns looped array of results', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract({
        loopEnabled: true,
        loopElements: 'return ["hello", "world"];',
        freeform: false,
        smartContractId: '1',
        functions: [
          {
            name: 'write',
            args: ['{{ element }}'],
            payableAmount: '',
          },
        ],
      } as SmartContractBaseData);

      expect(prepareWriteContract).toHaveBeenCalledTimes(2);
      expect(writeContract).toHaveBeenCalledTimes(2);

      expect(prepareWriteContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'write',
        args: ['hello'],
        signer: mockSigner,
      });
      expect(prepareWriteContract).toHaveBeenCalledWith({
        abi: mockAbi,
        address: mockSmartContract.address,
        chainId: mockSmartContract.chainId,
        functionName: 'write',
        args: ['world'],
        signer: mockSigner,
      });

      expect(writeResult).toEqual([
        { element: 'hello', data: { hash: mockWriteResult.hash } },
        { element: 'world', data: { hash: mockWriteResult.hash } },
      ]);
    });
  });
});
