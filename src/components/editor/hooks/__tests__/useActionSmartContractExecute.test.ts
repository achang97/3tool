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

const mockEnqueueSnackbar = jest.fn();

jest.mock('wagmi', () => ({
  ...jest.requireActual('wagmi'),
  useSigner: jest.fn(() => ({ data: mockSigner })),
}));

jest.mock('@wagmi/core');

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(() => ({})),
  useAppDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
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
    const mockActionName = 'action1';
    const mockPrepareWriteResult = 'prepare write';
    const mockWriteCompletedReceipt = { transactionHash: '123', gasUsed: '1' };
    const mockWriteResult = { hash: '123', wait: jest.fn(async () => mockWriteCompletedReceipt) };

    beforeEach(() => {
      (prepareWriteContract as jest.Mock).mockImplementation(() => mockPrepareWriteResult);
      (writeContract as jest.Mock).mockImplementation(() => mockWriteResult);
    });

    it('returns undefined if data is not defined', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract(mockActionName, undefined);
      expect(writeResult).toBeUndefined();
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('enqueues snackbar with pending message', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      await result.current.writeSmartContract(mockActionName, {
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
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        `${mockActionName} pending on-chain confirmation`,
        {
          variant: 'warning',
          persist: true,
        }
      );
    });

    it('calls write function without payable amount', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract(mockActionName, {
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
      expect(mockWriteResult.wait).toHaveBeenCalled();
      expect(writeResult).toEqual({
        ...mockWriteCompletedReceipt,
        blockExplorerUrl: 'https://etherscan.io/tx/123',
      });
    });

    it('calls write function with evaluated payable amount', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract(mockActionName, {
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
      expect(mockWriteResult.wait).toHaveBeenCalled();
      expect(writeResult).toEqual({
        ...mockWriteCompletedReceipt,
        blockExplorerUrl: 'https://etherscan.io/tx/123',
      });
    });

    it('returns looped array of results', async () => {
      const { result } = renderHook(() => useActionSmartContractExecute());
      const writeResult = await result.current.writeSmartContract(mockActionName, {
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
      expect(mockWriteResult.wait).toHaveBeenCalledTimes(2);

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
        {
          element: 'hello',
          data: { ...mockWriteCompletedReceipt, blockExplorerUrl: 'https://etherscan.io/tx/123' },
        },
        {
          element: 'world',
          data: { ...mockWriteCompletedReceipt, blockExplorerUrl: 'https://etherscan.io/tx/123' },
        },
      ]);
    });
  });
});
