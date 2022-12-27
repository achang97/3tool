import { ethers } from 'ethers';
import { fetchSigner, getNetwork } from '@wagmi/core';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import Safe from '@safe-global/safe-core-sdk';
import {
  EthAdapter,
  SafeTransaction,
  SafeTransactionDataPartial,
} from '@safe-global/safe-core-sdk-types';
import SafeServiceClient, {
  SignatureResponse,
} from '@safe-global/safe-service-client';

export const getSigner = async (): Promise<ethers.Signer> => {
  const signer = await fetchSigner();

  // eslint-disable-next-line no-underscore-dangle
  if (!signer || !signer._isSigner) {
    throw new Error('Invalid signer');
  }

  return signer;
};

export const getSafeService = (ethAdapter: EthAdapter): SafeServiceClient => {
  const { chain } = getNetwork();

  const safeService = new SafeServiceClient({
    txServiceUrl: `https://safe-transaction-${chain?.network}.safe.global`,
    ethAdapter,
  });

  return safeService;
};

export const getSafeClients = async (
  safeAddress: string
): Promise<{
  signer: ethers.Signer;
  ethAdapter: EthersAdapter;
  safeSdk: Safe;
  safeService: SafeServiceClient;
}> => {
  const signer = await getSigner();
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
  });
  const safeService = getSafeService(ethAdapter);

  return {
    signer,
    ethAdapter,
    safeSdk,
    safeService,
  };
};

export const canExecuteTransaction = async (
  safeAddress: string,
  safeTransactionHash: string
): Promise<boolean> => {
  const { signer, safeSdk, safeService } = await getSafeClients(safeAddress);

  const threshold = await safeSdk.getThreshold();
  const transaction = await safeService.getTransaction(safeTransactionHash);
  const numConfirmations = transaction.confirmations?.length ?? 0;

  const signerAddress = await signer.getAddress();
  const hasConfirmed = transaction.confirmations?.some(
    (confirmation) => confirmation.owner === signerAddress
  );

  if (hasConfirmed) {
    return numConfirmations >= threshold;
  }

  return numConfirmations + 1 >= threshold;
};

export const executeTransaction = async (
  safeAddress: string,
  safeTransactionHash: string
): Promise<ethers.ContractReceipt | undefined> => {
  const { safeSdk, safeService } = await getSafeClients(safeAddress);

  const transaction = await safeService.getTransaction(safeTransactionHash);

  const executeTxResponse = await safeSdk.executeTransaction(transaction);
  const receipt = await executeTxResponse.transactionResponse?.wait();

  return receipt;
};

export const confirmTransaction = async (
  safeAddress: string,
  safeTransactionHash: string
): Promise<SignatureResponse> => {
  const { safeSdk, safeService } = await getSafeClients(safeAddress);

  // Sign the transaction
  const senderSignature = await safeSdk.signTransactionHash(
    safeTransactionHash
  );

  // Confirm the transaction
  const signatureResponse = await safeService.confirmTransaction(
    safeTransactionHash,
    senderSignature.data
  );

  return signatureResponse;
};

export const createSafeTransaction = async (
  safeAddress: string,
  safeTransactionData: SafeTransactionDataPartial
): Promise<{
  transaction: SafeTransaction;
  transactionHash: string;
  receipt?: ethers.ContractReceipt;
}> => {
  const { signer, safeSdk, safeService } = await getSafeClients(safeAddress);

  // Create a SafeTransaction
  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData,
  });
  const safeTransactionHash = await safeSdk.getTransactionHash(safeTransaction);

  let receipt: ethers.ContractReceipt | undefined;
  const threshold = await safeSdk.getThreshold();

  if (threshold <= 1) {
    // Execute the transaction immediately
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    receipt = await executeTxResponse.transactionResponse?.wait();
  } else {
    // Propose a transaction to the relayer
    const senderSignature = await safeSdk.signTransactionHash(
      safeTransactionHash
    );
    await safeService.proposeTransaction({
      safeAddress: safeSdk.getAddress(),
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTransactionHash,
      senderAddress: await signer.getAddress(),
      senderSignature: senderSignature.data,
    });
  }

  return {
    transaction: safeTransaction,
    transactionHash: safeTransactionHash,
    receipt,
  };
};
