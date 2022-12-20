import { fetchSigner } from '@wagmi/core';
import SafeServiceClient from '@safe-global/safe-service-client';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import { EthAdapter } from '@safe-global/safe-core-sdk-types';
import { ethers } from 'ethers';
import Safe from '@safe-global/safe-core-sdk';
import {
  getSafeService,
  getSafeClients,
  executeTransaction,
  confirmTransaction,
  createSafeTransaction,
  getSigner,
  canExecuteTransaction,
} from '../safe';

const mockSigner = {
  _isSigner: true,
  getAddress: () => '0xSignerAddress',
};
const mockNetwork = 'mainnet';

const mockSafeAddress = '0xSafeAddress';
const mockSafeTransactionData = {
  to: '0xContractAddress',
  value: '0',
  data: 'txData',
};
const mockSafeTransaction = {
  data: mockSafeTransactionData,
};
const mockSenderSignature = {
  data: 'senderData',
};
const mockSafeTransactionHash = '0xSafeTxHash';
const mockConfirmationResponse = {
  signature: 'signature',
};
const mockExecutionReceipt = {
  to: '0xExecutionContractAddress',
  value: '0',
  data: 'receiptData',
};
const mockSafeSdk = {
  executeTransaction: jest.fn(() => ({
    transactionResponse: {
      wait: () => mockExecutionReceipt,
    },
  })),
  getThreshold: jest.fn(),
  signTransactionHash: jest.fn(() => mockSenderSignature),
  createTransaction: jest.fn(() => mockSafeTransaction),
  getTransactionHash: jest.fn(() => mockSafeTransactionHash),
  getAddress: jest.fn(() => mockSafeAddress),
};

const mockSafeService = {
  getTransaction: jest.fn(() => mockSafeTransaction),
  confirmTransaction: jest.fn(() => mockConfirmationResponse),
  proposeTransaction: jest.fn(),
};

const mockEthAdapter = {
  getProvider: jest.fn(),
  getSigner: jest.fn(),
};

jest.mock('@wagmi/core', () => ({
  fetchSigner: jest.fn(() => mockSigner),
  getNetwork: jest.fn(() => ({ chain: { network: mockNetwork } })),
}));
jest.mock('@safe-global/safe-core-sdk', () => ({
  create: jest.fn(() => mockSafeSdk),
}));
jest.mock('@safe-global/safe-service-client', () => jest.fn());
jest.mock('@safe-global/safe-ethers-lib', () => jest.fn());

describe('safe', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (fetchSigner as jest.Mock).mockImplementation(() => mockSigner);
    (SafeServiceClient as jest.Mock).mockImplementation(() => mockSafeService);
    (mockSafeService.getTransaction as jest.Mock).mockImplementation(
      () => mockSafeTransaction
    );
    (EthersAdapter as jest.Mock).mockImplementation(() => mockEthAdapter);
  });

  describe('getSigner', () => {
    it('returns the signer', async () => {
      (fetchSigner as jest.Mock).mockImplementation(() => ({
        _isSigner: true,
        address: '0x0',
      }));

      const signer = await getSigner();
      expect(signer).toEqual({
        _isSigner: true,
        address: '0x0',
      });
    });

    it('throws an error if signer is null', async () => {
      (fetchSigner as jest.Mock).mockImplementation(() => null);

      expect(async () => getSigner()).rejects.toThrow('Invalid signer');
    });

    it('throws an error if signer is invalid', async () => {
      (fetchSigner as jest.Mock).mockImplementation(() => ({
        _isSigner: false,
      }));

      expect(async () => getSigner()).rejects.toThrow('Invalid signer');
    });
  });

  describe('getSafeService', () => {
    it('returns SafeServiceClient initialized with the correct parameters', async () => {
      const result = getSafeService(mockEthAdapter as unknown as EthAdapter);

      expect(SafeServiceClient).toHaveBeenCalledWith({
        txServiceUrl: `https://safe-transaction-${mockNetwork}.safe.global`,
        ethAdapter: mockEthAdapter,
      });

      expect(result).toEqual(mockSafeService);
    });
  });

  describe('getSafeClients', () => {
    it('returns ethAdapter', async () => {
      const result = await getSafeClients(mockSafeAddress);

      expect(EthersAdapter).toHaveBeenCalledWith({
        ethers,
        signerOrProvider: mockSigner,
      });
      expect(result.ethAdapter).toEqual(mockEthAdapter);
    });

    it('returns signer', async () => {
      const result = await getSafeClients(mockSafeAddress);
      expect(result.signer).toEqual(await getSigner());
    });

    it('returns Safe service', async () => {
      const result = await getSafeClients(mockSafeAddress);
      expect(result.safeService).toEqual(
        getSafeService(mockEthAdapter as unknown as EthAdapter)
      );
    });

    it('returns Safe SDK', async () => {
      const result = await getSafeClients(mockSafeAddress);
      expect(Safe.create).toHaveBeenCalledWith({
        ethAdapter: mockEthAdapter,
        safeAddress: mockSafeAddress,
      });
      expect(result.safeSdk).toEqual(mockSafeSdk);
    });
  });

  describe('canExecuteTransaction', () => {
    describe('current signer already confirmed', () => {
      it('returns false if number of confirmations < threshold', async () => {
        (mockSafeSdk.getThreshold as jest.Mock).mockImplementation(() => 2);
        (mockSafeService.getTransaction as jest.Mock).mockImplementation(
          () => ({
            confirmations: [{ owner: mockSigner.getAddress() }],
          })
        );

        const result = await canExecuteTransaction(
          mockSafeAddress,
          mockSafeTransactionHash
        );
        expect(result).toEqual(false);
      });

      it('returns true if number of confirmations >= threshold', async () => {
        (mockSafeSdk.getThreshold as jest.Mock).mockImplementation(() => 2);
        (mockSafeService.getTransaction as jest.Mock).mockImplementation(
          () => ({
            confirmations: [{ owner: mockSigner.getAddress() }, {}],
          })
        );

        const result = await canExecuteTransaction(
          mockSafeAddress,
          mockSafeTransactionHash
        );
        expect(result).toEqual(true);
      });
    });

    describe('current signer has not yet confirmed', () => {
      it('returns false if number of confirmations < threshold - 1', async () => {
        (mockSafeSdk.getThreshold as jest.Mock).mockImplementation(() => 2);
        (mockSafeService.getTransaction as jest.Mock).mockImplementation(
          () => ({
            confirmations: undefined,
          })
        );

        const result = await canExecuteTransaction(
          mockSafeAddress,
          mockSafeTransactionHash
        );
        expect(result).toEqual(false);
      });

      it('returns true if number of confirmations >= threshold - 1', async () => {
        (mockSafeSdk.getThreshold as jest.Mock).mockImplementation(() => 2);
        (mockSafeService.getTransaction as jest.Mock).mockImplementation(
          () => ({
            confirmations: new Array(1),
          })
        );

        const result = await canExecuteTransaction(
          mockSafeAddress,
          mockSafeTransactionHash
        );
        expect(result).toEqual(true);
      });
    });
  });

  describe('confirmTransaction', () => {
    it('signs and confirms the transaction', async () => {
      const result = await confirmTransaction(
        mockSafeAddress,
        mockSafeTransactionHash
      );

      expect(mockSafeSdk.signTransactionHash).toHaveBeenCalledWith(
        mockSafeTransactionHash
      );
      expect(mockSafeService.confirmTransaction).toHaveBeenCalledWith(
        mockSafeTransactionHash,
        mockSenderSignature.data
      );

      expect(result).toEqual(mockConfirmationResponse);
    });
  });

  describe('executeTransaction', () => {
    it('executes transaction', async () => {
      const result = await executeTransaction(
        mockSafeAddress,
        mockSafeTransactionHash
      );

      expect(mockSafeSdk.executeTransaction).toHaveBeenCalledWith(
        mockSafeTransaction
      );

      expect(result).toEqual(mockExecutionReceipt);
    });
  });

  describe('createSafeTransaction', () => {
    it('creates safe transaction', async () => {
      const result = await createSafeTransaction(
        mockSafeAddress,
        mockSafeTransactionData
      );

      expect(mockSafeSdk.createTransaction).toHaveBeenCalledWith({
        safeTransactionData: mockSafeTransactionData,
      });

      expect(result.transaction).toEqual(mockSafeTransaction);
      expect(result.transactionHash).toEqual(mockSafeTransactionHash);
    });

    it('executes transaction if threshold is 1', async () => {
      (mockSafeSdk.getThreshold as jest.Mock).mockImplementation(() => 1);

      const result = await createSafeTransaction(
        mockSafeAddress,
        mockSafeTransactionData
      );

      expect(mockSafeSdk.executeTransaction).toHaveBeenCalledWith(
        mockSafeTransaction
      );

      expect(result.receipt).toEqual(mockExecutionReceipt);
    });

    it('proposes the transaction if threshold is >= 1', async () => {
      (mockSafeSdk.getThreshold as jest.Mock).mockImplementation(() => 2);

      const result = await createSafeTransaction(
        mockSafeAddress,
        mockSafeTransactionData
      );

      expect(mockSafeSdk.signTransactionHash).toHaveBeenCalledWith(
        mockSafeTransactionHash
      );
      expect(mockSafeService.proposeTransaction).toHaveBeenCalledWith({
        safeAddress: mockSafeAddress,
        safeTransactionData: mockSafeTransactionData,
        safeTxHash: mockSafeTransactionHash,
        senderAddress: mockSigner.getAddress(),
        senderSignature: mockSenderSignature.data,
      });

      expect(result.receipt).toBeUndefined();
    });
  });
});
